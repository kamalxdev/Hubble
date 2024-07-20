import { wss } from "../index";
import { onlineUser, socketIdtoDBuserID } from "../lib/user";
import { iwebsocket } from "../types/ws";
import WebSocket from "ws";
import { Prisma, PrismaClient, User } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

// send message to everyone in the websocket connection
export function sendMessageToAll(data: any) {
  wss.clients.forEach(function each(client: iwebsocket) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// function to send message to specified user
export function sendMessageToSpecific(data: any, socketID: string) {
  wss.clients.forEach(function each(client: iwebsocket) {
    if (client?.id == socketID && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

async function updateChatsInDB(
  to: string,
  from: string,
  message: string,
  time: Date
) {
  try {
    if (to == from) {
      return console.log("Same user ");
    }
    const to_user = await prisma.user.findFirst({
      where: {
        id: to,
      },
    });
    const from_user = await prisma.user.findFirst({
      where: {
        id: from,
      },
    });
    const chatID = to_user?.myChats
      ? to_user?.myChats[from_user?.id as keyof typeof to_user.myChats]
      : null;
    if (chatID) {
      let current_messages = await prisma.chat.findFirst({
        where: {
          id: chatID,
        },
        select: {
          id: true,
          messages: true,
        },
      });
      if (!current_messages) {
        return console.log({ success: false, error: "Chat not found" });
      }
      let new_messages = current_messages.messages as Prisma.JsonArray;
      const updated_chats = await prisma.chat.update({
        where: {
          id: chatID,
        },
        data: {
          messages: new_messages
            ? [...new_messages, { to, from, message, time }]
            : [{ to, from, message, time }],
        },
      });
      if (!updated_chats) {
        return console.log({ success: false, error: "Cannot update chats" });
      }
    } else {
      const new_Chat = await prisma.chat.create({
        data: {
          for: [to, from],
          messages: [
            {
              to,
              from,
              message,
              time,
            },
          ],
        },
      });
      if (!new_Chat) {
        return console.log({
          success: false,
          error: "Error in creating new Chat",
        });
      }

      var to_user_updated_chats = to_user?.myChats as Prisma.JsonArray;

      var from_user_updated_chats = from_user?.myChats as Prisma.JsonArray;

      const to_user_updated = await prisma.user.update({
        where: {
          id: to,
        },
        data: {
          myChats: to_user_updated_chats
            ? { ...to_user_updated_chats, [from]: new_Chat.id }
            : { [from]: new_Chat.id },
        },
      });
      const from_user_updated = await prisma.user.update({
        where: {
          id: from,
        },
        data: {
          myChats: from_user_updated_chats
            ? { ...from_user_updated_chats, [to]: new_Chat.id }
            : { [to]: new_Chat.id },
        },
      });
      if (!to_user_updated && !from_user_updated) {
        return console.log({
          success: false,
          error: "Error in updating Chats",
        });
      }
    }

    return console.log({
      success: true,
      message: "Chat updated Succeessfully",
    });
  } catch (error) {
    console.log("Error in updating Chats: ", error);
    return console.log({ success: false, error: "Internal Server Error" });
  }
}

export function message(data: { event: string; payload: any }, ws: iwebsocket) {
  if (data?.event) {
    switch (data?.event) {
      case "user-connected":
        console.log("user-connected: ", JSON.stringify(data), ws.id);
        if (data?.payload?.id) {
          socketIdtoDBuserID.set(ws?.id, data?.payload?.id);
          onlineUser.set(data?.payload?.id, ws?.id);
          console.log({ socketIdtoDBuserID, onlineUser });
          sendMessageToAll({
            event: "user-online",
            payload: { id: data?.payload?.id },
          });
        }
        break;
      case "user-online-request":
        console.log("user-online-request ", JSON.stringify(data), ws.id);
        if (data?.payload?.id && onlineUser.has(data?.payload?.id)) {
          ws.send(
            JSON.stringify({
              event: "user-online-response",
              payload: { id: data?.payload?.id },
            })
          );
        }
        break;
      // listen to user message and redirect it to 'to user'

      case "message-send":
        console.log("message-send", JSON.stringify(data), ws.id);
        if (
          data?.payload?.to &&
          data?.payload?.from &&
          data?.payload?.message
        ) {
          updateChatsInDB(
            data?.payload?.to,
            data?.payload?.from,
            data?.payload?.message,
            data?.payload?.time || new Date()
          );
          socketIdtoDBuserID.forEach((value, key, map) => {
            if (value == data?.payload?.to) {
              sendMessageToSpecific(
                {
                  event: "message-recieved",
                  payload: {
                    from: data?.payload?.from,
                    message: data?.payload?.message,
                    time: data?.payload?.time || new Date(),
                  },
                },
                key
              );
            }
          });
        }
        break;
      //
      // sending user typing event
      case "message-send-start-typing":
        if (data?.payload?.to && data?.payload?.from) {
          socketIdtoDBuserID.forEach((value, key, map) => {
            if (value == data?.payload?.to) {
              sendMessageToSpecific(
                {
                  event: "message-recieved-start-typing",
                  payload: { id: data?.payload?.from },
                },
                key
              );
            }
          });
        }
        break;
      //
      // transferring call to given user
      case "call-user":
        if (data?.payload?.id && data?.payload?.type) {
          sendMessageToSpecific(
            {
              event: "call-user-recieved",
              payload: {
                id: socketIdtoDBuserID.get(ws?.id),
                type: data?.payload?.type,
              },
            },
            onlineUser.get(data?.payload?.id)
          );
        }
        break;
      //
      case "call-user-answer":
        if (data?.payload?.id) {
          sendMessageToSpecific(
            {
              event: "call-user-answer-recieved",
              payload: {
                id: socketIdtoDBuserID.get(ws?.id),
                accepted: data?.payload?.accepted,
                type: data?.payload?.type,
              },
            },
            onlineUser.get(data?.payload?.id)
          );
        }
        break;
      // listening to user call offer from sender and sending to the specified user i.e. reciever of call
      case "call-offer":
        console.log("call-offer: ", {
          data,
          user: onlineUser.has(data?.payload?.id),
        });

        if (
          data?.payload?.id &&
          data?.payload?.offer &&
          data?.payload?.type &&
          onlineUser.has(data?.payload?.id)
        ) {
          sendMessageToSpecific(
            {
              event: "call-offer-recieved",
              payload: {
                id: socketIdtoDBuserID.get(ws?.id),
                type: data?.payload?.type,
                offer: data?.payload?.offer,
              },
            },
            onlineUser.get(data?.payload?.id)
          );
        } else {
          //user not online
          sendMessageToSpecific(
            {
              event: "call-offer-rejected",
              payload: { id: data?.payload?.id, reason: "User not online" },
            },
            ws?.id
          );
        }
        break;
      // listening to call answer from reciever
      case "call-answer":
        console.log({ data, user: onlineUser.has(data?.payload?.id) });

        if (
          data?.payload?.id &&
          data?.payload?.answer &&
          data?.payload?.type &&
          onlineUser.has(data?.payload?.id)
        ) {
          sendMessageToSpecific(
            {
              event: "call-answer-recieved",
              payload: {
                id: socketIdtoDBuserID.get(ws?.id),
                answer: data?.payload?.answer,
                type: data?.payload?.type,
              },
            },
            onlineUser.get(data?.payload?.id)
          );
        } else {
          //user not online
          sendMessageToSpecific(
            {
              event: "call-answer-rejected",
              payload: { id: data?.payload?.id, reason: "User not online" },
            },
            ws?.id
          );
        }
        break;
      //
      // // connection senders(who initiated the call) reciever connection with recievers(whom the sender called) sender connection
      // case 'call-answered':
      //   if(data?.payload?.id && data?.payload?.type && data?.payload?.recieverANSWER){
      //     sendMessageToSpecific(
      //       {
      //         event: "call-answered-recieved",
      //         payload: { id: socketIdtoDBuserID.get(ws?.id), recieverANSWER: data?.payload?.recieverANSWER,type:data?.payload?.type },
      //       },
      //       onlineUser.get(data?.payload?.id)
      //     );
      //   }
      //   break;
      // //
      //
      case "call-user-iceCandidate":
        if (
          data?.payload?.id &&
          data?.payload?.iceCandidate &&
          data?.payload?.from &&
          onlineUser.has(data?.payload?.id)
        ) {
          sendMessageToSpecific(
            {
              event: "call-user-iceCandidate-recieved",
              payload: {
                id: socketIdtoDBuserID.get(ws?.id),
                from: data?.payload?.from,
                iceCandidate: data?.payload?.iceCandidate,
              },
            },
            onlineUser.get(data?.payload?.id)
          );
        }
        break;
      default:
        console.log("No event found");

        break;
    }
  } else {
    console.log("Event missing");
    ws.send("Event missing");
  }
}

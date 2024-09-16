import { onlineUser, socketIdtoDBuserID } from "../lib/user";
import { iwebsocket } from "../types/ws";
import { newCall, updateCall } from "./calls";
import { sendMessageToAll, sendMessageToSpecific, updateChatsInDB, updateReadChatsInDB } from "./chats";



export async function message(data: { event: string; payload: any }, ws: iwebsocket) {
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
            data?.payload?.time || new Date(),
            data?.payload?.status
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
                    status: data?.payload?.status,
                  },
                },
                key
              );
            }
          });
        }
        break;
      //
      //
      case "message-read":
        if (
          data?.payload?.id &&
          data?.payload?.chat?.message &&
          data?.payload?.chat?.time
        ) {
          updateReadChatsInDB(
            socketIdtoDBuserID.get(ws?.id),
            data?.payload?.id,
            data?.payload?.chat
          );
          sendMessageToSpecific(
            {
              event: "message-read-recieved",
              payload: {
                id: socketIdtoDBuserID.get(ws?.id),
                chat: data?.payload?.chat,
              },
            },
            onlineUser.get(data?.payload?.id)
          );
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
          const call = await newCall(data?.payload?.id,socketIdtoDBuserID.get(ws?.id),data?.payload?.type)
          sendMessageToSpecific(
            {
              event: "call-user-recieved",
              payload: {
                id: socketIdtoDBuserID.get(ws?.id),
                callID:call?.id,
                type: data?.payload?.type,
              },
            },
            onlineUser.get(data?.payload?.id)
          );
        }
        break;
      //
      case "call-user-answer":
        if (data?.payload?.id && data?.payload?.callID) {
          await updateCall(data?.payload?.callID,data?.payload?.accepted)
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
        //
        //
        case 'call-end':
          if(data?.payload?.id){
            sendMessageToSpecific(
              {
                event: "call-ended",
                payload: {
                  id: socketIdtoDBuserID.get(ws?.id),
                  reason:'user ended the call'
                },
              },
              onlineUser.get(data?.payload?.id)
            );
          }
          break;
        //
      default:
        console.log("No event found");

        break;
    }
  } else {
    console.log("Event missing");
    ws.send("Event missing");
  }
}


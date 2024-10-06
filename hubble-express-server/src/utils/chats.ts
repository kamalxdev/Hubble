import { wss } from "../index";
import WebSocket from "ws";
import { iwebsocket } from "../types/ws";
// import { prisma } from "../prisma";
import { Prisma, PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { findOnlineUsers } from "../lib/onlineuser";

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
export async function sendMessageToSpecific(data: {event:string,payload:{}}, send_to: string) {
  try {
    let sendTo = await findOnlineUsers('db',send_to);

    if (sendTo) {
      wss.clients.forEach(function each(client: iwebsocket) {
        if (client?.id == sendTo?.ws_id && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    }
  } catch (error) {
    console.log("Error in sending specific user messages: ", error);
  }
}

export async function updateReadChatsInDB(id: string, to: string) {
  try {
    const userchats = await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        myChats: true,
      },
    });
    const chatID =
      userchats?.myChats &&
      userchats.myChats[to as keyof typeof userchats.myChats];
    if (!chatID) {
      return console.log("No chat id found");
    }
    const chats_on_DB = await prisma.chat.findFirst({
      where: {
        id: chatID,
      },
    });
    if (!chats_on_DB) {
      return console.log("No chats found on DB");
    }
    let updated_messages = (chats_on_DB?.messages as Prisma.JsonArray).map(
      (message: any) => {
        if (message?.status == "unread" && message?.to == id) {
          return { ...message, status: "read" };
        }
        return message;
      }
    );

    await prisma.chat.update({
      where: {
        id: chats_on_DB.id,
      },
      data: {
        messages: updated_messages,
      },
    });
  } catch (error) {
    console.log("Error from updateReadChatsInDB:", error);
  }
}

export async function updateChatsInDB(
  to: string,
  from: string,
  message: string,
  time: Date,
  status: string
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
            ? [...new_messages, { to, from, message, time, status }]
            : [{ to, from, message, time, status }],
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
              status,
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

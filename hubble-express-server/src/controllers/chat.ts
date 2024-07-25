import { Request, Response } from "express";
import { Prisma, PrismaClient, User } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export async function getChats(req: Request, res: Response) {
  try {
    const id = req?.query?.id as string;
    const user = res.locals.user;
    if (user.myChats && user.myChats[id]) {
      // const chatId=user.myChats[id]
      const chats = await prisma.chat.findUnique({
        where: {
          id: user.myChats[id],
        },
        select: {
          id: true,
          messages: true,
        },
      });
      if (!chats) {
        return res.json({ success: false, error: "Chat not found" });
      }
      return res.json({ success: true, chats, chats_with: id });
    }
    return res.json({ success: false, error: "Chat not found" });
  } catch (error) {
    return res.json({ success: false, error: "Internal Server Error" });
  }
}

export async function getAllChats(req: Request, res: Response) {
  try {
    const user = res.locals.user as User;
    if (!user?.myChats) {
      return res.json({ success: false, error: "Chats not found" });
    }
    const allChats = await prisma.chat.findMany();
    var userchats = {};
    allChats
      .filter((value) => value.for[0] == user?.id || value.for[1] == user?.id)
      .map((c) => {
        let chat_with_user = c.for[0] == user?.id ? c.for[1] : c.for[0];
        let chat_with_user_messages =(c?.messages as {[key:string]:string}[])?.map((m)=>{
          return {
            type: chat_with_user == m?.to ? "reciever" : "sender",
            message: m?.message,
            time: m?.time,
            status:m?.status
          };
        })
        userchats=userchats?{...userchats,[chat_with_user]: chat_with_user_messages}:{[chat_with_user]: chat_with_user_messages}

      });
    if (!userchats) {
      return res.json({ success: false, error: "No Chats found" });
    }
    return res.json({ success: true, userchats });
  } catch (error) {
    return res.json({ success: false, error: "Internal Server Error" });
  }
}

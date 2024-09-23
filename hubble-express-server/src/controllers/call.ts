import { Call, Prisma, PrismaClient, User } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Request, Response } from "express";
import { getUserwithID } from "../utils/user";

const prisma = new PrismaClient().$extends(withAccelerate());

export async function getUserCallHistory(req: Request, res: Response) {
  try {
    const user = res.locals.user as User;
    const call_history = await prisma.call.findMany({
      where: {
        OR: [
          {
            to: user?.id,
          },
          {
            from: user?.id,
          },
        ],
      },
    });
    var sorted_call_history: Call[] | [] = [];

    // going to implement sorting algo in future
    if (call_history.length <= 1) {
      sorted_call_history = call_history;
    } else {
      sorted_call_history = call_history;
    }
    // final call history with user details
    let final_call_history = sorted_call_history.map(async (call) => {
      let friend = await prisma.user.findUnique({
        where: {
          id: call?.to == user?.id ? call?.from : call?.to,
        },
      });
      return {
        user: {
          id: friend?.id,
          name: friend?.name,
          username: friend?.username,
          avatar:friend?.avatar
        },
        call: {
          answer: call?.answer,
          id: call?.id,
          createdAt: call?.createdAt,
          type:call?.type,
          incoming: call?.to == user?.id
        },
      };
    });
    Promise.all(final_call_history).then((values) => {
      return res.json({ success: true, history: values });
    });
  } catch (error) {
    console.log("Error on getting user call history: ", error);
    return res.json({ success: false, error: "Error on getting call history" });
  }
}

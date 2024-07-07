import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Request, Response } from "express";
const prisma = new PrismaClient().$extends(withAccelerate());

export async function getUser(req: Request, res: Response) {
  try {
    const username = req?.query?.username as string;
    if (!username) {
      return res.json({ success: false, error: "username is required" });
    }
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    if (!user) {
      return res.json({
        success: false,
        error: `Cannot find user with @${username} username`,
      });
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.log("Error on getUser: ", error);
    return res.json({ success: false, error: "Internal Server Error" });
  }
}

export async function getUsersinBulk(req: Request, res: Response) {
  try {
    const allUser = await prisma.user.findMany();
    if(!allUser){
        return res.json({ success: false, error:"No users found" })
    }
    return res.json({ success: true, allUser });
  } catch (error) {
    console.log("Error on getUsersinBulk: ", error);
    return res.json({ success: false, error: "Internal Server Error" });
  }
}


export async function getUserVerification(req: Request, res: Response){
  try {
    const user =res.locals.user
    return res.json({success:true,user})
  } catch (error) {
    console.log("Error on getUserVerification: ", error);
    return res.json({ success: false, error: "Internal Server Error" });
  }
}
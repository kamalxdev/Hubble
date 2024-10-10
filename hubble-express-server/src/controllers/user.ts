import { PrismaClient, User } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Request, Response } from "express";
import { deleteFile, upload } from "../utils/cloudinary";
const prisma = new PrismaClient().$extends(withAccelerate());

export async function getUser(req: Request, res: Response) {
  try {
    const id = req?.query?.id as string;
    if (!id) {
      return res.json({ success: false, error: "username is required" });
    }
    const user = await prisma.user.findFirst({
      where: {
        id,
      },select:{
        id:true,username:true,avatar:true,name:true

      }
    });
    if (!user) {
      return res.json({
        success: false,
        error: `Cannot find user with @${id} username`,
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
    if (!allUser) {
      return res.json({ success: false, error: "No users found" });
    }
    return res.json({ success: true, allUser });
  } catch (error) {
    console.log("Error on getUsersinBulk: ", error);
    return res.json({ success: false, error: "Internal Server Error" });
  }
}

export async function getUserVerification(req: Request, res: Response) {
  try {
    const user = res.locals.user;
    return res.json({ success: true, user });
  } catch (error) {
    console.log("Error on getUserVerification: ", error);
    return res.json({ success: false, error: "Internal Server Error" });
  }
}

export async function getUserSearchResult(req: Request, res: Response) {
  try {
    const query = req?.query?.q as string;
    if (!query) return res.json({ success: false });
    const searchResult=await prisma.user.findMany({
      where:{
        OR:[
          {name:{
            contains:query,
            mode: 'insensitive'
          }},
          
          {username:{
            startsWith:query,
            mode: 'insensitive'
          }}
        ]
      },select:{
        name:true,
        avatar:true,
        id:true,
        username:true
      }
    })
    return res.json({ success: true, searchResult });
  } catch (error) {
    console.log("Error on getUserSearchResult: ", error);

    return res.json({ success: false, error: "Internal Server Error" });
  }
}

export async function getUserFriends(req: Request, res: Response) {
  try {
    const user = res.locals.user;
    const friendsID=user?.myChats && Object.entries(user?.myChats)?.map((u)=>{return {id:u[0]}})
    const friends=friendsID && await prisma.user.findMany({
      where: {
        OR:friendsID
      },select:{
        id:true,username:true,avatar:true,name:true
      }
    })
    return res.json({ success: true, friends });
  } catch (error) {
    console.log("Error on getUserFriends: ", error);

    return res.json({ success: false, error: "Internal Server Error" });
  }
}

export async function postUpdatedProfiledata(req: Request, res: Response) {
  try {
    const body = req.body;
    const user = res.locals.user;

    const updatedUser = await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: req.body,
    });
    if (!updatedUser) {
      return res.json({ success: false, error: "Error on updating user" });
    }
    return res.json({ success: true, updatedUser });
  } catch (error) {
    console.log("Error from updating profile data: ", error);
    return res.json({ success: false, error: "Internal Server Error" });
  }
}

export async function postUpdatedAvatar(req: Request, res: Response) {
  try {
    const user = res.locals.user;
    const path = req.file?.path;
    if (!path) {
      return res.json({ error: "Path is required", success: false });
    }
    const avatar = await upload(path as string);
    user?.avatar && await deleteFile(user?.avatar)
    const updated_avatar_on_DB = await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        avatar: avatar?.fileURL,
      },
    });
    if (!updated_avatar_on_DB)
      return res.json({
        error: "Error on updating in database",
        success: false,
      });
    return res.json({ avatar: avatar.fileURL, success: true });
  } catch (error) {
    console.log("Error from updating profile Image: ", error);
    return res.json({ success: false, error: "Internal Server Error" });
  }
}

export async function getLogOut(req: Request, res: Response) {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.json({
        success: false,
        error: "Only logged in user can log out",
      });
    }
    return res
      .cookie("auth", "")
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error on Log out of user: ", error);
    return res.json({ success: false, error: "Internal Server Error" });
  }
}

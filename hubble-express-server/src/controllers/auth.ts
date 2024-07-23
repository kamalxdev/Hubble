import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { loginSchema, registerSchema } from "../utils/zodSchema";
import { client } from "../redis";

const prisma = new PrismaClient().$extends(withAccelerate());
const SECRET = process.env.JWT_SECRET as string;
export async function postLogin(req: Request, res: Response) {
  try {
    const body = req.body;
    // validating data
    const validateBody = loginSchema.safeParse({
      email: body?.email,
      password: body?.password,
    });
    //
    // returning errors got on validating body
    if (!validateBody.success) {
      let errorMessages:{[key:string]:string} ={};
      (validateBody?.error?.errors).map((e) => {
        errorMessages[e?.path[0]]=e?.message
      })
      return res.json({ success: false, error: errorMessages });
    }
    //
    // check if user email exist
    // const USER = await prisma.user.findFirst({
    //   where: {
    //     email: body?.email,
    //   },
    //   cacheStrategy: { ttl: 60 },
    // });
    const allUser=await client.get('users')
    const USER=JSON.parse(allUser as string)?.filter((user:User)=>user.email==body?.email)
    if (!USER) {
      return res.json({
        success: false,
        error: "No user found with this email",
      });
    }
    //
    // checking user password
    const comparePassword = bcrypt.compareSync(body?.password, USER[0]?.password);
    if (!comparePassword) {
      return res.json({ success: false, error: "Incorrect Password" });
    }
    //
    // signing jwt  and creating token
    const token = jwt.sign(
      { email: USER[0].email, name: USER[0].name, username: USER[0].username },
      SECRET
    );
    // , 
    return res
      .cookie("auth", token,{ httpOnly: process.env.COOKIE_HTTPONLY=='true'?true:false,sameSite:'none',secure:true})
      .json({ success: true, USER:USER[0] });
    //
  } catch (error) {
    console.log("Error on PostLogin: ",error);
    return res.json({success:false,error:"Internal Server error"})
  }
}

export async function postRegister(req: Request, res: Response) {
 try {
    const body = req.body;
    
    // validating data
    const validateBody = registerSchema.safeParse({
      email: body?.email,
      name: body?.name,
      username: body?.username,
      password: body?.password,
    });
    //
    // returning errors got on validating body
    if (!validateBody.success) {
      let errorMessages:{[key:string]:string} ={};
      (validateBody?.error?.errors).map((e) => {
        errorMessages[e?.path[0]]=e?.message
      })
      return res.json({ success: false, error: errorMessages });
    }
    //
    // checking if username is unique
    const UserwithSameUsername = await prisma.user.findFirst({
      where:{
        username:body?.username
      },
      cacheStrategy: { ttl: 60 },
    })
    if (UserwithSameUsername) {
      return res.json({success:false, error:{username:"Username is there. Please choose unique username"}})
    }
    //
    // hashing password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(body?.password, salt);
    //
    // creating user on database
    const USER = await prisma.user.create({
      data: {
        email:body?.email,
        name:body?.name,
        username:body?.username,
        password: hashedPassword,
      }
    })
    //
    // setting users in redis
    const allusers=await prisma.user.findMany({})
    await client.set('users',JSON.stringify(allusers))
    //
    return res.json({ success: true, USER })
 } catch (error) {
    console.log("Error from PostRegister: ",error);
    return res.json({success:false,error:"Internal Server Error"})
    
 }
}

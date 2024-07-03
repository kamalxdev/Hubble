"use server";


import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { cookies } from 'next/headers'
import jwt, { JwtPayload } from "jsonwebtoken"

import bcrypt from "bcryptjs";
import { z } from "zod";

const prisma = new PrismaClient().$extends(withAccelerate())
const SECRET = process.env.JWT_SECRET as string

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().min(3, { message: "Must be 3 or more characters long" }),
  username: z.string().min(3, { message: "Must be 3 or more characters long" }),
  password: z.string().min(6, { message: "Must be 6 or more characters long" }),
});


const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Must be 6 or more characters long" }),
});





export async function register(
  email: string,
  name: string,
  username: string,
  password: string
) {
  try {
    // validating user data
    const validateUserData = registerSchema.safeParse({
      email,
      name,
      username,
      password,
    });
    if (!validateUserData.success) {
      const errorMessages = new Map();
      (validateUserData?.error?.errors).map((e) => {
        return errorMessages.set(e?.path[0], e.message);
      });
      return { success: false, error: errorMessages };
    }

    // checking if username is unique
    const UserwithSameUsername = await prisma.user.findFirst({
      where:{
        username
      },
      cacheStrategy: { ttl: 60 },
    })
    if (UserwithSameUsername) {
      return {success:false, error:"Username is present. Please choose unique username"}
    }
    // hashing password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const USER = await prisma.user.create({
      data: {
        email,
        name,
        username,
        password: hashedPassword,
      }
    }
  );
    return { success: true, USER };
  } catch (error) {
    console.log("Error from Register User", error);
  }
}



export async function login(
  email:string,
  password:string
){
  try {
    
    // validating user data
    const validateUserData = loginSchema.safeParse({
      email,
      password,
    });
    if (!validateUserData.success) {
      const errorMessages = new Map();
      (validateUserData?.error?.errors).map((e) => {
        return errorMessages.set(e?.path[0], e.message);
      });
      return { success: false, error: errorMessages };
    }


    // check if user email exist 
    const USER= await prisma.user.findFirst({
      where:{
        email
      },
      cacheStrategy: { ttl: 60 },
    })
    if(!USER){
      return {success:false,error:"No user found with this email"}
    }

    
    // checking user password 
    const comparePassword= bcrypt.compareSync(password,USER.password);
    if(!comparePassword){
      return {success:false,error:"Incorrect Password"}
    }

    // signing jwt  and creating token
    const token = jwt.sign({email:USER.email,name:USER.name,username:USER.username},SECRET )
    cookies().set("auth",token)
    return {success:true,USER}
  } catch (error) {
    console.log("Error on Logging user",error);
    
  }
}


interface iauthCokkieData extends JwtPayload{
  username:string,
  name:string,
  email:string
}


export async function verifyUser(){
  const authCookie=cookies().get("auth")
  if(!authCookie || !authCookie?.value){
    return {success:false,error:"No auth cookie found"}
  }
  const cookieDecodedData=jwt.verify(authCookie?.value,SECRET) as iauthCokkieData
  // console.log({cookieDecodedData});
  
  if(!cookieDecodedData){
    return {success:false,error:"JWT token signature is not valid"}
  }
  const USER = await prisma.user.findFirst({
    where:{
      username:cookieDecodedData?.username
    },
    cacheStrategy: { ttl: 60 },
  })
  return {success:true,USER}
}
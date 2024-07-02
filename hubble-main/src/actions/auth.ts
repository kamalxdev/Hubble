"use server";


import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'



import bcrypt from "bcryptjs";
import { z } from "zod";

const prisma = new PrismaClient().$extends(withAccelerate())

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().min(3, { message: "Must be 3 or more characters long" }),
  username: z.string().min(3, { message: "Must be 3 or more characters long" }),
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

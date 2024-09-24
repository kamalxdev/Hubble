import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { loginSchema, registerSchema } from "../utils/zodSchema";
import { client } from "../redis";
import sendEmailWithOTP from "../lib/generateOTP";

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
      let errorMessages: { [key: string]: string } = {};
      (validateBody?.error?.errors).map((e) => {
        errorMessages[e?.path[0]] = e?.message;
      });
      return res.json({ success: false, error: errorMessages });
    }
    //
    // check if user email exist
    const USER = await prisma.user.findFirst({
      where: {
        email: body?.email,
      },
      cacheStrategy: { ttl: 60 },
    });
    if (!USER) {
      return res.json({
        success: false,
        error: "No user found with this email",
      });
    }
    //
    // checking user password
    const comparePassword = bcrypt.compareSync(body?.password, USER?.password);
    if (!comparePassword) {
      return res.json({ success: false, error: "Incorrect Password" });
    }
    //
    // signing jwt  and creating token
    const token = jwt.sign({ id: USER?.id }, SECRET);
    // ,
    return res
      .cookie("auth", token, {
        httpOnly: process.env.COOKIE_HTTPONLY == "true" ? true : false,
        sameSite: "none",
        secure: true,
      })
      .json({ success: true, USER });
    //
  } catch (error) {
    console.log("Error on PostLogin: ", error);
    return res.json({ success: false, error: "Internal Server error" });
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
      otp: parseInt(body?.otp),
    });
    //
    // returning with errors got on validating body
    if (!validateBody.success) {
      let errorMessages: { [key: string]: string } = {};
      (validateBody?.error?.errors).map((e) => {
        errorMessages[e?.path[0]] = e?.message;
      });
      return res.json({ success: false, error: errorMessages });
    }
    //
    // checking if username is unique
    const UserwithSameUsername = await prisma.user.findFirst({
      where: {
        username: body?.username,
      },
      cacheStrategy: { ttl: 60 },
    });
    if (UserwithSameUsername) {
      return res.json({
        success: false,
        error: { username: "Please choose unique username" },
      });
    }
    //
    // checking if email is unique
    const UserwithSameEmail = await prisma.user.findFirst({
      where: {
        email: body?.email,
      },
      cacheStrategy: { ttl: 60 },
    });
    if (UserwithSameEmail) {
      return res.json({
        success: false,
        error: { email: "An account with this email is present" },
      });
    }
    //
    // validate OTP
    const otp_stored_on_redis = await client.get(`OTP:${body?.email}`);
    if (otp_stored_on_redis != body?.otp) {
      return res.json({
        success: false,
        error: {otp:"Incorrect OTP"},
      });
    }
    //
    // hashing password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(body?.password, salt);
    //
    // creating user on database
    const USER = await prisma.user.create({
      data: {
        email: body?.email,
        name: body?.name,
        username: body?.username,
        password: hashedPassword,
      },
    });
    //
    return res.json({ success: true, USER });
  } catch (error) {
    console.log("Error from PostRegister: ", error);
    return res.json({ success: false, error: "Internal Server Error" });
  }
}

export async function postSendOTP(req: Request, res: Response) {
  try {
    const body = req.body;
    if (!body.email) {
      return res.json({ succkamaless: false, error: "Email is required" });
    }
    const mail = await sendEmailWithOTP(
      body.email,
      `${
        body?.for && body?.for == "register"
          ? "OTP to verify your email"
          : "OTP to change your Hubble account email"
      }`,
      `${
        body?.for && body?.for == "register"
          ? "This email contains otp to verify your email address"
          : "This email contains otp to change your hubble account email address"
      }`
    );
    return res.json(mail);
  } catch (error) {
    console.log("Error on sending OTP: ", error);
    return res.json({ success: false, error: "Internal Server Error" });
  }
}

export async function postValidateOTP(req: Request, res: Response) {
  try {
    const body = req.body;
    if (!body.email && !body?.otp) {
      return res.json({ success: false, error: "Email and OTP is required" });
    }
    const otp_stored_on_redis = await client.get(`OTP:${body?.email}`);
    if (otp_stored_on_redis != body?.otp) {
      return res.json({
        success: false,
        error: `OTP does not match for email ${body?.email}`,
      });
    }
    return res.json({ success: true, message: `OTP is correct` });
  } catch (error) {
    console.log("Error fon sending OTP: ", error);
    return res.json({ success: false, error: "Internal Server Error" });
  }
}

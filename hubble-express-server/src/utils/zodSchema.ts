import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  otp:z.number().min(7,{message :"Must be of 7 digits"}),
  name: z.string().min(3, { message: "Must be 3 or more characters long" }),
  username: z.string().min(3, { message: "Must be 3 or more characters long" }),
  password: z.string().min(6, { message: "Must be 6 or more characters long" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Must be 6 or more characters long" }),
});

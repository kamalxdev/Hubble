import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const SECRET = process.env.JWT_SECRET as string;
const prisma = new PrismaClient().$extends(withAccelerate());

interface iJWTdata extends JwtPayload {
  email: string;
}

export async function authorizationHeader(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization as string;
  if (!authorization) {
    return res.json({
      success: false,
      error: "Authorization token missing from header",
    });
  }
  // verify the user token
  jwt.verify(authorization, SECRET, async (err, decoded) => {
    if (err) {
      return res.json({ success: false, error: "Invalid User" });
    }
    // check if the user exists
    await prisma.user
      .findUnique({
        where: {
          email: (decoded as iJWTdata)?.email,
        },
      })
      .then((data) => {
        if (!data) {
          return res
            .json({success: false, error: "User not found" });
        }
        res.locals.user = data;
        next();
      })
      .catch((err) => {
        console.log("Error on finding user", err);
        return res
          .json({ success: false,error: "Internal Server Error"});
      });
  });
}

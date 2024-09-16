import { Call, PrismaClient } from "@prisma/client";
// import { prisma } from "../prisma";


import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());


export async function newCall(to: string, from: string, type: string) {
  try {
    const call = await prisma.call.create({
      data: {
        to,
        from,
        type,
      },
    });
    return call;
  } catch (error) {
    console.log("Error on creating a new call on DB: ", error);
  }
}

// export async function findUserCallHistory(id: string) {
//     try {
//       const incoming_call = await prisma.call.findMany({
//         where: {
//           to:id
//         },
//       });
//       const outgoing_call = await prisma.call.findMany({
//         where: {
//           from:id
//         },
//       });
//       return {...incoming_call,...outgoing_call};
//     } catch (error) {
//       console.log("Error on getting a call on DB: ", error);
//     }
//   }

export async function updateCall(id: string,answer:boolean) {
  try {
    const updatedCall = await prisma.call.update({
      where: {
        id,
      },data:{
        answer
      }
    });
    return updatedCall;
  } catch (error) {
    console.log("Error on upadating a call on DB: ", error);
  }
}

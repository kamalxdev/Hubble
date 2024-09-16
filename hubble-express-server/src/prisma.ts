import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
export const prisma = new PrismaClient().$extends(withAccelerate());




export async function startPrisma(){
    try {
        await prisma.$connect()
        console.log("Connected to prisma");
    } catch (error) {
        console.log("error on connecting to prisma",error);
    }
}
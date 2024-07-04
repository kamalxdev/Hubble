"use server";


import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
const prisma = new PrismaClient().$extends(withAccelerate())




export async function getAllUserfromDB(){
    const allUser=await prisma.user.findMany()
    return {success:true,allUser}
}


export async function getUserDetails(username:string){
    const user=await prisma.user.findFirst({
        where:{
            username
        }
    })
    if(!user){
        return {success:false,error:`Cannot find user with @${username} username`}
    }
    return {success:true,user}
}
import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { WebSocketServer } from "ws";
import {iwebsocketServer} from './types/ws'
import {websocket} from './socket'
import {client, startRedis} from './redis'
import { prisma, startPrisma } from "./prisma";

configDotenv();






const app = express();




// configuring app middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true ,exposedHeaders: ["Set-cookie"]}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// configuring routes
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/user", require("./routes/user"));
app.use("/api/v1/chat", require("./routes/chat"));
app.use("/api/v1/call", require("./routes/call"));





startPrisma().then(()=>{
    startRedis().then(async ()=>{
        const allusers=await prisma.user.findMany({})
        await client.set('users',JSON.stringify(allusers))
        console.log("all user set");
        const allchats=await prisma.chat.findMany({})
        await client.set('chats',JSON.stringify(allchats))
        console.log("all chats set");        
    }).catch((err)=>{
        console.log("Error on setting user to redis: ",err);
    })
})

var httpServer=app.listen(4000)
export const wss = new WebSocketServer({ server:httpServer}) as iwebsocketServer;
websocket(wss)




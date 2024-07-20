import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { WebSocketServer } from "ws";
import {iwebsocketServer} from './types/ws'
import {websocket} from './socket'
import {startRedis} from './redis'
configDotenv();






const app = express();




// configuring app middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true ,exposedHeaders: ["Set-cookie"]}));
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// configuring routes
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/user", require("./routes/user"));
app.use("/api/v1/chat", require("./routes/chat"));





startRedis()
var httpServer=app.listen(4000)
export const wss = new WebSocketServer({ server:httpServer}) as iwebsocketServer;
websocket(wss)




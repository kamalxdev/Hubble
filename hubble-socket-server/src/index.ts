import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

configDotenv();

const app = express();
app.use(cors({ origin: "*" }));
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  return res.send(`Hello World`);
});

const usernameToSocket = new Map();

io.on("connection", (socket) => {
  console.log("Connection: ", socket.id);

  socket.on("user-connected", (data) => {
    console.log("user-connected: ", data);
    if(data.user.username && data.socketID){
      usernameToSocket.set(data?.user?.username,data?.socketID)
    }
    console.log({usernameToSocket});
  });
  // handling disconnection
  socket.on('disconnect',(reason)=>{
    usernameToSocket.forEach((value,key,map)=>{
      if(value==socket.id){
        usernameToSocket.delete(key)
      }
    })
    console.log({usernameToSocket});
  })
  socket.on('user-online-request',(data)=>{
    if(data?.requestFor && usernameToSocket.has(data?.requestFor)){
      io.to(socket.id).emit('user-online-response',{online:true,username:data?.requestFor})
    }
    
  })
  socket.on('message-send',(data)=>{
    console.log("message send request",{data,socket:socket.id});
    socket.to(usernameToSocket.get(data.to)).emit('message-recieved',{message:data.message,from:data.from})
  })
});

httpServer.listen(4000, () => {
  console.log("Server is listenig on port 4000");
});

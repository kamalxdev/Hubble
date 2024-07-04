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
    // socket.to(socket.id).emit("user-available",usernameToSocket)
    console.log({usernameToSocket});
  });
  socket.on('message-send',(data)=>{
    console.log("message send request",{data,socket:socket.id});
    socket.to(usernameToSocket.get(data.to)).emit('message-recieved',{message:data.message,from:data.from})
  })
  
});

httpServer.listen(4000, () => {
  console.log("Server is listenig on port 4000");
});

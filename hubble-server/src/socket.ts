import { Server } from "socket.io";

export function socketHandler(
  usernameToSocket: Map<string, string>,
  httpServer: any
) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
    },
  });
  // making socket connection
  io.on("connection", (socket) => {
    // taking user details on connection and mapping them username->socket.id
    socket.on("user-connected", (data) => {
      console.log("user-connected: ", data);
      if (data?.username && socket.id) {
        usernameToSocket.set(data?.username, socket.id);
      }
      console.log({ usernameToSocket });
    });
    // handling disconnection: removing user from usernameToSocket map
    socket.on("disconnect", (reason) => {
      usernameToSocket.forEach((value, key, map) => {
        if (value == socket.id) {
          usernameToSocket.delete(key);
        }
      });
      console.log({ usernameToSocket });
    });
    // listening to user request to verify if the given user is online
    socket.on("user-online-request", (data) => {
      if (data?.requestFor && usernameToSocket.has(data?.requestFor)) {
        // responding to the the user that the user is online
        io.to(socket.id).emit("user-online-response", {
          online: true,
          username: data?.requestFor,
        });
      }
    });
    // listening to message send request of user
    socket.on("message-send", (data) => {
      console.log("message send request", { data, socket: socket.id });
      // transferring message to the given user
      socket
        .to(usernameToSocket.get(data.to) as string)
        .emit("message-recieved", { message: data?.message, from: data?.from ,time:data?.time});
    });
  });
}

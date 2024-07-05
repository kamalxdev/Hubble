"use client";

import { createContext, useContext, useEffect } from "react";
import { Socket, io } from "socket.io-client";
import { currentUser, iCurrentUserContext } from "./user";
import { OpenChatContext, iOpenChatValue } from "./OpenedChat";

const socket = io(process.env.NEXT_PUBLIC_SERVER_URL as string);

export type iSocketContext = {
  socket: Socket;
};

export const socketContext = createContext<iSocketContext>({ socket });

export function SocketContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useContext(currentUser) as iCurrentUserContext;
  const openChat = useContext(OpenChatContext) as iOpenChatValue;

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket conected: ", socket.id);

      socket.on("message-send", (data) => {
        console.log("messsage send", data);
      });
      // socket.emit("message-send",{from:""})
    });
    if (user) {
      socket.emit("user-connected", {
        user: { username: user.currentuser.username },
        socketID: socket.id,
      });
    }
  }, [user]);
  socket.on("message-recieved", (data) => {
      
    if (openChat?.allUserChats && openChat?.allUserChats[data?.from]) {
      openChat.setAllUserChats({
        ...openChat?.allUserChats,
        [data?.from]: [
          ...openChat?.allUserChats[data?.from],
          { type: "sender", message: data.message },
        ],
      });
    } else {
      openChat.setAllUserChats({
        ...openChat?.allUserChats,
        [data?.from]: [{ type: "sender", message: data.message }],
      });
    }
  });
  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  );
}

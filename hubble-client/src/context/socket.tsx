import { createContext, useContext, useEffect } from "react";
import { currentUser, iCurrentUserContext } from "./user";
import { OpenChatContext, iOpenChatValue } from "./OpenedChat";
import { listenMessages } from "../utils/socketMessages";
import { iwebRTCcontext, webRTCcontext } from "./webRTC";

var socket = new WebSocket(
  import.meta.env.VITE_SERVER_URL as string
);

export const socketContext = createContext<WebSocket>(socket);

export function SocketContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useContext(currentUser) as iCurrentUserContext;
  const openChat = useContext(OpenChatContext) as iOpenChatValue;
  const webRTC = useContext(webRTCcontext) as iwebRTCcontext
  socket.onopen = () => {
    console.log("Connection established");
  };
  useEffect(() => {
    // sending user id
    if (user?.user) {
      socket.send(
        JSON.stringify({
          event: "user-connected",
          payload: { id: user?.user?.id },
        })
      );
    }
    //
  }, [user?.user]);
  useEffect(() => {
    // socket.send(JSON.stringify({event:"",payload:{}}))
    // checking if given user is online
    if(openChat?.currentUniqueUserId){
      socket.send(
        JSON.stringify({
          event: "user-online-request",
          payload: { id: openChat.currentUniqueUserId },
        })
      );
    }
    //
  }, [openChat.currentUniqueUserId]);
  socket.onmessage = (message) => {
    try {
    listenMessages(openChat,socket,webRTC,JSON.parse(message.data))
    } catch (error) {
      
      console.log("error on listening events");
      
    }
  };


  socket.onclose =()=>{
    console.log("Disconnected");
    try {
      setTimeout(()=>{
        socket = new WebSocket(
          import.meta.env.VITE_SERVER_URL as string
        )
      },1000)
    } catch (error) {
      alert("Cannot connect to server")
      console.log("websocket connection failed: ",error);
      
    }
  }
  return (
    <socketContext.Provider value={socket}>{children}</socketContext.Provider>
  );
}

import { createContext, useContext, useEffect } from "react";
import { currentUser, iCurrentUserContext } from "./user";
import { OpenChatContext, iOpenChatValue } from "./OpenedChat";
import { listenMessages } from "../utils/socketMessages";

const socket = new WebSocket(
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
  socket.onopen = () => {
    console.log("Connection established");
  };
  useEffect(() => {
    // sending user id
    if (user?.currentuser?.response?.user) {
      socket.send(
        JSON.stringify({
          event: "user-connected",
          payload: { id: user?.currentuser?.response?.user?.id },
        })
      );
    }
    //
  }, [user.currentuser]);
  useEffect(() => {
    // socket.send(JSON.stringify({event:"",payload:{}}))
    // checking if given user is online
    socket.send(
      JSON.stringify({
        event: "user-online-request",
        payload: { id: openChat.currentUniqueUserId },
      })
    );
    //
  }, [openChat.currentUniqueUserId]);
  socket.onmessage = (message) => {
    console.log("Message received:", message.data);
    listenMessages(openChat,JSON.parse(message.data))
  };
  return (
    <socketContext.Provider value={socket}>{children}</socketContext.Provider>
  );
}


import { createContext, useContext, useEffect } from "react";
import { Socket, io } from "socket.io-client";
import { currentUser, iCurrentUserContext } from "./user";
import { OpenChatContext, iOpenChatValue } from "./OpenedChat";

const socket = io(import.meta.env.VITE_SERVER_URL as string);


export const socketContext = createContext<Socket>(socket );

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
    if (user.currentuser) {
      socket.emit("user-connected", {
        username: user?.currentuser?.response?.user?.username 
      });
    }
  }, [user]);

  // checking if given user is online
  useEffect(()=>{
    socket.emit('user-online-request',{requestFor:openChat.currentUniqueUserId})
  },[openChat.currentUniqueUserId]) 

  // listening and handling user offline
  socket.on('user-offline',(data)=>{
    console.log("got user offline req: ",{data,user:openChat.currentUniqueUserId});
    
    if(data?.username && openChat.currentUniqueUserId==data?.username){
      openChat.setCurrentUserOnline(false)
    }
  })
  // listening to user online
  socket.on('user-online',(data)=>{
    if(data?.username && openChat.currentUniqueUserId==data?.username){
      openChat.setCurrentUserOnline(true)
    }
  }) 
  // giving online response
  socket.on('user-online-response',(data)=>{
    if(data?.online && openChat.currentUniqueUserId==data?.username){
      openChat.setCurrentUserOnline(true)
    }
  })
  // recieving message
  socket.on("message-recieved", (data) => {
    if (openChat?.allUserChats && openChat?.allUserChats[data?.from]) {
      openChat.setAllUserChats({
        ...openChat?.allUserChats,
        [data?.from]: [
          ...openChat?.allUserChats[data?.from],
          { type: "sender", message: data.message,time:data?.time },
        ],
      });
    } else {
      openChat.setAllUserChats({
        ...openChat?.allUserChats,
        [data?.from]: [{ type: "sender", message: data.message,time:data?.time }],
      });
    }
  });
  return (
    <socketContext.Provider value={socket }>
      {children}
    </socketContext.Provider>
  );
}

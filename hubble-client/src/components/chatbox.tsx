import { EllipsisVertical, Phone, Send, User, Video } from "lucide-react";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { iOpenChatValue, OpenChatContext } from "../context/OpenedChat";
import { currentUser, iCurrentUserContext } from "../context/user";
import { Link } from "react-router-dom";
import { socketContext } from "../context/socket";
import ChatBoxLoader from "../loader/chatbox";
import {iwebRTCcontext, webRTCcontext } from "../context/webRTC";

function ChatBox() {
  const openChat = useContext(OpenChatContext) as iOpenChatValue;
  const divref = useRef(null);

  useEffect(() => {
    if (divref.current) {
      (divref?.current as HTMLElement)?.scrollIntoView({ behavior: "smooth" });
    }
  });
  
  if (!openChat.currentUniqueUserId) {
    return <div className="bg-slate-950 w-full h-full"></div>;
  }
  if (openChat?.loading) {
    return <ChatBoxLoader />;
  }
  let currentDate: Date;
  return (
    <section className="flex flex-col justify-between transition overflow-hidden bg-slate-950">
      <ChatTopBar />
      <div className="relative h-[86vh] overflow-hidden overflow-y-scroll ">
        <div className="inline-flex flex-col gap-5 w-full py-5 px-10 overflow-hidden  ">

          {openChat?.currentUserChats?.map((chat, index) => {
            let chatDate = new Date(chat?.time);

            if (!currentDate) {
              currentDate = chatDate;
              return (
                <Chat
                  from={chat.type as "sender" | "reciever"}
                  key={index}
                  message={chat.message}
                  time={chatDate}
                  showDate
                />
              );
            } else if (
              currentDate?.getDate() != chatDate?.getDate() ||
              currentDate?.getMonth() != chatDate?.getMonth() ||
              currentDate?.getFullYear() != chatDate?.getFullYear()
            ) {
              currentDate = chatDate;
              return (
                <Chat
                  from={chat.type as "sender" | "reciever"}
                  key={index}
                  message={chat.message}
                  time={chatDate}
                  showDate
                />
              );
            } else {
              return (
                <Chat
                  from={chat.type as "sender" | "reciever"}
                  key={index}
                  message={chat.message}
                  time={chatDate}
                />
              );
            }
          })}
        </div>
        <div ref={divref}></div>
      </div>
      <MessageInput id={openChat?.currentUserDetails?.id} />
    </section>
  );
}

const ChatTopBar = memo(function ChatTopBar() {
  const openChat = useContext(OpenChatContext) as iOpenChatValue;
  const webRTC = useContext(webRTCcontext) as iwebRTCcontext;
  const socket = useContext(socketContext) as WebSocket;
  function handleCreateCall(type: string) {
    navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then( (stream) => {
      webRTC?.setCall({ ...webRTC?.call,
        user: { id: openChat.currentUniqueUserId },
        type,
        answered: false,
        Useris:'sender'
      })
      socket.send(JSON.stringify({event:'call-user',payload:{id: openChat.currentUniqueUserId,type}}))
        
        
        
      });
  }
  const topBarLeftStyling = "hover:bg-slate-700 transition p-3 rounded-md ";
  return (
    <div className="flex h-[8vh] w-full top-0 justify-between items-center bg-slate-800 px-10 py-2 text-white">
      <Link
        to={"/"}
        className="inline-flex justify-center items-center gap-3 p-2 rounded-md hover:bg-slate-700 transition"
      >
        <span className="flex justify-center items-center border rounded-full p-1 ">
          <User />
        </span>
        <span className="flex flex-col transition-all">
          <span className="transition-all flex justify-center items-center gap-2">
            <h1 className="text-xl">{openChat.currentUserDetails?.name}</h1>
            {openChat?.currentUserOnline && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            )}
          </span>
          {openChat?.typing &&
            openChat?.typing[openChat?.currentUniqueUserId] && (
              <h6 className="text-xs text-green-500 font-semibold transition-all">
                typing...
              </h6>
            )}
        </span>
      </Link>
      <span className="flex gap-2">
        <button
          type="button"
          onClick={() => handleCreateCall("voice")}
          className={topBarLeftStyling}
        >
          <Phone size={20} />
        </button>
        <button
          type="button"
          onClick={() => handleCreateCall("video")}
          className={topBarLeftStyling}
        >
          <Video size={20} />
        </button>
        <button type="button" className={topBarLeftStyling}>
          <EllipsisVertical size={20} />
        </button>
      </span>
    </div>
  );
});

const MessageInput = memo(function MessageInput({ id }: { id: string }) {
  const openChat = useContext(OpenChatContext) as iOpenChatValue;
  const user = useContext(currentUser) as iCurrentUserContext;
  const socket = useContext(socketContext) as WebSocket;
  const [message, setMessage] = useState("");
  function handleSendMessage() {
    let time = new Date();
    if (!message) return;
    socket.send(
      JSON.stringify({
        event: "message-send",
        payload: {
          to: id,
          from: user?.currentuser?.response?.user?.id,
          message,
          time,
        },
      })
    );
    if (openChat?.allUserChats && openChat?.allUserChats[id]) {
      openChat.setAllUserChats({
        ...openChat?.allUserChats,
        [id]: [
          ...openChat?.allUserChats[id],
          { type: "reciever", message, time },
        ],
      });
    } else {
      openChat.setAllUserChats({
        ...openChat?.allUserChats,
        [id]: [{ type: "reciever", message, time }],
      });
    }

    setMessage("");
  }
  return (
    <div className="flex relative bottom-0 justify-between text-white bg-slate-700 shadow-inner px-5 py-2 gap-5 h-[6vh]">
      <input
        type="text"
        autoFocus
        autoCorrect="on"
        // autoComplete="on"
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) =>
          e.key == "Enter"
            ? handleSendMessage()
            : socket.send(
                JSON.stringify({
                  event: "message-send-start-typing",
                  payload: {
                    to: id,
                    from: user?.currentuser?.response?.user?.id,
                  },
                })
              )
        }
        className="outline-none w-full shadow-inner px-5 py-2 text-lg rounded-md bg-slate-800 "
        placeholder="Type a message..."
        value={message}
      />{" "}
      <button
        onClick={handleSendMessage}
        className="px-3  py-1 bg-green-500 text-white shadow hover:shadow-2xl transition rounded-md"
      >
        <Send size={20} />
      </button>
    </div>
  );
});

type iChatProps = {
  from: "sender" | "reciever";
  message: string;
  time: Date;
  showDate?: boolean;
};

const Chat = memo(function Chat(props: iChatProps) {
  return (
    <>
      {props.showDate && (
        <div className="w-full flex justify-center">
          <span className="text-white bg-slate-800 w-fit rounded-sm text-xs py-1 px-3 ">
            {new Date()?.toJSON().slice(0, 10).replace(/-/g, "/") ==
            new Date(props?.time)?.toJSON().slice(0, 10).replace(/-/g, "/")
              ? "Today"
              : new Date(props?.time)?.toJSON().slice(0, 10).replace(/-/g, "/")}
          </span>
        </div>
      )}
      <div
        className={`inline-flex flex-col w-fit max-w-md md:max-w-xl px-3 rounded-md ${
          props.from == "sender"
            ? "text-white bg-slate-700"
            : "text-black bg-slate-200 ml-auto"
        }`}
      >
        <span
          className="text-xl/1 mt-2"
          style={{ overflow: "hidden", wordBreak: "break-all" }}
        >
          {props.message}
        </span>
        <span className="inline-flex justify-end text-xs ml-auto opacity-70">
          {new Date(props?.time)
            ?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            .toLowerCase()}
        </span>
      </div>
    </>
  );
});

export default memo(ChatBox);

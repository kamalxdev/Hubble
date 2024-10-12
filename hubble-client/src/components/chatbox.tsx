import { ArrowLeft, CheckCheck, Phone, Send, Video } from "lucide-react";
import { memo, useContext, useEffect, useRef, useState } from "react";
import {
  icurrentUserChats,
  iOpenChatValue,
  OpenChatContext,
} from "../context/OpenedChat";
import { currentUser, iCurrentUserContext } from "../context/user";
import { Link } from "react-router-dom";
import { socketContext } from "../context/socket";
import ChatBoxLoader from "../loader/chatbox";
import { iwebRTCcontext, webRTCcontext } from "../context/webRTC";

function ChatBox() {
  const openChat = useContext(OpenChatContext) as iOpenChatValue;
  const socket = useContext(socketContext) as WebSocket;

  const divref = useRef(null);

  useEffect(() => {
    if (divref.current) {
      (divref?.current as HTMLElement)?.scrollIntoView({ behavior: "smooth" });
    }
  });
  useEffect(() => {
    // marking chat as read
    if (!openChat?.loading) {
      const chatupdated: icurrentUserChats[] =
        openChat?.allUserChats &&
        openChat?.allUserChats[openChat?.currentUniqueUserId]?.map((chat) => {
          if (chat?.type == "sender" && chat?.status == "unread") {
            return { ...chat, status: "read" };
          }
          return chat;
        });

      openChat?.setAllUserChats({
        ...openChat?.allUserChats,
        [openChat?.currentUniqueUserId]: chatupdated,
      });

      socket.send(
        JSON.stringify({
          event: "message-read",
          payload: {
            id: openChat?.currentUniqueUserId,
          },
        })
      );
    }
  }, [openChat?.loading]);
  if (!openChat.currentUniqueUserId) {
    return (
      <div className="bg-slate-950 w-full h-full flex justify-center items-center text-white">
        <p className="opacity-30">Select a chat to view messages</p>
      </div>
    );
  }
  if (openChat?.loading) {
    return <ChatBoxLoader />;
  }

  let currentDate: Date;
  return (
    <section className="w-full h-full lg:absolute lg:p-5 lg:pl-2 ">
      <section className="relative w-full h-full transition overflow-hidden bg-slate-900 grid grid-rows-[auto_1fr_auto] lg:rounded-md shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)]">
        <div className="relative w-full h-fit ">
          <ChatTopBar />
        </div>
        <div className="relative overflow-hidden overflow-y-scroll w-full h-full">
          <div className=" h-[85dvh] ">
            <div className="absolute inline-flex flex-col gap-5 w-full py-5 px-3 overflow-hidden">
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
                      status={chat.status}
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
                      status={chat.status}
                      showDate
                    />
                  );
                } else {
                  return (
                    <Chat
                      from={chat.type as "sender" | "reciever"}
                      key={index}
                      message={chat.message}
                      status={chat.status}
                      time={chatDate}
                    />
                  );
                }
              })}
              <div ref={divref}></div>
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit  row-auto">
          <MessageInput id={openChat?.currentUserDetails?.id} />
        </div>
      </section>
    </section>
  );
}

const ChatTopBar = memo(function ChatTopBar() {
  const openChat = useContext(OpenChatContext) as iOpenChatValue;
  const webRTC = useContext(webRTCcontext) as iwebRTCcontext;
  const socket = useContext(socketContext) as WebSocket;

  function handleCreateCall(type: string) {
    navigator.mediaDevices
      .getUserMedia({ video: type == "video", audio: true })
      .then(() => {
        webRTC?.setCall({
          ...webRTC?.call,
          user: openChat.currentUserDetails,
          type,
          answered: false,
          Useris: "sender",
        });
        socket.send(
          JSON.stringify({
            event: "call-user",
            payload: { id: openChat.currentUniqueUserId, type },
          })
        );
      });
  }
  const topBarLeftStyling =
    "hover:bg-slate-700 transition lg:p-3 p-2 rounded-md ";
  return (
    <div className="flex w-full top-0 justify-between items-center bg-slate-800 lg:px-10 px-2 py-2 text-white">
      <span className="flex gap-2">
        <button
          type="button"
          className={`block  lg:hidden ${topBarLeftStyling}`}
          onClick={() => openChat.setUniqueUserId("")}
        >
          <ArrowLeft size={20} />
        </button>
        <Link
          to={"/"}
          className="inline-flex  justify-center items-center gap-3 p-2 rounded-md hover:bg-slate-700 transition"
        >
          <img
            src={
              openChat.currentUserDetails?.avatar
                ? openChat.currentUserDetails?.avatar
                : import.meta.env.VITE_DEFAULT_AVATAR_URL
            }
            className="flex justify-center items-center border rounded-full w-9"
          />
          <span className="flex flex-col transition-all">
            <span className="transition-all flex justify-center items-center gap-2">
              <h1 className="text-base">{openChat.currentUserDetails?.name}</h1>
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
      </span>
      <span className="flex gap-2">
        <button
          type="button"
          onClick={() => handleCreateCall("voice")}
          className={topBarLeftStyling}
        >
          <Phone className="w-5" />
        </button>
        <button
          type="button"
          onClick={() => handleCreateCall("video")}
          className={topBarLeftStyling}
        >
          <Video className="w-5" />
        </button>
        {/* <button type="button" className={topBarLeftStyling}>
          <EllipsisVertical className="lg:w-5 w-4" />
        </button> */}
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
    // if(openChat?.setAllUserChats)

    if (!message) return;
    socket.send(
      JSON.stringify({
        event: "message-send",
        payload: {
          to: id,
          from: user?.user?.id,
          message,
          time,
          status: "unread",
        },
      })
    );
    if (openChat?.allUserChats && openChat?.allUserChats[id]) {
      openChat.setAllUserChats({
        ...openChat?.allUserChats,
        [id]: [
          ...openChat?.allUserChats[id],
          { type: "reciever", message, time, status: "unread" },
        ],
      });
    } else {
      openChat.setAllUserChats({
        ...openChat?.allUserChats,
        [id]: [{ type: "reciever", message, time, status: "unread" }],
      });
    }

    setMessage("");
  }
  return (
    <div className="w-full flex relative bottom-0 justify-between text-white bg-slate-800 shadow-inner lg:px-5 px-2 py-2 gap-5">
      <input
        type="text"
        autoFocus
        autoCorrect="on"
        // autoComplete="on"
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key == "Enter" && handleSendMessage()}
        onInput={() =>
          socket.send(
            JSON.stringify({
              event: "message-send-start-typing",
              payload: {
                to: id,
                from: user?.user?.id,
              },
            })
          )
        }
        className="outline-none w-full shadow-inner px-5 py-2 text-lg rounded-md bg-slate-700 "
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
  status?: "read" | "unread";
  showDate?: boolean;
};

const Chat = memo(function Chat(props: iChatProps) {
  return (
    <>
      {props.showDate && (
        <div className="w-full flex justify-center">
          <span className="text-white bg-slate-800 w-fit rounded-sm text-xs py-1 px-3 ">
            {new Date()?.toLocaleDateString() ==
            new Date(props?.time)?.toLocaleDateString()
              ? "Today"
              : new Date(props?.time)?.toDateString()}
          </span>
        </div>
      )}
      <div
        className={`inline-flex flex-col w-fit max-w-md md:max-w-xl px-3 rounded-lg ${
          props.from == "sender"
            ? "text-white bg-slate-700 rounded-bl-none"
            : "text-white bg-blue-950 ml-auto rounded-br-none"
        }`}
      >
        <span
          className="text-xl/1 mt-2"
          style={{ overflow: "hidden", wordBreak: "break-all" }}
        >
          {props.message}
        </span>
        <span className="inline-flex justify-end text-xs ml-auto opacity-70 gap-2">
          <p>
            {new Date(props?.time)
              ?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              .toLowerCase()}
          </p>
          {props?.from == "reciever" && props?.status == "read" && (
            <p className="text-green-400 transition">
              <CheckCheck size={16} />
            </p>
          )}
        </span>
      </div>
    </>
  );
});

export default memo(ChatBox);

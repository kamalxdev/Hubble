import { EllipsisVertical, Phone, Send, User, Video } from "lucide-react";
import { memo, useContext, useState } from "react";
import { iOpenChatValue, OpenChatContext } from "../context/OpenedChat";
import { currentUser, iCurrentUserContext } from "../context/user";
import { Link } from "react-router-dom";
import { socketContext } from "../context/socket";
import { Socket } from "socket.io-client";
import ChatBoxLoader from "../loader/chatbox";

function ChatBox() {
  const openChat = useContext(OpenChatContext) as iOpenChatValue;
  if (!openChat.currentUniqueUserId) {
    return <div></div>;
  }
  if (openChat?.loading) {
    return <ChatBoxLoader />;
  }
  let currentDate: Date;

  return (
    <section className="flex flex-col justify-between transition overflow-hidden ">
      <ChatTopBar />
      <div className="relative h-[84vh] overflow-hidden overflow-y-scroll bg-zinc-800 ">
        <div className="inline-flex flex-col gap-5 bg-zinc-800 w-full py-5 px-10 overflow-hidden  ">
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
      </div>
      <MessageInput username={openChat?.currentUserDetails?.username} />
    </section>
  );
}

const ChatTopBar = memo(function ChatTopBar() {
  const openChat = useContext(OpenChatContext) as iOpenChatValue;

  const topBarLeftStyling = "hover:bg-slate-300 transition p-3 rounded-md ";
  return (
    <div className="flex h-[8vh] w-full top-0 justify-between items-center bg-slate-200 px-10 py-2 text-black">
      <Link
        to={"/"}
        className="inline-flex justify-center items-center gap-3 border p-2 rounded-md hover:bg-slate-300 transition"
      >
        <span className="flex justify-center items-center border rounded-full border-black p-1 text-black">
          <User />
        </span>
        <span className="flex justify-center items-center gap-2">
          <h1 className="text-xl">{openChat.currentUserDetails?.name}</h1>
          {openChat?.currentUserOnline && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          )}
        </span>
      </Link>
      <span className="flex border gap-2">
        <button type="button" className={topBarLeftStyling}>
          <Phone size={20} />
        </button>
        <button type="button" className={topBarLeftStyling}>
          <Video size={20} />
        </button>
        <button type="button" className={topBarLeftStyling}>
          <EllipsisVertical size={20} />
        </button>
      </span>
    </div>
  );
});

const MessageInput = memo(function MessageInput({
  username,
}: {
  username: string;
}) {
  const openChat = useContext(OpenChatContext) as iOpenChatValue;
  const user = useContext(currentUser) as iCurrentUserContext;
  const socket = useContext(socketContext) as Socket;

  const [message, setMessage] = useState("");
  function handleSendMessage() {
    let time = new Date();
    if (!message) return;

    socket.emit("message-send", {
      message,
      to: username,
      from: user?.currentuser?.response?.user?.username,
      time,
    });

    if (openChat?.allUserChats && openChat?.allUserChats[username]) {
      openChat.setAllUserChats({
        ...openChat?.allUserChats,
        [username]: [
          ...openChat?.allUserChats[username],
          { type: "reciever", message, time },
        ],
      });
    } else {
      openChat.setAllUserChats({
        ...openChat?.allUserChats,
        [username]: [{ type: "reciever", message, time }],
      });
    }

    setMessage("");
  }
  return (
    <div className="flex relative bottom-0 justify-between text-black bg-slate-300 shadow-inner px-5 py-2 gap-5 h-[8vh]">
      <input
        type="text"
        onChange={(e) => setMessage(e.target.value)}
        className="bg-slate-200 outline-none w-full px-3 text-lg shadow shadow-inner px-5 py-2 text-xl rounded-md  "
        placeholder="Type your message..."
        value={message}
      />{" "}
      <button
        onClick={handleSendMessage}
        className="p-3 bg-green-500 text-white shadow hover:shadow-2xl transition rounded-md"
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
          <span className="text-white bg-black w-fit rounded-sm text-xs py-1 px-3 ">
            {new Date(props?.time)?.toJSON().slice(0, 10).replace(/-/g, "/")}
          </span>
        </div>
      )}
      <div
        className={`inline-flex flex-col w-fit max-w-md md:max-w-xl px-3 rounded-md ${
          props.from == "sender"
            ? "text-white bg-slate-900"
            : "text-black bg-white ml-auto"
        }`}
      >
        <span
          className="text-xl/1 mt-2"
          style={{ overflow: "hidden", wordBreak: "break-all" }}
        >
          {props.message}
        </span>
        <span className="inline-flex justify-end text-slate-600 text-xs ml-auto ">
          {new Date(props?.time)
            ?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            .toLowerCase()}
        </span>
      </div>
    </>
  );
});

export default memo(ChatBox);

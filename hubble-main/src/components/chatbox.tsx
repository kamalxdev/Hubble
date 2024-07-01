import { EllipsisVertical, Phone, Send, User, Video } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

function ChatBox() {
  const AllChats = [
    { from: "sender" },
    { from: "reciever" },
    { from: "sender" },
    { from: "reciever" },
    { from: "sender" },
    { from: "reciever" },
    { from: "sender" },
    { from: "reciever" },
    { from: "sender" },
    { from: "reciever" },
    { from: "sender" },
  ];

  return (
    <section className="flex flex-col justify-between ">
      <ChatTopBar />
      <div className="relative h-[84vh] overflow-y-scroll">
        <div className="inline-flex flex-col gap-5 bg-zinc-800 w-full py-5 px-10 ">
          {AllChats.map((chat) => {
            return <Chat from={chat.from as "sender" | "reciever"} />;
          })}
        </div>
      </div>
      <MessageInput />
    </section>
  );
}

const ChatTopBar = memo(function ChatTopBar() {
  const topBarLeftStyling = "hover:bg-slate-300 transition p-3 rounded-md ";
  return (
    <div className="flex h-[8vh] w-full top-0 justify-between items-center bg-slate-200 px-10 py-2 text-black">
      <Link
        href={"/"}
        className="inline-flex justify-center items-center gap-3 border p-2 rounded-md hover:bg-slate-300 transition"
      >
        <span className="flex justify-center items-center border rounded-full border-black p-1 text-black">
          <User />
        </span>
        <span className="flex justify-center items-center gap-2">
          <h1 className="text-xl">Virat Kholi</h1>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
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

const MessageInput = memo(function MessageInput() {
  return (
    <div className="flex relative bottom-0 justify-between text-black bg-slate-300 shadow-inner px-5 py-2 gap-5 h-[8vh]">
      <input
        type="text"
        className="bg-slate-200 outline-none w-full px-3 text-lg shadow shadow-inner px-5 py-2 text-xl rounded-md  "
        placeholder="Type your message..."
      />{" "}
      <button className="p-3 bg-green-500 text-white shadow hover:shadow-2xl transition rounded-md">
        <Send size={20} />
      </button>
    </div>
  );
});


type iChatProps = {
  from: "sender" | "reciever";
};

const Chat = memo(function Chat(props: iChatProps) {
  return (
    <div
      className={`inline-flex flex-col max-w-md md:max-w-xl p-2 rounded-md ${
        props.from == "sender"
          ? "text-white bg-slate-900"
          : "text-black bg-white ml-auto"
      }`}
    >
      <span className="p-2">
        It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout.
      </span>
      <span className="flex justify-end text-slate-600">09:54 pm</span>
    </div>
  );
});

export default memo(ChatBox);

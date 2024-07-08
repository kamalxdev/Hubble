import { EllipsisVertical, Phone, Send, Video } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";

function ChatBoxLoader() {
  const chat = [
    { type: "sender" },
    { type: "reciever" },
    { type: "sender" },
    { type: "reciever" },
  ];
  return (
    <section className="flex flex-col justify-between transition">
      <ChatTopBarLoader />
      <div className="relative h-[84vh] overflow-y-scroll bg-zinc-800">
        <div className="inline-flex flex-col gap-5 bg-zinc-800 w-full py-5 px-10 ">
          {chat.map((c) => {
            return <ChatLoader from={c.type as "sender" | "reciever"} />;
          })}
        </div>
      </div>
      <MessageInputLoader />
    </section>
  );
}

const ChatTopBarLoader = memo(function ChatTopBarLoader() {
  const topBarLeftStyling = "hover:bg-slate-300 transition p-3 rounded-md ";
  return (
    <div className="flex h-[8vh] w-full top-0 justify-between items-center bg-slate-200 px-10 py-2 text-black">
      <Link
        to={"/"}
        className="inline-flex justify-center items-center gap-3 border p-2 rounded-md hover:bg-slate-300 transition"
      >
        <div className="bg-gray-400 h-8 w-36 rounded-full mb-2.5 mt-4 animate-pulse"></div>
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

const MessageInputLoader = memo(function MessageInputLoader() {
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

const ChatLoader = memo(function ChatLoader({ from }: { from: string }) {
  return (
    <div
      className={`inline-flex flex-col max-w-md md:max-w-xl p-2 rounded-md w-fit ${
        from == "sender"
          ? "text-white bg-slate-900"
          : "text-black bg-white ml-auto"
      }`}
    >
      <span className="p-2">
        <div className="bg-gray-400 h-2 w-48 rounded-full mb-2.5 mt-4 animate-pulse"></div>
        <div className="bg-gray-400 h-2 w-48 rounded-full mb-2.5 mt-4 animate-pulse"></div>
      </span>
    </div>
  );
});

export default memo(ChatBoxLoader);

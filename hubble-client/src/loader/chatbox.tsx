import { memo } from "react";

function ChatBoxLoader() {
  const chat = [
    { id: 1, type: "sender" },
    { id: 2, type: "reciever" },
    { id: 3, type: "sender" },
    { id: 4, type: "reciever" },
    { id: 5, type: "sender" },
    { id: 6, type: "reciever" },
  ];
  return (
    <section className="flex flex-col justify-between transition overflow-hidden bg-slate-950">
      <div className="flex h-[8vh] w-full top-0 justify-between items-center bg-slate-800 px-10 py-2 text-white">
        <div className="inline-flex justify-center items-center gap-3 p-2 rounded-md hover:bg-slate-700 transition">
          <div className="bg-slate-600 w-10 h-10 rounded-full animate-pulse"></div>
          <div className="bg-slate-600 w-28 h-5 rounded-full animate-pulse"></div>
        </div>
        <div className="bg-slate-600 w-28 h-5 rounded-full animate-pulse"></div>
      </div>
      <div className="relative h-[86vh] overflow-hidden overflow-y-scroll ">
        <div className="inline-flex flex-col gap-5 w-full py-5 px-10 overflow-hidden  ">
          {chat.map((chat, index) => {
            return (
              <ChatLoader
                from={chat.type as "sender" | "reciever"}
                key={index}
                id={chat.id}
              />
            );
          })}
        </div>
      </div>
      <div className="flex relative bottom-0 justify-between text-white bg-slate-700 shadow-inner px-4 py-3 h-[6vh]">
      <div className="bg-slate-600 w-full h-7 rounded-md animate-pulse"></div>
      </div>
    </section>
  );
}

type iChatLoaderProps = {
  from: "sender" | "reciever";
  id:number
};

const ChatLoader = memo(function ChatLoader(props: iChatLoaderProps) {
  return (
    <>
      <div
        className={`inline-flex flex-col w-fit max-w-md md:max-w-xl px-3 rounded-md ${
          props.from == "sender"
            ? "text-white bg-slate-700"
            : "text-black bg-slate-200 ml-auto"
        }`}
        key={props.id}
      >
        <span
          className="text-xl/1 mt-2"
          style={{ overflow: "hidden", wordBreak: "break-all" }}
        >
          <div className="w-28 h-2 bg-slate-600 rounded-full mb-2.5"></div>
        </span>
        <span className="inline-flex justify-end text-xs ml-auto opacity-70">
          <div className="bg-slate-600 w-10 h-2 rounded-full mb-2.5"></div>
        </span>
      </div>
    </>
  );
});

export default memo(ChatBoxLoader);

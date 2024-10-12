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
    <section className="w-full h-full lg:absolute lg:p-5 lg:pl-2 ">
      <section className="relative w-full h-full transition overflow-hidden bg-slate-900 grid grid-rows-[auto_1fr_auto] lg:rounded-md shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)]">
        <div className="relative w-full h-fit ">
        <div className="flex h-[8vh] w-full top-0 justify-between items-center bg-slate-800 px-10 py-2 text-white">
    <div className="inline-flex justify-center items-center gap-3 p-2 rounded-md hover:bg-slate-700 transition">
      <div className="bg-slate-600 w-10 h-10 rounded-full animate-pulse"></div>
      <div className="bg-slate-600 w-28 h-5 rounded-full animate-pulse"></div>
    </div>
    </div>
        </div>
        <div className="relative overflow-hidden overflow-y-scroll w-full h-full">
          <div className=" h-[85dvh] ">
            <div className="absolute inline-flex flex-col gap-5 w-full py-5 px-3 overflow-hidden">
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
        </div>
        <div className="relative w-full h-fit  row-auto">
          <div className="flex relative bottom-0 justify-between text-white bg-slate-700 shadow-inner px-4 py-3 h-[6vh]">
            <div className="bg-slate-600 w-full h-7 rounded-md animate-pulse"></div>
          </div>
        </div>
      </section>
    </section>
  );
}

type iChatLoaderProps = {
  from: "sender" | "reciever";
  id: number;
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

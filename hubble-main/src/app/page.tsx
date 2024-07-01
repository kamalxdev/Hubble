import Chatbox from "@/components/chatbox";
import Messages from "@/components/messages";
import Sidebar from "@/components/sidebar";
import { OpenChatProvider } from "@/context/OpenedChat";

export default function Home() {
  return (
    <div className=" flex flex-cols w-full">
      <Sidebar theme="white" />
      <OpenChatProvider>
        <div className="border grid grid-cols-3 w-full">
          <section className="shadow-xl">
            <Messages />
          </section>
          <section className="relative col-span-2"><Chatbox/></section>
        </div>
      </OpenChatProvider>
    </div>
  );
}

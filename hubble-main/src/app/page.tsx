import Chatbox from "@/components/chatbox";
import Messages from "@/components/messages";
import Sidebar from "@/components/sidebar";


export default function Home() {
  return (
    <div className=" flex flex-cols w-full">
      <Sidebar theme="white" />
      <div className="border grid grid-cols-3 w-full">
        <section className="shadow-xl"><Messages /></section>
        <section className="relative col-span-2">
          <Chatbox/>
        </section>
      </div>
    </div>
  );
}

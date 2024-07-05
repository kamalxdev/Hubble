import { verifyUser } from "@/actions/auth";
import Chatbox from "@/components/chatbox";
import Messages from "@/components/messages";
import Sidebar from "@/components/sidebar";
import { OpenChatProvider } from "@/context/OpenedChat";
import { SocketContextProvider } from "@/context/socket";
import { CurrentUserProvider } from "@/context/user";
import { redirect } from "next/navigation";

export default async function Home() {
  const userVerification = await verifyUser();
  if (!userVerification.success) {
    return redirect("/login");
  }

  return (
    <CurrentUserProvider>
      <OpenChatProvider>
        <SocketContextProvider>
          <div className=" flex flex-cols w-full">
            <Sidebar theme="white" />
            <div className="border grid grid-cols-3 w-full">
              <section className="shadow-xl">
                <Messages key={"messages"} />
              </section>
              <section className="relative col-span-2">
                <Chatbox />
              </section>
            </div>
          </div>
        </SocketContextProvider>
      </OpenChatProvider>
    </CurrentUserProvider>
  );
}

import { Chat, Gear, Notepad, Phone, User } from "phosphor-react";
import { memo, useContext } from "react";
import { currentUser, iCurrentUserContext } from "../context/user";
import { iToggleContext, toggleContext } from "../context/toggle";

function Sidebar() {
  const user = useContext(currentUser) as iCurrentUserContext;
  const toggle = useContext(toggleContext) as iToggleContext;
  const hover_btn_class = "hover:bg-slate-700 p-3 rounded-md transition";
  return (
    <section className="flex flex-col items-center justify-between p-2 py-10  h-screen bg-slate-800 z-40 text-white">
      <div className="w-full">
        <button type="button" className='w-full p-2'>
          <span
            title={
              user?.currentuser?.response?.success && user.currentuser
                ? user?.currentuser?.response?.user?.name
                : "Your Account"
            }
            className={`flex justify-center items-center border rounded-full  p-1 w-10 h-10`}
          >
            {" "}
            <User size={28} className="relative"/>
          </span>
        </button>

        <div className="flex flex-col mt-5 gap-2">
          <button
            type="button"
            title="Chat"
            className={hover_btn_class}
            onClick={() => toggle?.setSidebar("chats")}
          >
            <Chat size={28} className="relative" />
          </button>
          <button
            type="button"
            title="Calls"
            className={hover_btn_class}
            onClick={() => toggle?.setSidebar("calls")}
          >
            <Phone size={28} className="relative" />
          </button>
          <button
            type="button"
            title="Notes"
            className={hover_btn_class}
            onClick={() => toggle?.setSidebar("notes")}
          >
            <Notepad size={28} className="relative" />
          </button>
        </div>
      </div>
      <div className=''>
        <button type="button" title="Setting">
          <Gear size={28} />
        </button>
      </div>
    </section>
  );
}

export default memo(Sidebar);

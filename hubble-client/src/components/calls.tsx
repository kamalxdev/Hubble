import { Ban, Dot, PhoneIncoming, PhoneOutgoing, User } from "lucide-react";
import { Fragment, memo, useContext } from "react";
import { currentUser, iCurrentUserContext } from "../context/user";
import { iOpenChatValue, OpenChatContext } from "../context/OpenedChat";
import { iUser } from "../types/user";
import MessagesLoader from "../loader/messages";
import SearchBar from "./searchBar";

function Calls() {
  const user = useContext(currentUser) as iCurrentUserContext;

  if (user.currentuser.loading || user.friends.loading) {
    return <MessagesLoader />;
  }
  if (!user.friends.response.success) {
    return <div>{user.friends.error}</div>;
  }
  const friends = user?.friends?.response?.friends as iUser[][];
  return (
    <section className="bg-slate-900" key={"message"}>
            <SearchBar placeholder="Search calls" for='call'/>

      <div className="relative h-[90vh] overflow-y-scroll" key={"hell"}>
        <div
          className=" inline-flex flex-col justify-center w-full"
          key={"friends"}
        >
          {friends.map((friend) => {
            return (
              <Fragment key={friend[0].id}>
                <Friend
                  name={friend[0].name}
                  UniqueUserID={friend[0].id}
                  key={friend[0].username}
                  username={friend[0]?.username}
                />
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type iFriendProps = {
  name: string;
  UniqueUserID: string;
  username: string;
};

const Friend = memo(function Friend(props: iFriendProps) {
  const openChat = useContext(OpenChatContext) as iOpenChatValue;

  return (
    <button
      key={props.UniqueUserID}
      // onClick={() => {
      //   openChat?.setUniqueUserId(props.UniqueUserID);
      // }}
      className={`inline-flex justify-start items-center gap-4 px-2 mx-5 text-white hover:bg-slate-600/50 transition rounded-md ${openChat?.currentUniqueUserId===props?.UniqueUserID && "bg-slate-600"}`}
    >
      <span
        key={"user_avatar"}
        className="flex justify-center items-center border rounded-full p-1 border-white"
      >
        <User />
      </span>
      <span className="flex flex-col w-full border-y p-2 border-slate-800 " key={"user_details"}>
        <span className="flex justify-between">
          <h1>{props.name}</h1>
          <h3 className="opacity-75 text-xs">@{props.username}</h3>
        </span>
        <span
          className="flex justify-between items-end text-slate-400 text-sm"
        >
          
          <span className="flex gap-2 text-green-500">
          <p className="font-semibold">voice</p><Dot size={20} className="text-slate-600"/><PhoneIncoming size={16} /><Ban size={16}/><PhoneOutgoing size={16}/>
          </span>
          <p>09:35am</p>
        </span>
      </span>
    </button>
  );
});

export default memo(Calls);

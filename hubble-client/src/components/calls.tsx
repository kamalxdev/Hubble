import { Dot, PhoneIncoming, PhoneOutgoing, User } from "lucide-react";
import { Fragment, memo, useContext } from "react";
import { iOpenChatValue, OpenChatContext } from "../context/OpenedChat";
import SearchBar from "./searchBar";
import { callContext, iCallContext } from "../context/calls";

function Calls() {
  const call = useContext(callContext) as iCallContext;

  const friends = call?.history;
  return (
    <section className="bg-slate-900" key={"message"}>
      <SearchBar placeholder="Search calls" for="call" />

      <div className="relative h-[90vh] overflow-y-scroll" key={"hell"}>
        <div
          className=" inline-flex flex-col justify-center w-full"
          key={"friends"}
        >
          {friends.map((friend) => {
            return (
              <Fragment key={friend?.call?.id}>
                <Friend
                  name={friend?.user?.name}
                  UniqueUserID={friend?.user?.id}
                  key={friend?.user?.username}
                  username={friend?.user?.username}
                  type={friend?.call?.type}
                  time={friend?.call?.createdAt}
                  accepted={friend?.call?.answer}
                  incoming={friend?.call?.incoming}
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
  type: string;
  time: Date;
  accepted: Boolean;
  incoming: Boolean;
};

const Friend = memo(function Friend(props: iFriendProps) {
  const openChat = useContext(OpenChatContext) as iOpenChatValue;

  return (
    <button
      key={props.UniqueUserID}
      // onClick={() => {
      //   openChat?.setUniqueUserId(props.UniqueUserID);
      // }}
      className={`inline-flex justify-start items-center gap-4 px-2 mx-5 text-white hover:bg-slate-600/50 transition rounded-md ${
        openChat?.currentUniqueUserId === props?.UniqueUserID && "bg-slate-600"
      }`}
    >
      <span
        key={"user_avatar"}
        className="flex justify-center items-center border rounded-full p-1 border-white"
      >
        <User />
      </span>
      <span
        className="flex flex-col w-full border-y p-2 border-slate-800 "
        key={"user_details"}
      >
        <span className="flex justify-between">
          <h1>{props.name}</h1>
          <h3 className="opacity-75 text-xs">@{props.username}</h3>
        </span>
        <span className="flex justify-between items-end text-slate-400 text-sm">
          <span
            className={`flex gap-2 ${
              props.accepted ? "text-green-500" : "text-red-500"
            }`}
          >
            <p className="font-semibold">{props?.type}</p>
            <Dot size={20} className="text-slate-600" />
            {props.incoming ? (
              <PhoneIncoming size={16} />
            ) : (
              <PhoneOutgoing size={16} />
            )}
            {/* <Ban size={16} /> */}
          </span>
          <p className="text-xs">
            {new Date().toLocaleDateString() == new Date(props?.time).toLocaleDateString()
              ? "Today at " + new Date(props?.time).toLocaleString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
              : new Date(props?.time).toLocaleString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
          </p>
        </span>
      </span>
    </button>
  );
});

export default memo(Calls);

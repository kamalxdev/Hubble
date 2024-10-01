import { Dot, PhoneIncoming, PhoneOutgoing } from "lucide-react";
import { Fragment, memo, useContext } from "react";
// import { iOpenChatValue, OpenChatContext } from "../context/OpenedChat";
import SearchBar from "./searchBar";
import { callContext, iCallContext } from "../context/calls";

function Calls() {
  const call = useContext(callContext) as iCallContext;

  const friends = call?.history;
  return (
    <section
      className="bg-slate-900 h-full grid grid-flow-row-dense"
      key={"message"}
    >
      <div className="h-fit row-auto">
        <SearchBar placeholder="Search calls" for="call" />
      </div>
      <div className="relative overflow-y-scroll" key={"hell"}>
        <div className="h-[80vh] lg:h-[90vh]">
          <div
            className="absolute inline-flex flex-col justify-center w-full"
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
                    avatar={friend?.user?.avatar}
                  />
                </Fragment>
              );
            })}
          </div>
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
  avatar: string | null;
};

const Friend = memo(function Friend(props: iFriendProps) {
  // const openChat = useContext(OpenChatContext) as iOpenChatValue;

  return (
    <button
      key={props.UniqueUserID}
      // onClick={() => {
      //   openChat?.setUniqueUserId(props.UniqueUserID);
      // }}
      className={`inline-flex justify-start items-center gap-4 lg:px-2 mx-5 text-white hover:bg-slate-600/50 transition rounded-md`}
    >
      <img
        src={
          props?.avatar
            ? props?.avatar
            : import.meta.env.VITE_DEFAULT_AVATAR_URL
        }
        className="flex justify-center items-center border rounded-full w-9"
      />
      <span
        className="flex flex-row justify-between w-full border-y p-2 border-slate-800 "
        key={"user_details"}
      >
        <span className="flex flex-col  items-start">
          <h1>{props.name}</h1>

          <span className="flex text-slate-400">
            <p className="lg:text-[0.70rem] xl:text-xs text-[0.65rem]">
              {new Date().toLocaleDateString() ==
              new Date(props?.time).toLocaleDateString()
                ? "Today at " +
                  new Date(props?.time).toLocaleString([], {
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
        <span
          className={`flex items-center gap-2  ${
            props.accepted ? "text-green-500" : "text-red-500"
          }`}
        >
          <h3 className="text-[0.70rem] xl:text-xs font-semibold">
            {props?.type?.toUpperCase()}
          </h3>
          <Dot size={20} className="text-slate-600" />
          {props.incoming ? (
            <PhoneIncoming className="w-4" />
          ) : (
            <PhoneOutgoing className="w-4" />
          )}
          {/* <Ban size={16} /> */}
        </span>
      </span>
    </button>
  );
});

export default memo(Calls);

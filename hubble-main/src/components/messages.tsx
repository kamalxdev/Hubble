"use client";
import { OpenChatContext, iOpenChatValue } from "@/context/OpenedChat";
import { Key, Search, User } from "lucide-react";
import { memo, useContext } from "react";



function Messages() {
  const openChat =useContext(OpenChatContext) as iOpenChatValue ;

  const friends = [
    {name:"Virat Kholi" ,UniqueUserID:"vkholi", key:1},
    {name:"Rohit Sharma" ,UniqueUserID:"rohitsharma" , key:2},
    {name:"Rishabh Pant" ,UniqueUserID:"pant" , key:3},
    {name:"Suryakumar Yadav" ,UniqueUserID:"sky" , key:1},
  ];
  return (
    <section className="" key={'message'}>
      {/* <div>{JSON.stringify(openChat)}</div> */}
      <Searchbar />
      <div className="relative h-[90vh] overflow-y-scroll" key={"hell"}>
        <div className=" inline-flex flex-col justify-center w-full" key={"friends"}>
          {/* <Friend /> */}
          {friends.map((friend,index) => {
            return (
              <>
                <Friend name={friend.name} UniqueUserID={friend.UniqueUserID} key={friend.UniqueUserID}/>
                <hr className="mx-10" key={index}/>
              </>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const Searchbar = memo(function Searchbar() {
  return (
    <div className="flex justify-center w-full bg-white py-5 z-10 h-[10vh]">
      <div className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-sm">
        <span>
          <Search size={16} />
        </span>
        <span>
          <input
            type="search"
            placeholder="Search"
            className="bg-transparent outline-none"
          />
        </span>
      </div>
    </div>
  );
});

type iFriendProps={
  name:string,
  UniqueUserID:string,
}

const Friend = memo(function Friend(props:iFriendProps) {
  const openChat =useContext(OpenChatContext) as iOpenChatValue ;
  
  return (
    <button key={props.UniqueUserID} onClick={()=>{openChat?.setUniqueUserId(props.UniqueUserID)}} className="inline-flex justify-start items-center gap-4 p-2 mx-5 my-2 hover:bg-slate-200/70 transition rounded-md">
      <span key={"user_avatar"} className="flex justify-center items-center border rounded-full border-black p-1 text-black">
        <User />
      </span>
      <span className="flex flex-col w-full" key={"user_details"}>
        <span className="flex justify-between">
          <h1>{props.name}</h1>
          <h3 className="text-slate-300 text-xs">@{props.UniqueUserID}</h3>
        </span>
        <span className="flex justify-between text-slate-400 text-sm" key={"last_Chat_detail"}>
          <p>Loreum ipsum sit itrem busdof dfds fhfisd kjl...</p>

          <p>02:45</p>
        </span>
      </span>
    </button>
  );
});

export default memo(Messages);

"use client";
import { OpenChatContext, iOpenChatValue } from "@/context/OpenedChat";
import { currentUser, iCurrentUserContext } from "@/context/user";
import { socket } from "@/socket";
import { User as u } from "@prisma/client";
import { Key, Search, User } from "lucide-react";
import { memo, useContext, useEffect } from "react";



function Messages() {
  const user= useContext(currentUser) as iCurrentUserContext;
  // console.log("above socket",user);
  
  useEffect(()=>{
    socket.on("connect", () => {
      console.log("Socket conected: ",socket.id);
      
      socket.on("message-send",(data)=>{
        console.log("messsage send",data);
        
      })
      // socket.emit("message-send",{from:""})
    });
    if(user){
      socket.emit("user-connected",{user:{username:user.currentuser.username},socketID:socket.id})
    }
  },[user])
  // console.log("below socket",user);


  const openChat =useContext(OpenChatContext) as iOpenChatValue ;

  const friends = user.allUser
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
                <Friend name={friend.name} UniqueUserID={friend.username} key={friend.username}/>
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

"use client"
import { getUserDetails } from "@/actions/user";
import { User } from "@prisma/client";
import {createContext,useEffect,useState} from "react"

type icurrentUserChats={
  type:string,
  message:string
}
export type iallUserChats={[key:string]:icurrentUserChats[]}

export type iOpenChatValue={
  currentUniqueUserId:string,
  setUniqueUserId: (x:string) => void
  currentUserDetails:User
  setAllUserChats: (x:iallUserChats) => void
  allUserChats:iallUserChats
  currentUserChats:icurrentUserChats[]
}


export const OpenChatContext = createContext<iOpenChatValue | {}>({}) ;




export function OpenChatProvider({ children }:{children:React.ReactNode}) {
  const [currentUniqueUserId, setUniqueUserId] = useState("");
  const [currentUserDetails,setCurrentUserDetails]= useState<User|{}>({})
  const [allUserChats,setAllUserChats]=useState<iallUserChats>()
  const [currentUserChats,setCurrentUserChats]=useState<icurrentUserChats[]>()
  useEffect(()=>{
    getUserDetails(currentUniqueUserId).then((data)=>{
      if(data.success){
        setCurrentUserDetails(data.user as User)
      }
    })
  },[currentUniqueUserId])
  useEffect(()=>{
    if(allUserChats && allUserChats[currentUniqueUserId]){
      setCurrentUserChats((allUserChats as iallUserChats)[currentUniqueUserId] as icurrentUserChats[])
    }else(
      setCurrentUserChats([])
    )
    
  },[allUserChats,currentUniqueUserId,currentUserChats])

  // function handleSetAllUserChats(username:string,data:icurrentUserChats){
  //   let chats=allUserChats
  //   let selectedUser=(chats as iallUserChats)?.get(username) as icurrentUserChats[]
  //   chats?.set(username,selectedUser?[...selectedUser,data]:[data])
  //   setAllUserChats(chats)
  //   console.log({allUserChats});
    
  // }
  return (
    <OpenChatContext.Provider value={{ currentUniqueUserId, setUniqueUserId,currentUserDetails,allUserChats,setAllUserChats ,currentUserChats}}>
      {children}
    </OpenChatContext.Provider>
  );
}

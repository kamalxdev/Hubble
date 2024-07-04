"use client"
import { getUserDetails } from "@/actions/user";
import { User } from "@prisma/client";
import {createContext,useEffect,useState} from "react"

type icurrentUserChats={
  type:string,
  message:string
}
export type iallUserChats=Map<string,icurrentUserChats[]>
export type iOpenChatValue={
  currentUniqueUserId:string,
  setUniqueUserId: (x:string) => void
  currentUserDetails:User
  handleSetAllUserChats: (x:string,y:icurrentUserChats) => void
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

    setCurrentUserChats(allUserChats?.get(currentUniqueUserId) as icurrentUserChats[])
    



  },[currentUniqueUserId])

  function handleSetAllUserChats(username:string,data:icurrentUserChats){
    let chats=allUserChats
    let selectedUser=(chats as iallUserChats).get(username) as icurrentUserChats[]
    chats?.set('',[...selectedUser,data])
    setAllUserChats(chats)
  }
  return (
    <OpenChatContext.Provider value={{ currentUniqueUserId, setUniqueUserId,currentUserDetails,allUserChats,handleSetAllUserChats ,currentUserChats}}>
      {children}
    </OpenChatContext.Provider>
  );
}

"use client"
import {createContext,useState} from "react"

export type iOpenChatValue={
  currentUniqueUserId:string,
  setUniqueUserId: (x:string) => void
}

export const OpenChatContext = createContext<iOpenChatValue | {}>({}) ;




export function OpenChatProvider({ children }:{children:React.ReactNode}) {
  const [currentUniqueUserId, setUniqueUserId] = useState("");
  return (
    <OpenChatContext.Provider value={{ currentUniqueUserId, setUniqueUserId }}>
      {children}
    </OpenChatContext.Provider>
  );
}

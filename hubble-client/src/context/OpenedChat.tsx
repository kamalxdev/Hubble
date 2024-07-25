
import { createContext, useEffect, useState } from "react";
import { iUser } from "../types/user";
import useGetData from "../hooks/axios/getData";

export type icurrentUserChats = {
  type: string;
  message: string;
  time: Date;
  status?:'read'|'unread'
};
export type iallUserChats = { [key: string]: icurrentUserChats[] };
export type ityping = { [key: string]: boolean };


export type iOpenChatValue = {
  currentUniqueUserId: string;
  setUniqueUserId: (x: string) => void;
  currentUserDetails: iUser;
  setAllUserChats: (x: iallUserChats) => void;
  allUserChats: iallUserChats;
  currentUserChats: icurrentUserChats[];
  currentUserOnline: boolean;
  setCurrentUserOnline: (x: boolean) => void;
  loading: boolean;
  setTyping:(x:ityping)=>void,
  typing:ityping
};

export const OpenChatContext = createContext<iOpenChatValue | {}>({});

export function OpenChatProvider({ children }: { children: React.ReactNode }) {
  const [currentUniqueUserId, setUniqueUserId] = useState("");
  const [currentUserDetails, setCurrentUserDetails] = useState<iUser | {}>({});
  const [allUserChats, setAllUserChats] = useState<iallUserChats>();
  const [typing,setTyping]=useState<ityping>()
  const [currentUserChats, setCurrentUserChats] =
    useState<icurrentUserChats[]>();
  const [currentUserOnline, setCurrentUserOnline] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const getChatsonDB = useGetData("/chat/all", {},true);
  const getUser = useGetData(
    `/user?id=${currentUniqueUserId}`,
    {},
    true,
    [currentUniqueUserId]
  );
  useEffect(()=>{
    if (getChatsonDB?.response?.success && getChatsonDB?.response?.userchats) {
      setAllUserChats(getChatsonDB?.response?.userchats)
    }
  },[getChatsonDB?.response?.userchats])       
  
  useEffect(() => {
    if (getUser?.response?.success) {
      setLoading(false);
      setCurrentUserDetails(getUser?.response?.user);
    }
  }, [currentUniqueUserId, getUser?.response?.user]);
  useEffect(() => {
    setCurrentUserOnline(false);
    setLoading(true);
  }, [currentUniqueUserId]);
  useEffect(() => {
    if (allUserChats && allUserChats[currentUniqueUserId]) {
      setCurrentUserChats(
        (allUserChats as iallUserChats)[
          currentUniqueUserId
        ] as icurrentUserChats[]
      );
      
    } else setCurrentUserChats([]);
  }, [allUserChats, currentUniqueUserId]);

  return (
    <OpenChatContext.Provider
      value={{
        currentUniqueUserId,
        setUniqueUserId,
        currentUserDetails,
        allUserChats,
        setAllUserChats,
        currentUserChats,
        setCurrentUserOnline,
        currentUserOnline,
        loading,
        setTyping,
        typing
      }}
    >
      {children}
    </OpenChatContext.Provider>
  );
}

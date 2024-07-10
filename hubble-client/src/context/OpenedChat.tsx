// import { getUserDetails } from "@/actions/user";
// import { User } from "@prisma/client";
import { createContext, useEffect, useState } from "react";
import { iUser } from "../types/user";
import useGetData from "../hooks/axios/getData";
import { useCookies } from "react-cookie";

type icurrentUserChats = {
  type: string;
  message: string;
  time: Date;
};
export type iallUserChats = { [key: string]: icurrentUserChats[] };

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
};

export const OpenChatContext = createContext<iOpenChatValue | {}>({});

export function OpenChatProvider({ children }: { children: React.ReactNode }) {
  const [currentUniqueUserId, setUniqueUserId] = useState("");
  const [currentUserDetails, setCurrentUserDetails] = useState<iUser | {}>({});
  const [allUserChats, setAllUserChats] = useState<iallUserChats>();
  const [currentUserChats, setCurrentUserChats] =
    useState<icurrentUserChats[]>();
  const [currentUserOnline, setCurrentUserOnline] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies();

  const getUser = useGetData(
    `/user?id=${currentUniqueUserId}`,
    {
      headers: {
        authorization: cookies["auth"],
      },
    },
    true,
    [currentUniqueUserId]
  );
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
      }}
    >
      {children}
    </OpenChatContext.Provider>
  );
}

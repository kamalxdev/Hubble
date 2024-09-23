import { createContext, useMemo, useState } from "react";
import { calls } from "../types/call";
import useGetData from "../hooks/axios/getData";

type iCallHistory = {
  user: {
    id: string;
    name: string;
    username: string;
    avatar:string |null
  };
  call: {
    answer: boolean;
    id: string;
    createdAt: Date;
    type: string;
    incoming: boolean;
  };
};

export type iCallContext = {
  history: iCallHistory[] | [];
};

export const callContext = createContext<iCallContext | {}>({});

export function CallContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const call_history = useGetData("/call/history", {}, true, []);
  const [history, setHistory] = useState<calls[] | []>();
  useMemo(() => {
    if (!call_history.loading) {
        setHistory(call_history?.response?.history);
    }
  }, [call_history.response]);
  return (
    <callContext.Provider value={{ history }}>{children}</callContext.Provider>
  );
}

import { createContext, useState } from "react";



export const toggleContext = createContext<iToggleContext|{}>({});

export type iToggleContext={
  sidebar:iSidebar,
  setSidebar:(x:iSidebar)=>void
}



export type iSidebar= 'chats' | 'calls' | 'profile';

export function ToggleContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebar,setSidebar]=useState<iSidebar>('chats')
  return <toggleContext.Provider value={{sidebar,setSidebar}}>{children}</toggleContext.Provider>;
}

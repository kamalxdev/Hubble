import { createContext } from "react";



export const toggleContext = createContext({});



export function ToggleContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <toggleContext.Provider value={{}}>{children}</toggleContext.Provider>;
}

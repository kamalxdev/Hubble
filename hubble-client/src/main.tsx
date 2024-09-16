import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CurrentUserProvider } from "./context/user.tsx";
import { OpenChatProvider } from "./context/OpenedChat.tsx";
import { WebRTCcontextProvider } from "./context/webRTC.tsx";
import { SocketContextProvider } from "./context/socket.tsx";
import { ToggleContextProvider } from "./context/toggle.tsx";
import { CallContextProvider } from "./context/calls.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <CurrentUserProvider>
    <CallContextProvider>
    <OpenChatProvider>
      <WebRTCcontextProvider>
        <SocketContextProvider>
          <ToggleContextProvider>
            <App />
          </ToggleContextProvider>
        </SocketContextProvider>
      </WebRTCcontextProvider>
    </OpenChatProvider>
    </CallContextProvider>
  </CurrentUserProvider>
  // </React.StrictMode>,
);

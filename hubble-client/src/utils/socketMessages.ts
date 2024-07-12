import { iOpenChatValue } from "../context/OpenedChat";

export function listenMessages(
  openChat: iOpenChatValue,
  data: { event: string; payload: any }
) {
  if (data?.event) {
    switch (data?.event) {
      // listening and handling user offline

      case "user-offline":
        if (
          data?.payload?.id &&
          openChat.currentUniqueUserId == data?.payload?.id
        ) {
          openChat.setCurrentUserOnline(false);
        }
        break;
      // listening to user online

      case "user-online":
        if (
          data?.payload?.id &&
          openChat.currentUniqueUserId == data?.payload?.id
        ) {
          openChat.setCurrentUserOnline(true);
        }
        break;
      // listening to requested user online response

      case "user-online-response":
        if (
          data?.payload?.id &&
          openChat.currentUniqueUserId == data?.payload?.id
        ) {
          console.log("user online resopnse");

          openChat.setCurrentUserOnline(true);
        }
        break;
      //
      // listen to user message and set it in alluser chats
      case "message-recieved":
        if (
          openChat?.allUserChats &&
          openChat?.allUserChats[data?.payload?.from]
        ) {
          openChat.setAllUserChats({
            ...openChat?.allUserChats,
            [data?.payload?.from]: [
              ...openChat?.allUserChats[data?.payload?.from],
              {
                type: "sender",
                message: data?.payload?.message,
                time: data?.payload?.time,
              },
            ],
          });
        } else {
          openChat.setAllUserChats({
            ...openChat?.allUserChats,
            [data?.payload?.from]: [
              {
                type: "sender",
                message: data?.payload?.message,
                time: data?.payload?.time,
              },
            ],
          });
        }
        break;
      //
      case "message-recieved-start-typing":
        if (data?.payload?.id) {
          if(openChat.typing){
            openChat.setTyping({...openChat?.typing,[data?.payload?.id]:true})
            setTimeout(()=>{
            openChat.setTyping({...openChat?.typing,[data?.payload?.id]:false})
              
              },2500)
          }else{
            openChat.setTyping({[data?.payload?.id]:true})
            setTimeout(()=>{
            openChat.setTyping({[data?.payload?.id]:false})
            },2500)
          }
        }
        break;
      default:
        console.log("no event found");

        break;
    }
  } else {
    console.log("no event found");
  }
}

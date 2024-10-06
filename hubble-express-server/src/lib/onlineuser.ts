import { client } from "../redis";

export type iOnlineUser = {
  db_id: string;
  ws_id: string;
  platform?: string;
};

export async function setOnlineUsers(data: iOnlineUser) {
  try {
    let current_online_user = await client.get("OnlineUser");
    if (current_online_user) {
      await client.set(
        "OnlineUser",
        JSON.stringify([...JSON.parse(current_online_user), data])
      );
    } else {
      await client.set("OnlineUser", JSON.stringify([data]));
    }
    let online = await client.get("OnlineUser");
    console.log("from redis: ", JSON.parse(online as string));
  } catch (error) {
    console.log("Error on setting user online",error);
    
  }
}

export async function findOnlineUsers(using:'db'|'ws',id:string){
  try {
    let current_online_user = await client.get("OnlineUser");
    let current_online_user_json:iOnlineUser[]=JSON.parse(current_online_user as string);
    if(using=='db'){
      let user_to_find=current_online_user_json.find((u)=>u?.db_id==id)
      return user_to_find
    }else if(using=='ws'){
      let user_to_find=current_online_user_json.find((u)=>u?.ws_id==id)
      return user_to_find
    }
  } catch (error) {
    console.log("Error on finding user online",error);
  }
}

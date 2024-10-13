import { configDotenv } from "dotenv";
import { createClient } from "redis";
configDotenv();

export const client = createClient({
  socket:{
    host:process.env.REDIS_HOST,
    port:parseInt(process.env.REDIS_PORT as string)
  }
})
export async function startRedis() {
  try {
    await client.connect();
    client.set("OnlineUser",'[]')
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  }
}

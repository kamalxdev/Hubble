import { configDotenv } from "dotenv";
import { createClient } from "redis";
configDotenv();

export const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 10808,
  },
});

export async function startRedis() {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  }
}

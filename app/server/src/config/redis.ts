import { createClient } from "redis";
import { config } from "./config.ts";
// url: config.redisUrl
export const client = createClient({ url: config.redisUrl });

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

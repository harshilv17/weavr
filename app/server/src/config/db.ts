import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "./config.ts";

const pool = new Pool({
  connectionString: config.DatabaseUrl,
});

export const db = drizzle(pool);

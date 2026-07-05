import { db } from "../../config/db.ts";
import { eq } from "drizzle-orm";
import { users } from "../../db/schemas/user.schema.ts";

export const getUserByEmail = async (email: string) => {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0] ?? null;
};

export const getUserById = async (id: number) => {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] ?? null;
};

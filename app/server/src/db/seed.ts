import bcrypt from "bcryptjs";
import { users } from "./schemas/user.schema.ts";
import { db } from "../config/db.ts";

const DEMO_PASSWORD = "Demo@1234";

const DEMO_USERS = [
  { name: "Demo Account 1", email: "demo1@weavr.app" },
  { name: "Demo Account 2", email: "demo2@weavr.app" },
  { name: "Demo Account 3", email: "demo3@weavr.app" },
];

async function seed() {
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  for (const demo of DEMO_USERS) {
    await db
      .insert(users)
      .values({ ...demo, password: hashedPassword, isVerified: true })
      .onConflictDoUpdate({
        target: users.email,
        set: { password: hashedPassword, isVerified: true },
      });
    console.log(`seeded ${demo.email}`);
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error("seed failed:", err);
  process.exit(1);
});

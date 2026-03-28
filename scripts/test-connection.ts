import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../src/db/schema";
import "dotenv/config";

// Remove pgbouncer=true and change host if needed for testing
const url = process.env.DATABASE_URL?.replace("-pooler", "");

console.log("Testing with URL:", url);

const pool = new Pool({
  connectionString: url,
  ssl: {
    rejectUnauthorized: false,
  },
});

const db = drizzle(pool, { schema });

async function main() {
  try {
    console.log("Attempting to query User table...");
    const foundUsers = await db.query.users.findMany({ limit: 1 });
    console.log(`✅ Query successful! Found ${foundUsers.length} users.`);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await pool.end();
  }
}

main();

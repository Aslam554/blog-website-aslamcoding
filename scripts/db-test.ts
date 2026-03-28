import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../src/db/schema";

async function main() {
    // Attempting non-pooling URL
    const url = "postgresql://neondb_owner:npg_LT0nbkl4ArEf@ep-white-rice-a8gkzzmh.eastus2.azure.neon.tech/neondb?sslmode=require";
    
    const pool = new Pool({
        connectionString: url,
        ssl: { rejectUnauthorized: false }
    });
    
    const db = drizzle(pool, { schema });

    try {
        console.log('Attempting to connect to database using Drizzle (Non-Pooling)...')
        const foundUsers = await db.query.users.findMany({ limit: 1 })
        console.log(`✅ Query successful! Found ${foundUsers.length} users.`)

    } catch (error) {
        console.error('❌ Database connection failed:', error)
    } finally {
        await pool.end()
    }
}

main()

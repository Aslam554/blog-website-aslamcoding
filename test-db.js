const { Client } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_LT0nbkl4ArEf@ep-white-rice-a8gkzzmh-pooler.eastus2.azure.neon.tech/neondb?sslmode=require";

console.log("--- START TEST ---");
console.log("Connecting to:", connectionString);

const client = new Client({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false // Try to be permissive to rule out strict SSL issues first
    }
});

client.connect()
    .then(() => {
        console.log("SUCCESS: Connected to the database!");
        return client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    })
    .then(res => {
        console.log("TABLES IN DATABASE:", res.rows.map(r => r.table_name));
        console.log("--- END TEST: PASS ---");
        client.end();
        process.exit(0);
    })
    .catch(err => {
        console.error("ERROR: Connection failed.");
        console.error(err.message);
        if (err.code) console.error("Code:", err.code);
        console.log("--- END TEST: FAIL ---");
        client.end();
        process.exit(1);
    });

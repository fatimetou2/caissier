import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL manquante");
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function runFile(relativePath) {
  const sql = fs.readFileSync(path.join(root, relativePath), "utf8");
  await client.query(sql);
  console.log(`OK: ${relativePath}`);
}

try {
  await client.connect();
  await runFile("supabase/schema.sql");
  await runFile("supabase/test-data.sql");
  const result = await client.query(
    "select type, amount, date from public.cash_entries order by date, created_at",
  );
  console.log("Lignes:", result.rows);
} finally {
  await client.end();
}

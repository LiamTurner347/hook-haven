import { Client, QueryResult, QueryResultRow } from "pg";

const user = process.env.POSTGRES_USER;
const host = process.env.POSTGRES_HOST;
const password = process.env.POSTGRES_PW;
const database = process.env.POSTGRES_DATABASE;
const port = Number(process.env.POSTGRES_PORT);

const config = { user, host, database, port };
Object.assign(config, password ? { password } : {});

// console.log(config);

// Check if the application database exists and create it if not
export async function checkDatabase(): Promise<boolean> {
  // Connect to default postgres database
  const pgConfig = {
    user,
    host,
    password,
    database: "postgres",
    port,
  };

  const client = new Client(pgConfig);

  try {
    await client.connect();
    console.log("Connected to PostgreSQL to check database existence");

    // Check if the database exists
    const dbCheckResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [database]
    );

    // If database doesn't exist, create it
    if (dbCheckResult.rowCount === 0) {
      console.log(`Database ${database} does not exist, creating it...`);
      await client.query(`CREATE DATABASE ${database}`);
      console.log(`Database ${database} created successfully`);
    } else {
      console.log(`Database ${database} already exists`);
    }
    return true;
  } catch (err) {
    console.error("Error checking/creating database:", err);
    return false;
  } finally {
    await client.end();
  }
}

// Creates the necessary tables in the database if they don't exist
export async function createTables(): Promise<boolean> {
  const client = new Client(config);

  try {
    await client.connect();
    console.log(`Connected to ${database} database to check schema`);

    // Check if the bucket table exists
    const tableCheckResult = await client.query(
      "SELECT 1 FROM information_schema.tables WHERE table_name = 'bucket'"
    );

    // If tables don't exist, create them
    if (tableCheckResult.rowCount === 0) {
      console.log("Tables do not exist, creating schema...");

      // Create tables
      await client.query(`
        CREATE TABLE IF NOT EXISTS bucket (
          id serial PRIMARY KEY,
          uuid text UNIQUE,
          created_at timestamptz DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS request (
          id serial PRIMARY KEY, 
          bucket_id integer REFERENCES bucket(id) ON DELETE CASCADE,
          request_time timestamptz DEFAULT CURRENT_TIMESTAMP,
          method VARCHAR(10) CHECK (method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'TRACE', 'CONNECT')),
          url_path text,
          headers json,
          mongo_id char(24)
        );

        CREATE UNIQUE INDEX IF NOT EXISTS idx_bucket_uuid_id ON bucket(uuid, id);
      `);

      console.log("Schema created successfully");
    } else {
      console.log("Tables already exist");
    }

    return true;
  } catch (err) {
    console.error("Error setting up database schema:", err);
    return false;
  } finally {
    await client.end();
  }
}

// Initializes the database by checking if it exists and creating tables
export async function initializeDatabase(): Promise<boolean> {
  const dbExists = await checkDatabase();
  if (!dbExists) {
    return false;
  }

  return await createTables();
}

export async function pgQuery<T extends QueryResultRow>(
  sql: string,
  args?: any[]
): Promise<QueryResult<T> | null> {
  const client = new Client(config);

  try {
    await client.connect();

    const res = await client.query(sql, args);
    return res;
  } catch (err) {
    console.error("Error:", err);

    return null;
  } finally {
    await client.end();
  }
}

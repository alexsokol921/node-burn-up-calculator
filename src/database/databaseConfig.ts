import dotenv from 'dotenv';
import { PgPromiseDatabase, PgMemDatabase, Database, DatabaseDriver } from './database';

dotenv.config();
let dbDriver: DatabaseDriver;

if (process.env.DB_IS_IN_MEMORY === "true") {
  dbDriver = new PgMemDatabase();
} else {
  const connection: any = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  };
  dbDriver = new PgPromiseDatabase(connection);
}

const db = new Database(dbDriver);

export default db;

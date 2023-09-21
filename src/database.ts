import dotenv from 'dotenv';
import pgPromise from 'pg-promise';

dotenv.config();

const pgp = pgPromise();

const connection: any = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const db = pgp(connection);

export default db;

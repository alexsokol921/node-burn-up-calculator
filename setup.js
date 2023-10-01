require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pgp = require('pg-promise')();

// Database connection parameters
const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

// Create a database instance
const db = pgp(dbConfig);

// Function to execute an SQL file
async function executeSqlFile(filePath) {
  try {
    // Read the SQL file
    const sql = fs.readFileSync(filePath, 'utf8');

    // Execute the SQL query
    await db.none(sql); // Use `none` for SQL statements that don't return data
    console.log(`SQL file ${filePath} executed successfully.`);
  } catch (error) {
    console.error(`Error executing SQL file ${filePath}: ${error.message}`);
  }
}

const createTablesSqlFile = path.join(__dirname, 'sql', 'create_tables.sql');

executeSqlFile(createTablesSqlFile);

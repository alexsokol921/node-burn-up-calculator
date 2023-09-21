require('dotenv').config();
const pgp = require('pg-promise')();

// Database connection parameters
const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
};

// Create a database instance
const db = pgp(dbConfig);

async function setupDatabase() {
  try {
    await db.none(`
      CREATE TABLE IF NOT EXISTS public.sprints
      (
          id serial NOT NULL,
          team_id integer NOT NULL,
          effort_completed integer NOT NULL,
          milestone_total_effort integer NOT NULL,
          created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
          sprint_end_date date NOT NULL,
          CONSTRAINT sprints_pkey PRIMARY KEY (id)
      );

      ALTER TABLE IF EXISTS public.sprints
          OWNER to $1:name;
    `, dbConfig.user);

    console.log('Database setup completed.');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    pgp.end(); // Close the database connection
  }
}

setupDatabase();

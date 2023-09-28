import dotenv from 'dotenv';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import app, { server } from '../src/index';
import db from '../src/database/databaseConfig';
import { Sprint } from '../src/models/Sprint';

dotenv.config();

describe('Sprint Routes Integration Tests', () => {
    const createTablesSqlFile = path.join(__dirname, '..', 'sql', 'create_tables.sql');
    const dropTablesSqlFile = path.join(__dirname, '..', 'sql', 'drop_tables.sql');

    async function executeSqlFile(filePath: string) {
      try {
        // Read the SQL file
        const sql = fs.readFileSync(filePath, 'utf8');
    
        // Execute the SQL query
        await db.query(sql);
        console.log(`SQL file ${filePath} executed successfully.`);
      } catch (error: any) {
        console.error(`Error executing SQL file ${filePath}: ${error}`);
      }
    }

    const removeIgnoredProperties = (sprint: Sprint) => {
      const { id, createdAt, ...rest } = sprint;
      return rest;
    }

    beforeAll(async () => {
         await executeSqlFile(createTablesSqlFile);
    });

    afterAll(async () => {
        await executeSqlFile(dropTablesSqlFile);
        await server.close();
    });
  it('GET /sprints should return a list of sprints', async () => {
    const expectedData: any = {
      teamId: 6,
      effortCompleted: 12,
      milestoneTotalEffort: 140,
      sprintEndDate: new Date('2023-09-26').toISOString(),
    };
    await db.query(`INSERT INTO sprints (team_id, effort_completed, milestone_total_effort, sprint_end_date) VALUES (${expectedData.teamId}, ${expectedData.effortCompleted}, ${expectedData.milestoneTotalEffort}, '${expectedData.sprintEndDate}')`);
    
    const response = await request(app).get('/api/sprints');

    const actualWithoutIgnoredProperties = response.body.map(removeIgnoredProperties);

    expect(response.status).toBe(200);
    expect(actualWithoutIgnoredProperties).toEqual([expectedData]);
  });

  it('GET /team/:teamId/sprints should return sprints for a team', async () => {
    const teamId = 4;
    const expectedData: any = {
      teamId,
      effortCompleted: 12,
      milestoneTotalEffort: 140,
      sprintEndDate: new Date('2023-09-26').toISOString(),
    };

    await db.query(`INSERT INTO sprints (team_id, effort_completed, milestone_total_effort, sprint_end_date) VALUES (${expectedData.teamId}, ${expectedData.effortCompleted}, ${expectedData.milestoneTotalEffort}, '${expectedData.sprintEndDate}')`);
    await db.query(`INSERT INTO sprints (team_id, effort_completed, milestone_total_effort, sprint_end_date) VALUES (7, 13, 270, '2023-09-21')`);

    const response = await request(app).get(`/api/team/${teamId}/sprints`);

    const actualWithoutIgnoredProperties = response.body.map(removeIgnoredProperties);

    expect(response.status).toBe(200);
    expect(actualWithoutIgnoredProperties).toEqual([expectedData]);
  });

  it('POST /sprints should create a new sprint', async () => {
    const newSprint = {
      teamId: 5,
      effortCompleted: 10,
      milestoneTotalEffort: 20,
      sprintEndDate: new Date('2023-09-30').toISOString(),
    };

    const response = await request(app).post('/api/sprints').send(newSprint);

    const actualWithoutIgnoredProperties = removeIgnoredProperties(response.body);

    expect(response.status).toBe(201);
    expect(actualWithoutIgnoredProperties).toEqual(newSprint);
  });

  // Add more integration tests for your other routes (PUT, DELETE, etc.)
});

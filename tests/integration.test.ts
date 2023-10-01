import dotenv from 'dotenv';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import app, { server } from '../src/index';
import db from '../src/database/databaseConfig';
import { Sprint } from '../src/models/Sprint';

dotenv.config();

describe('Sprint Routes Integration Tests', () => {
  const createTablesSqlFile = path.join(
    __dirname,
    '..',
    'sql',
    'create_tables.sql'
  );
  const dropTablesSqlFile = path.join(
    __dirname,
    '..',
    'sql',
    'drop_tables.sql'
  );

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
  };

  beforeAll(async () => {
    await executeSqlFile(createTablesSqlFile);
  });

  afterAll(async () => {
    await executeSqlFile(dropTablesSqlFile);
    await server.close();
  });
  it('GET /api/sprints should return a list of sprints', async () => {
    const expectedData: any = {
      teamId: 6,
      effortCompleted: 12,
      milestoneTotalEffort: 140,
      sprintEndDate: new Date('2023-09-26').toISOString(),
    };
    await db.query(
      `INSERT INTO sprints (team_id, effort_completed, milestone_total_effort, sprint_end_date) VALUES (${expectedData.teamId}, ${expectedData.effortCompleted}, ${expectedData.milestoneTotalEffort}, '${expectedData.sprintEndDate}')`
    );

    const response = await request(app).get('/api/sprints');

    const actualWithoutIgnoredProperties = response.body.map(
      removeIgnoredProperties
    );

    expect(response.status).toBe(200);
    expect(actualWithoutIgnoredProperties).toEqual([expectedData]);
  });

  it('GET /api/team/:teamId/sprints should return sprints for a team', async () => {
    const teamId = 4;
    const expectedData: any = {
      teamId,
      effortCompleted: 12,
      milestoneTotalEffort: 140,
      sprintEndDate: new Date('2023-09-26').toISOString(),
    };

    await db.query(
      `INSERT INTO sprints (team_id, effort_completed, milestone_total_effort, sprint_end_date) VALUES (${expectedData.teamId}, ${expectedData.effortCompleted}, ${expectedData.milestoneTotalEffort}, '${expectedData.sprintEndDate}')`
    );
    await db.query(
      `INSERT INTO sprints (team_id, effort_completed, milestone_total_effort, sprint_end_date) VALUES (7, 13, 270, '2023-09-21')`
    );

    const response = await request(app).get(`/api/team/${teamId}/sprints`);

    const actualWithoutIgnoredProperties = response.body.map(
      removeIgnoredProperties
    );

    expect(response.status).toBe(200);
    expect(actualWithoutIgnoredProperties).toEqual([expectedData]);
  });

  it('GET /api/velocity/:teamId/:sampleSize should return sprint and velocity for a team', async () => {
    const teamId = 9;
    const expectedSprints: any[] = [
      {
        teamId,
        effortCompleted: 12,
        milestoneTotalEffort: 140,
        sprintEndDate: new Date('2023-08-26').toISOString(),
      },
      {
        teamId,
        effortCompleted: 3,
        milestoneTotalEffort: 140,
        sprintEndDate: new Date('2023-08-19').toISOString(),
      },
      {
        teamId,
        effortCompleted: 8,
        milestoneTotalEffort: 140,
        sprintEndDate: new Date('2023-08-12').toISOString(),
      },
      {
        teamId,
        effortCompleted: 5,
        milestoneTotalEffort: 140,
        sprintEndDate: new Date('2023-08-05').toISOString(),
      },
    ];
    const sampleSize = 3;

    await db.query(
      `INSERT INTO sprints (team_id, effort_completed, milestone_total_effort, sprint_end_date) VALUES (${expectedSprints[0].teamId}, ${expectedSprints[0].effortCompleted}, ${expectedSprints[0].milestoneTotalEffort}, '${expectedSprints[0].sprintEndDate}')`
    );
    await db.query(
      `INSERT INTO sprints (team_id, effort_completed, milestone_total_effort, sprint_end_date) VALUES (${expectedSprints[1].teamId}, ${expectedSprints[1].effortCompleted}, ${expectedSprints[1].milestoneTotalEffort}, '${expectedSprints[1].sprintEndDate}')`
    );
    await db.query(
      `INSERT INTO sprints (team_id, effort_completed, milestone_total_effort, sprint_end_date) VALUES (${expectedSprints[2].teamId}, ${expectedSprints[2].effortCompleted}, ${expectedSprints[2].milestoneTotalEffort}, '${expectedSprints[2].sprintEndDate}')`
    );
    await db.query(
      `INSERT INTO sprints (team_id, effort_completed, milestone_total_effort, sprint_end_date) VALUES (${expectedSprints[3].teamId}, ${expectedSprints[3].effortCompleted}, ${expectedSprints[3].milestoneTotalEffort}, '${expectedSprints[3].sprintEndDate}')`
    );

    const response = await request(app).get(
      `/api/velocity/${teamId}/${sampleSize}`
    );

    const actualWithoutIgnoredProperties = response.body.sprints.map(
      removeIgnoredProperties
    );

    expect(response.status).toBe(200);
    expect(actualWithoutIgnoredProperties).toEqual(expectedSprints);
    expect(response.body.lowVelocity).toBe(5.5);
    expect(response.body.averageVelocity).toBeCloseTo(7.67);
    expect(response.body.highVelocity).toBe(10);
  });

  it('POST /api/sprints should create a new sprint', async () => {
    const newSprint = {
      teamId: 5,
      effortCompleted: 10,
      milestoneTotalEffort: 20,
      sprintEndDate: new Date('2023-09-30').toISOString(),
    };

    const response = await request(app).post('/api/sprints').send(newSprint);

    const actualWithoutIgnoredProperties = removeIgnoredProperties(
      response.body
    );

    expect(response.status).toBe(201);
    expect(actualWithoutIgnoredProperties).toEqual(newSprint);
  });

  it('PUT /api/sprints/:id should update a sprint', async () => {
    const expectedData: any = {
      teamId: 11,
      effortCompleted: 12,
      milestoneTotalEffort: 140,
      sprintEndDate: new Date('2023-09-26').toISOString(),
    };
    const insertedSprintResponse: any[] = await db.query(
      `INSERT INTO sprints (team_id, effort_completed, milestone_total_effort, sprint_end_date) VALUES (10, 14, 160, '${expectedData.sprintEndDate}') RETURNING *`
    );
    const id = insertedSprintResponse[0].id;

    const response = await request(app)
      .put(`/api/sprints/${id}`)
      .send(expectedData);

    const actualWithoutIgnoredProperties = removeIgnoredProperties(
      response.body
    );

    expect(response.status).toBe(200);
    expect(actualWithoutIgnoredProperties).toEqual(expectedData);
  });

  it('DELETE /api/sprints/:id should delete a sprint', async () => {
    const insertedSprintResponse: any[] = await db.query(
      `INSERT INTO sprints (team_id, effort_completed, milestone_total_effort, sprint_end_date) VALUES (10, 14, 160, '2023-09-28') RETURNING *`
    );
    const id = insertedSprintResponse[0].id;

    const response = await request(app).delete(`/api/sprints/${id}`);

    const deletedSprint: any = await db.query(
      `SELECT * FROM sprints WHERE id = ${id}`
    );

    expect(response.status).toBe(204);
    expect(deletedSprint).toBeNull;
  });
});

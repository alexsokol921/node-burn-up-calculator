import { Sprint, SprintData } from '../models/Sprint';
import { Database } from '../database/database';

export abstract class BaseRepository<T> {
  protected abstract tableName: string;

  constructor(protected db: Database) {}

  protected async executeQuery(query: string, values: any[]): Promise<T[]> {
    try {
      const results: T[] = await this.db.query(query, values);
      return results;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `An error occurred while executing the query: ${error.message}`
        );
      } else {
        throw new Error(`An unknown error occurred while executing the query`);
      }
    }
  }
}

export class SprintRepository extends BaseRepository<SprintData> {
  protected tableName = 'sprints';

  async getSprints(page: number = 1, pageSize: number = 10): Promise<Sprint[]> {
    const offset = (page - 1) * pageSize; // Calculate the offset based on page number
    const query = `
      SELECT * 
      FROM ${this.tableName}
      ORDER BY sprint_end_date DESC
      LIMIT $1
      OFFSET $2
    `;
    const values = [pageSize, offset];

    const results: SprintData[] = await this.executeQuery(query, values);
    return results.map(SprintMapper.mapToSprintModel);
  }

  async getSprintsByTeam(
    teamId: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<Sprint[]> {
    const offset = (page - 1) * pageSize; // Calculate the offset based on page number
    const query = `
      SELECT * 
      FROM ${this.tableName} 
      WHERE team_id = $1
      ORDER BY sprint_end_date DESC
      LIMIT $2
      OFFSET $3
    `;
    const values = [teamId, pageSize, offset];

    const results: SprintData[] = await this.executeQuery(query, values);
    return results.map(SprintMapper.mapToSprintModel);
  }

  async createSprint(
    teamId: number,
    effortCompleted: number,
    milestoneTotalEffort: number,
    sprintEndDate: Date
  ): Promise<Sprint> {
    const query = `INSERT INTO ${this.tableName} (team_id, effort_completed, milestone_total_effort, sprint_end_date) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [
      teamId,
      effortCompleted,
      milestoneTotalEffort,
      sprintEndDate,
    ];
    const results: SprintData[] = await this.executeQuery(query, values);
    return SprintMapper.mapToSprintModel(results[0]);
  }

  async updateSprint(
    id: number,
    teamId: number,
    effortCompleted: number,
    milestoneTotalEffort: number,
    sprintEndDate: Date
  ): Promise<Sprint> {
    const query = `UPDATE ${this.tableName} SET team_id = $1, effort_completed = $2, milestone_total_effort = $3, sprint_end_date = $4 WHERE id = $5 RETURNING *`;
    const values = [
      teamId,
      effortCompleted,
      milestoneTotalEffort,
      sprintEndDate,
      id,
    ];
    const results: SprintData[] = await this.executeQuery(query, values);
    return SprintMapper.mapToSprintModel(results[0]);
  }

  async deleteSprint(id: number): Promise<void> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
    const values = [id];

    try {
      await this.executeQuery(query, values);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `An error occurred while deleting the sprint: ${error.message}`
        );
      } else {
        throw new Error(`An unknown error occurred while deleting the sprint`);
      }
    }
  }
}

// Mapper class to convert data to the Sprint model
export class SprintMapper {
  static mapToSprintModel(data: SprintData): Sprint {
    return {
      id: data.id,
      teamId: data.team_id,
      effortCompleted: data.effort_completed,
      milestoneTotalEffort: data.milestone_total_effort,
      sprintEndDate: new Date(data.sprint_end_date),
      createdAt: new Date(data.created_at),
    };
  }
}

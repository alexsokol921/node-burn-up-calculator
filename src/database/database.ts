import pgPromise from 'pg-promise';
import * as pgMem from 'pg-mem';

export interface DatabaseDriver {
  query(sql: string, params?: any[]): Promise<any>;
}

export class PgPromiseDatabase implements DatabaseDriver {
  private db: pgPromise.IDatabase<{}>;

  constructor(dbConfig: object) {
    this.db = pgPromise()(dbConfig);
  }

  async query(sql: string, params: any[] = []): Promise<any> {
    try {
      return await this.db.any(sql, params);
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

export class PgMemDatabase implements DatabaseDriver {
  private db: pgMem.IMemoryDb;

  constructor() {
    this.db = pgMem.newDb();
  }

  async query(sql: string, params: any[] = []): Promise<any> {
    try {
      // Convert Date objects to ISO strings
      const formattedParams = params.map((param) => {
        if (param instanceof Date) {
          return param.toISOString();
        }
        return param;
      });

      const combinedSql = this.combineSqlWithParams(sql, formattedParams);

      const results = await this.db.public.query(combinedSql);
      return results.rows;
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

  // Combine sql and params into a single SQL statement.
  private combineSqlWithParams(sql: string, params: any[]): string {
    return params.reduce((sql, param, index) => {
      const placeholder = `$${index + 1}`;
      // Check if the parameter is a string and enclose it in single quotes
      const paramValue = typeof param === 'string' ? `'${param}'` : param;
      return sql.replace(placeholder, paramValue);
    }, sql);
  }
}

export class Database {
  private driver: DatabaseDriver;

  constructor(driver: DatabaseDriver) {
    this.driver = driver;
  }

  async query(sql: string, params: any[] = []): Promise<any> {
    return await this.driver.query(sql, params);
  }
}

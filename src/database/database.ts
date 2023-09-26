import pgPromise from "pg-promise";
import * as pgMem from "pg-mem";

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
        throw new Error(`An error occurred while executing the query: ${error.message}`);
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
      // Combine sql and params into a single SQL statement.
      const combinedSql = params.reduce((sql, param, index) => {
        const placeholder = `$${index + 1}`;
        return sql.Replace(placeholder, param);
      }, sql);

      return await this.db.public.query(combinedSql);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`An error occurred while executing the query: ${error.message}`);
      } else {
        throw new Error(`An unknown error occurred while executing the query`);
      }
    }
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

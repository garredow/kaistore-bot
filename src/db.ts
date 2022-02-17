import knex from 'knex';
import pg from 'pg';
import { config } from './config';
import { DbAppUpdate, DbWebhook } from './models';

pg.types.setTypeParser(pg.types.builtins.INT8, (value: string) => {
  return parseInt(value);
});

enum Table {
  AppUpdate = 'app_update',
  Webhook = 'webhook',
}

export class Database {
  private db;

  constructor() {
    this.db = knex({
      client: 'pg',
      connection: {
        host: config.database.host,
        port: config.database.port,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database,
        application_name: config.meta.appName,
        ssl: config.database.ssl
          ? {
              rejectUnauthorized: false,
            }
          : false,
      },
    });
  }

  async getLatestAppUpdate(): Promise<DbAppUpdate | undefined> {
    return this.db<DbAppUpdate>(Table.AppUpdate).orderBy('release_date', 'desc').first();
  }

  async addAppUpdate(bundle_id: string, version: string, release_date: number): Promise<void> {
    return this.db<DbAppUpdate>(Table.AppUpdate).insert({ bundle_id, version, release_date });
  }

  async getWebhooks(): Promise<DbWebhook[]> {
    return this.db<DbWebhook>(Table.Webhook);
  }
}

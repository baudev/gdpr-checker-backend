import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Report } from './report/report.entity';
import { Url } from './url/url.entity';
import { Cookie } from './cookie/cookie.entity';
const environment = process.env.NODE_ENV || '';
const data: any = dotenv.parse(fs.readFileSync(`${environment}.env`));

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: data.DATABASE_HOST,
  port: data.DATABASE_PORT,
  username: data.DATABASE_USERNAME,
  password: data.DATABASE_PASSWORD,
  database: data.DATABASE_NAME,
  migrationsTableName: 'migration_table',
  migrations: ['src/migrations/**/*.{ts,js}'],
  cli: {
    migrationsDir: 'src/migration',
  },
  extra: {
    rejectUnauthorized: false,
  },
  entities: [Report, Url, Cookie],
};

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Report } from './report/report.entity';
import { Url } from './url/url.entity';
import { Cookie } from './cookie/cookie.entity';
import { join } from 'path';
// TODO handle different env
// const environment = process.env.NODE_ENV || '';
const data: any = dotenv.parse(fs.readFileSync(`.env`));

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || data.DATABASE_HOST,
  port: process.env.DATABASE_PORT || data.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME || data.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD || data.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME || data.DATABASE_NAME,
  migrationsTableName: 'migration_table',
  migrations: [join(__dirname, '**', '*.ts')],
  cli: {
    migrationsDir: 'src/migration',
  },
  extra: {
    rejectUnauthorized: false,
  },
  entities: [Report, Url, Cookie],
};

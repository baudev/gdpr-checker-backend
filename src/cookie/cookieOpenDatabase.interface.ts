// https://github.com/jkwakman/Open-Cookie-Database
import { CookieOpenDatabaseCategoryEnum } from './cookieOpenDatabaseCategory.enum';

export interface CookieOpenDatabaseInterface {
  ID: string;
  Platform: string;
  Category: CookieOpenDatabaseCategoryEnum;
  'Cookie / Data Key name': string;
  Domain: string;
  Description: string;
  'Retention period': string;
  'Data Controller': string;
  'User Privacy & GDPR Rights Portals': string;
  'Wildcard match': string;
}

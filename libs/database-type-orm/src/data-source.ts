/* eslint-disable @typescript-eslint/no-var-requires */
import { DataSource } from 'typeorm';
// import AuthorizationMigrations from '../../authorization/src/migrations';
// import { AuthorizationEntities } from '../../authorization/src/entities';
// import ResourceEntities from '../../resource/src/entities';
// import LanguageEntities from '../../language/src/entities';
// import ResourceMigrations from '../../resource/src/migrations';
// import LanguageMigrations from '../../language/src/migrations';
import ConfigEntities from '../../config/src/entities';
import { DefaultEntities } from './entities';
import { DefaultMigrations } from './migrations';
// import ConfigMigrations from '../../config/src/migrations';
// import NotificationEntities from '../../notification/src/entities';
// import NotificationMigrations from '../../notification/src/migrations';
require('dotenv').config();

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
  timezone: 'Z',
  charset: 'utf8mb4',
  bigNumberStrings: false,
  entities: [
    ...DefaultEntities,
    // ...AuthorizationEntities,
    // ...ResourceEntities,
    // ...LanguageEntities,
    ...ConfigEntities,
    // ...NotificationEntities,
  ],
  migrations: [
    ...DefaultMigrations,
    // ...AuthorizationMigrations,
    // ...ResourceMigrations,
    // ...LanguageMigrations,
    // ...ConfigMigrations,
    // ...NotificationMigrations,
  ],
  subscribers: [],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
});

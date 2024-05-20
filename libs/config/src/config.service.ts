// import { GlobalCacheService } from '@app/cache';
// import { ErrorCode } from '@app/core/constants/enum';
// import { Exception } from '@app/core/exception';
// import { InjectRepository } from '@nestjs/typeorm';
// import { EntityManager, Repository } from 'typeorm';
// import Config from './entities/Config';
// import { Injectable } from "@nestjs/common";
//
// interface ISearchConfigParams {
//   keyword?: string;
// }
//
// // export const KEY_CACHE_CONFIG = assignCachePrefix('KEY_CACHE_CONFIG');
//
// @Injectable()
// export class LibraryConfigService {
//   constructor(
//     @InjectRepository(Config) private configRepository: Repository<Config>,
//     private cacheManager: GlobalCacheService,
//   ) {}
//
//   /**
//    * Get list config data.
//    */
//   async getListConfig(params: ISearchConfigParams) {
//     const configs = this.configRepository.createQueryBuilder('config');
//
//     if (params.keyword) {
//       configs.where('config.name like :name', { name: `%${params.keyword}%` });
//     }
//
//     return await configs.getMany();
//   }
//
//   async updateConfig(key: string, params: { name: string; order: number }) {
//     const KEY_CACHE_CONFIG =
//       this.cacheManager.createKeyCacheData('KEY_CACHE_CONFIG');
//     await this.configRepository.update(key, params);
//     await this.cacheManager.del(KEY_CACHE_CONFIG);
//   }
//
//   async getDetailConfig(key: string) {
//     const config = await this.configRepository.findOne({ where: { key } });
//     if (!config)
//       throw new Exception(
//         ErrorCode.Not_Found,
//         `Not found this config key: ${key}`,
//       );
//     return config;
//   }
//
//   /**
//    * In some cases, such as Resources and Languages
//    * Configuration must be incremented every time the time table has any change.
//    * 1. Create new config key if not exist.
//    * 2. Increment config value.
//    */
//   async updateVersionConfig(transaction: EntityManager, key: string) {
//     const KEY_CACHE_CONFIG =
//       this.cacheManager.createKeyCacheData('KEY_CACHE_CONFIG');
//
//     await transaction.query(
//       `INSERT INTO config (\`key\`, \`name\`, \`value\`, \`is_system\`, \`created_by\`, \`order\`)
//       SELECT \`temp\`.* FROM (SELECT ? as \`key\`, ? as \`name\`, 0 as \`value\`, 1 as \`is_system\`, 1 as \`created_by\`, 0 as \`order\`) as temp
//       WHERE NOT EXISTS ( SELECT \`key\` FROM \`config\` WHERE \`key\` = ?) LIMIT 1`,
//       [key, key, key],
//     );
//
//     await transaction.query(
//       'UPDATE config SET `value` = IFNULL(`value`, 0) + 1  WHERE `key` = ?',
//       [key],
//     );
//     await this.cacheManager.del(KEY_CACHE_CONFIG);
//   }
//
//   async getConfigInfo() {
//     const KEY_CACHE_CONFIG =
//       this.cacheManager.createKeyCacheData('KEY_CACHE_CONFIG');
//
//     const cacheData = (await this.cacheManager.get(KEY_CACHE_CONFIG)) as any;
//     if (cacheData) return JSON.parse(cacheData);
//
//     const configs = await this.configRepository.find();
//
//     const result = configs.reduce(
//       (acc, cur) => {
//         acc[cur.key] = cur;
//         return acc;
//       },
//       {} as { [key: string]: Config },
//     );
//
//     await this.cacheManager.set(KEY_CACHE_CONFIG, JSON.stringify(result));
//     return result;
//   }
// }

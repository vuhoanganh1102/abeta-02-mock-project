import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableConfig1644937675926 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`config\` (
        \`key\` varchar(200) NOT NULL, 
        \`name\` varchar(255) NOT NULL, 
        \`value\` text NOT NULL, 
        \`type\` varchar(50) NULL, 
        \`order\` tinyint NULL, 
        \`is_system\` tinyint NULL, 
        \`created_by\` bigint UNSIGNED NULL, 
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`key\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`config\``);
  }
}

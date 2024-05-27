import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1716795284989 implements MigrationInterface {
  name = 'Migrations1716795284989';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`request_admin\` DROP COLUMN \`status\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`request\` ADD \`status\` tinyint UNSIGNED NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`request\` DROP COLUMN \`status\``);
    await queryRunner.query(
      `ALTER TABLE \`request_admin\` ADD \`status\` tinyint UNSIGNED NOT NULL DEFAULT '0'`,
    );
  }
}

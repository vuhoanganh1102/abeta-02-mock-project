import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1716797423753 implements MigrationInterface {
  name = 'Migrations1716797423753';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`request_admin\` DROP COLUMN \`status\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`request\` ADD \`status\` tinyint UNSIGNED NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`email_otp\` ADD \`user_type\` tinyint NOT NULL COMMENT '0: user, 1: admin'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`email_otp\` DROP COLUMN \`user_type\``,
    );
    await queryRunner.query(`ALTER TABLE \`request\` DROP COLUMN \`status\``);
    await queryRunner.query(
      `ALTER TABLE \`request_admin\` ADD \`status\` tinyint UNSIGNED NOT NULL DEFAULT '0'`,
    );
  }
}

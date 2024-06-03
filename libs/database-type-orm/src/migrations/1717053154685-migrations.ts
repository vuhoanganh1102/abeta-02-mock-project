import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1717053154685 implements MigrationInterface {
  name = 'Migrations1717053154685';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`email_otp\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`email_otp\` DROP COLUMN \`deleted_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`email_otp\` ADD \`deleted_at\` datetime(6) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`email_otp\` DROP COLUMN \`deleted_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`email_otp\` ADD \`deleted_at\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`email_otp\` DROP COLUMN \`created_at\``,
    );
  }
}

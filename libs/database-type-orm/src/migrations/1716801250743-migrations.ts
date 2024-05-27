import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1716801250743 implements MigrationInterface {
  name = 'Migrations1716801250743';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`email_otp\` DROP FOREIGN KEY \`FK_ca8abd38e38111f43217d502863\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`email_otp\` ADD CONSTRAINT \`FK_ca8abd38e38111f43217d502863\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

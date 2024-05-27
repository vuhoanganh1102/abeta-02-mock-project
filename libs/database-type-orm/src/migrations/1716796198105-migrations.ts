import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
function generateOtp(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }
  return otp;
}
export class Migrations1716796198105 implements MigrationInterface {
  name = 'Migrations1716796198105';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const email = 'anhvh1102@gmail.com';
    const password = await bcrypt.hashSync('12345', bcrypt.genSaltSync());
    const resetToken = generateOtp(10);
    await await queryRunner.query(
      `ALTER TABLE \`request_admin\` DROP COLUMN \`status\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`request\` ADD \`status\` tinyint UNSIGNED NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`email_otp\` ADD \`user_type\` tinyint NOT NULL COMMENT '0: user, 1: admin'`,
    );
    // await queryRunner.query(`
    // INSERT INTO \`admin\` (email, password, reset_token)
    // VALUES ('${email}', '${password}', '${resetToken}')
    // `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`email_otp\` DROP COLUMN \`user_type\``,
    );
    await queryRunner.query(`ALTER TABLE \`request\` DROP COLUMN \`status\``);
    await queryRunner.query(
      `ALTER TABLE \`request_admin\` ADD \`status\` tinyint UNSIGNED NOT NULL DEFAULT '0'`,
    );
    // await queryRunner.query(`
    //         DELETE FROM admin WHERE email = 'anhvh1102@gmail.com'
    //     `);
  }
}

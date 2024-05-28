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
export class Migrations1716866709892 implements MigrationInterface {
  name = 'Migrations1716866709892';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const email = 'anhvh1102@gmail.com';
    const password = await bcrypt.hashSync('12345', bcrypt.genSaltSync());
    const resetToken = generateOtp(20);
    await queryRunner.query(
      `CREATE TABLE \`config\` (\`key\` varchar(200) NOT NULL, \`name\` varchar(255) NOT NULL, \`value\` text NOT NULL, \`type\` varchar(50) NULL, \`order\` tinyint NULL, \`is_system\` tinyint NULL, \`created_by\` bigint UNSIGNED NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`key\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`request\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`content\` varchar(1000) NOT NULL, \`check_in\` timestamp NULL, \`check_out\` timestamp NULL, \`attendance_id\` bigint UNSIGNED NOT NULL, \`image_url\` varchar(255) NULL, \`status\` tinyint UNSIGNED NOT NULL DEFAULT '0', \`deleted_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`attendance\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`user_id\` bigint UNSIGNED NOT NULL, \`date\` date NOT NULL, \`check_in\` timestamp NULL, \`check_out\` timestamp NULL, \`work_hours\` float NULL, \`late_time\` float NULL, \`status\` int UNSIGNED NOT NULL COMMENT '1: active, 0: deleted, 2: pending, 3: reject' DEFAULT '1', \`deleted_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`first_name\` varchar(255) NULL, \`last_name\` varchar(255) NULL, \`password\` varchar(255) NOT NULL, \`phone_number\` varchar(20) NULL, \`date_of_birth\` varchar(255) NULL, \`avatar\` varchar(255) NULL, \`refresh_token\` varchar(500) NULL, \`reset_token\` varchar(500) NULL, \`is_verify\` tinyint NOT NULL DEFAULT '0', \`deleted_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`IDX_01eea41349b6c9275aec646eee\` (\`phone_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_notification\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`receiver_id\` bigint UNSIGNED NOT NULL, \`notification_id\` bigint UNSIGNED NOT NULL, \`is_read\` tinyint UNSIGNED NOT NULL DEFAULT '0', \`deleted_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`notification\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`content\` varchar(1000) NOT NULL, \`status\` tinyint NOT NULL DEFAULT '0', \`sender_id\` bigint UNSIGNED NOT NULL, \`schedule_time\` datetime NOT NULL, \`deleted_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`request_admin\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`request_id\` bigint UNSIGNED NOT NULL, \`admin_id\` bigint UNSIGNED NOT NULL, \`deleted_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_5c6904300753ccfd06ea80acf3\` (\`request_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`admin\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`refresh_token\` varchar(500) NULL, \`reset_token\` varchar(500) NULL, \`deleted_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_de87485f6489f5d0995f584195\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`company_config\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`morning_start_time\` timestamp NULL, \`morning_end_time\` timestamp NULL, \`afternoon_start_time\` timestamp NULL, \`afternoon_end_time\` timestamp NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`email_otp\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`user_id\` bigint UNSIGNED NOT NULL, \`user_email\` varchar(255) NOT NULL, \`otp\` varchar(500) NOT NULL, \`otp_category\` tinyint NOT NULL COMMENT '1: verify otp, 2: reset password otp', \`user_type\` tinyint NOT NULL COMMENT '0: user, 1: admin', \`is_current\` tinyint NOT NULL DEFAULT '1', \`expired_at\` datetime NOT NULL, \`deleted_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`request\` ADD CONSTRAINT \`FK_132251cae1dbf605da82830f5f9\` FOREIGN KEY (\`attendance_id\`) REFERENCES \`attendance\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendance\` ADD CONSTRAINT \`FK_0bedbcc8d5f9b9ec4979f519597\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_notification\` ADD CONSTRAINT \`FK_61c95c494f10013151aa9c5e349\` FOREIGN KEY (\`receiver_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_notification\` ADD CONSTRAINT \`FK_db8be208a22e59619d1e38cc831\` FOREIGN KEY (\`notification_id\`) REFERENCES \`notification\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_56023c91b76b36125acd4dcd9c5\` FOREIGN KEY (\`sender_id\`) REFERENCES \`admin\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`request_admin\` ADD CONSTRAINT \`FK_5c6904300753ccfd06ea80acf37\` FOREIGN KEY (\`request_id\`) REFERENCES \`request\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`request_admin\` ADD CONSTRAINT \`FK_91aa2436d98705dd0dc6addcddd\` FOREIGN KEY (\`admin_id\`) REFERENCES \`admin\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`
    INSERT INTO \`admin\` (email, password, reset_token)
    VALUES ('${email}', '${password}', '${resetToken}')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`request_admin\` DROP FOREIGN KEY \`FK_91aa2436d98705dd0dc6addcddd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`request_admin\` DROP FOREIGN KEY \`FK_5c6904300753ccfd06ea80acf37\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_56023c91b76b36125acd4dcd9c5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_notification\` DROP FOREIGN KEY \`FK_db8be208a22e59619d1e38cc831\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_notification\` DROP FOREIGN KEY \`FK_61c95c494f10013151aa9c5e349\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendance\` DROP FOREIGN KEY \`FK_0bedbcc8d5f9b9ec4979f519597\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`request\` DROP FOREIGN KEY \`FK_132251cae1dbf605da82830f5f9\``,
    );
    await queryRunner.query(`DROP TABLE \`email_otp\``);
    await queryRunner.query(`DROP TABLE \`company_config\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_de87485f6489f5d0995f584195\` ON \`admin\``,
    );
    await queryRunner.query(`DROP TABLE \`admin\``);
    await queryRunner.query(
      `DROP INDEX \`REL_5c6904300753ccfd06ea80acf3\` ON \`request_admin\``,
    );
    await queryRunner.query(`DROP TABLE \`request_admin\``);
    await queryRunner.query(`DROP TABLE \`notification\``);
    await queryRunner.query(`DROP TABLE \`user_notification\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_01eea41349b6c9275aec646eee\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`attendance\``);
    await queryRunner.query(`DROP TABLE \`request\``);
    await queryRunner.query(`DROP TABLE \`config\``);
    await queryRunner.query(`
            DELETE FROM admin WHERE email = 'anhvh1102@gmail.com'
        `);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1716525831532 implements MigrationInterface {
  name = 'Migrations1716525831532';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_notification\` DROP FOREIGN KEY \`FK_ed67d2f825f4103de44ec3b6ba7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_4276fe62b3f06d3c3d3abbe1054\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`request\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`content\` varchar(1000) NOT NULL, \`check_in\` timestamp NULL, \`check_out\` timestamp NULL, \`attendance_id\` bigint UNSIGNED NOT NULL, \`image_url\` varchar(255) NULL, \`deleted_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`request_admin\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`status\` tinyint UNSIGNED NOT NULL DEFAULT '0', \`request_id\` bigint UNSIGNED NOT NULL, \`admin_id\` bigint UNSIGNED NOT NULL, \`deleted_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_5c6904300753ccfd06ea80acf3\` (\`request_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendance\` DROP COLUMN \`checkIn\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendance\` DROP COLUMN \`checkOut\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendance\` DROP COLUMN \`lateTime\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendance\` DROP COLUMN \`workHours\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_notification\` DROP COLUMN \`user_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP COLUMN \`admin_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendance\` ADD \`check_in\` timestamp NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendance\` ADD \`check_out\` timestamp NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendance\` ADD \`work_hours\` float NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendance\` ADD \`late_time\` float NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_notification\` ADD \`receiver_id\` bigint UNSIGNED NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_notification\` ADD \`is_read\` tinyint UNSIGNED NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD \`status\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD \`sender_id\` bigint UNSIGNED NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD \`schedule_time\` datetime NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`email_otp\` CHANGE \`otp_category\` \`otp_category\` tinyint NOT NULL COMMENT '1: verify otp, 2: reset password otp'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP COLUMN \`content\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD \`content\` varchar(1000) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`request\` ADD CONSTRAINT \`FK_132251cae1dbf605da82830f5f9\` FOREIGN KEY (\`attendance_id\`) REFERENCES \`attendance\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_notification\` ADD CONSTRAINT \`FK_61c95c494f10013151aa9c5e349\` FOREIGN KEY (\`receiver_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`user_notification\` DROP FOREIGN KEY \`FK_61c95c494f10013151aa9c5e349\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`request\` DROP FOREIGN KEY \`FK_132251cae1dbf605da82830f5f9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP COLUMN \`content\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD \`content\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`email_otp\` CHANGE \`otp_category\` \`otp_category\` tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP COLUMN \`schedule_time\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP COLUMN \`sender_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP COLUMN \`status\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_notification\` DROP COLUMN \`is_read\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_notification\` DROP COLUMN \`receiver_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendance\` DROP COLUMN \`late_time\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendance\` DROP COLUMN \`work_hours\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendance\` DROP COLUMN \`check_out\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendance\` DROP COLUMN \`check_in\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD \`admin_id\` bigint UNSIGNED NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_notification\` ADD \`user_id\` bigint UNSIGNED NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendance\` ADD \`workHours\` float NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendance\` ADD \`lateTime\` float NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendance\` ADD \`checkOut\` timestamp NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendance\` ADD \`checkIn\` timestamp NULL`,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_5c6904300753ccfd06ea80acf3\` ON \`request_admin\``,
    );
    await queryRunner.query(`DROP TABLE \`request_admin\``);
    await queryRunner.query(`DROP TABLE \`request\``);
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_4276fe62b3f06d3c3d3abbe1054\` FOREIGN KEY (\`admin_id\`) REFERENCES \`admin\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_notification\` ADD CONSTRAINT \`FK_ed67d2f825f4103de44ec3b6ba7\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

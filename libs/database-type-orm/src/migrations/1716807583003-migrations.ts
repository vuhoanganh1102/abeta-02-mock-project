import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1716807583003 implements MigrationInterface {
    name = 'Migrations1716807583003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`email_otp\` DROP FOREIGN KEY \`FK_ca8abd38e38111f43217d502863\``);
        await queryRunner.query(`ALTER TABLE \`email_otp\` ADD \`user_type\` tinyint NOT NULL COMMENT '0: user, 1: admin'`);
        await queryRunner.query(`ALTER TABLE \`config\` CHANGE \`type\` \`type\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`config\` CHANGE \`order\` \`order\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`config\` CHANGE \`is_system\` \`is_system\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`config\` CHANGE \`created_by\` \`created_by\` bigint UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`request\` CHANGE \`check_in\` \`check_in\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`request\` CHANGE \`check_out\` \`check_out\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`request\` CHANGE \`image_url\` \`image_url\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`request\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`attendance\` CHANGE \`check_in\` \`check_in\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`attendance\` CHANGE \`check_out\` \`check_out\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`attendance\` CHANGE \`work_hours\` \`work_hours\` float NULL`);
        await queryRunner.query(`ALTER TABLE \`attendance\` CHANGE \`late_time\` \`late_time\` float NULL`);
        await queryRunner.query(`ALTER TABLE \`attendance\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`first_name\` \`first_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`last_name\` \`last_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phone_number\` \`phone_number\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`date_of_birth\` \`date_of_birth\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`avatar\` \`avatar\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`reset_token\` \`reset_token\` varchar(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_notification\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`notification\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`request_admin\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`admin\` CHANGE \`refresh_token\` \`refresh_token\` varchar(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`admin\` CHANGE \`reset_token\` \`reset_token\` varchar(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`admin\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`company_config\` CHANGE \`morning_start_time\` \`morning_start_time\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`company_config\` CHANGE \`morning_end_time\` \`morning_end_time\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`company_config\` CHANGE \`afternoon_start_time\` \`afternoon_start_time\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`company_config\` CHANGE \`afternoon_end_time\` \`afternoon_end_time\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`email_otp\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`email_otp\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`company_config\` CHANGE \`afternoon_end_time\` \`afternoon_end_time\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`company_config\` CHANGE \`afternoon_start_time\` \`afternoon_start_time\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`company_config\` CHANGE \`morning_end_time\` \`morning_end_time\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`company_config\` CHANGE \`morning_start_time\` \`morning_start_time\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`admin\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`admin\` CHANGE \`reset_token\` \`reset_token\` varchar(500) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`admin\` CHANGE \`refresh_token\` \`refresh_token\` varchar(500) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`request_admin\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`notification\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_notification\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`reset_token\` \`reset_token\` varchar(500) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(500) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`avatar\` \`avatar\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`date_of_birth\` \`date_of_birth\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phone_number\` \`phone_number\` varchar(20) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`last_name\` \`last_name\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`first_name\` \`first_name\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`attendance\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`attendance\` CHANGE \`late_time\` \`late_time\` float NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`attendance\` CHANGE \`work_hours\` \`work_hours\` float NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`attendance\` CHANGE \`check_out\` \`check_out\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`attendance\` CHANGE \`check_in\` \`check_in\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`request\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`request\` CHANGE \`image_url\` \`image_url\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`request\` CHANGE \`check_out\` \`check_out\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`request\` CHANGE \`check_in\` \`check_in\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`config\` CHANGE \`created_by\` \`created_by\` bigint UNSIGNED NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`config\` CHANGE \`is_system\` \`is_system\` tinyint NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`config\` CHANGE \`order\` \`order\` tinyint NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`config\` CHANGE \`type\` \`type\` varchar(50) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`email_otp\` DROP COLUMN \`user_type\``);
        await queryRunner.query(`ALTER TABLE \`email_otp\` ADD CONSTRAINT \`FK_ca8abd38e38111f43217d502863\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

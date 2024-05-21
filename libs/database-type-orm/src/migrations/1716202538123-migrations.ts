import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1716202538123 implements MigrationInterface {
    name = 'Migrations1716202538123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`email_otp\` ADD \`user_id\` bigint UNSIGNED NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`email_otp\` DROP COLUMN \`user_email\``);
        await queryRunner.query(`ALTER TABLE \`email_otp\` ADD \`user_email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`email_otp\` ADD CONSTRAINT \`FK_ca8abd38e38111f43217d502863\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_notification\` ADD CONSTRAINT \`FK_ed67d2f825f4103de44ec3b6ba7\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_notification\` ADD CONSTRAINT \`FK_db8be208a22e59619d1e38cc831\` FOREIGN KEY (\`notification_id\`) REFERENCES \`notification\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_4276fe62b3f06d3c3d3abbe1054\` FOREIGN KEY (\`admin_id\`) REFERENCES \`admin\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_4276fe62b3f06d3c3d3abbe1054\``);
        await queryRunner.query(`ALTER TABLE \`user_notification\` DROP FOREIGN KEY \`FK_db8be208a22e59619d1e38cc831\``);
        await queryRunner.query(`ALTER TABLE \`user_notification\` DROP FOREIGN KEY \`FK_ed67d2f825f4103de44ec3b6ba7\``);
        await queryRunner.query(`ALTER TABLE \`email_otp\` DROP FOREIGN KEY \`FK_ca8abd38e38111f43217d502863\``);
        await queryRunner.query(`ALTER TABLE \`email_otp\` DROP COLUMN \`user_email\``);
        await queryRunner.query(`ALTER TABLE \`email_otp\` ADD \`user_email\` bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`email_otp\` DROP COLUMN \`user_id\``);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";
import { hash } from 'bcrypt';

export class Migrations1716275708096 implements MigrationInterface {
    name = 'Migrations1716275708096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`config\` (\`key\` varchar(200) NOT NULL, \`name\` varchar(255) NOT NULL, \`value\` text NOT NULL, \`type\` varchar(50) NULL, \`order\` tinyint NULL, \`is_system\` tinyint NULL, \`created_by\` bigint UNSIGNED NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`key\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`attendance\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`user_id\` bigint UNSIGNED NOT NULL, \`date\` date NOT NULL, \`checkIn\` timestamp NULL, \`checkOut\` timestamp NULL, \`workHours\` float NULL, \`lateTime\` float NULL, \`deleted_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`email_otp\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`user_id\` bigint UNSIGNED NOT NULL, \`user_email\` varchar(255) NOT NULL, \`otp\` varchar(500) NOT NULL, \`otp_category\` tinyint NOT NULL, \`is_current\` tinyint NOT NULL DEFAULT '1', \`expired_at\` datetime NOT NULL, \`deleted_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`first_name\` varchar(255) NULL, \`last_name\` varchar(255) NULL, \`password\` varchar(255) NOT NULL, \`phone_number\` varchar(20) NULL, \`date_of_birth\` varchar(255) NULL, \`avatar\` varchar(255) NOT NULL, \`refresh_token\` varchar(500) NULL, \`reset_token\` varchar(500) NULL, \`is_verify\` tinyint NOT NULL DEFAULT '0', \`deleted_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`IDX_01eea41349b6c9275aec646eee\` (\`phone_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_notification\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`user_id\` bigint UNSIGNED NOT NULL, \`notification_id\` bigint UNSIGNED NOT NULL, \`deleted_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`admin_id\` bigint UNSIGNED NOT NULL, \`deleted_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`admin\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`refresh_token\` varchar(500) NULL, \`reset_token\` varchar(500) NULL, \`deleted_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_de87485f6489f5d0995f584195\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await this.createSuperAdmin(queryRunner)
        await queryRunner.query(`CREATE TABLE \`company_config\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`morning_start_time\` timestamp NOT NULL, \`morning_end_time\` timestamp NOT NULL, \`afternoon_start_time\` timestamp NOT NULL, \`afternoon_end_time\` timestamp NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`attendance\` ADD CONSTRAINT \`FK_0bedbcc8d5f9b9ec4979f519597\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
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
        await queryRunner.query(`ALTER TABLE \`attendance\` DROP FOREIGN KEY \`FK_0bedbcc8d5f9b9ec4979f519597\``);
        await queryRunner.query(`DROP TABLE \`company_config\``);
        await queryRunner.query(`DROP INDEX \`IDX_de87485f6489f5d0995f584195\` ON \`admin\``);
        await queryRunner.query(`DROP TABLE \`admin\``);
        await queryRunner.query(`DROP TABLE \`notification\``);
        await queryRunner.query(`DROP TABLE \`user_notification\``);
        await queryRunner.query(`DROP INDEX \`IDX_01eea41349b6c9275aec646eee\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`email_otp\``);
        await queryRunner.query(`DROP TABLE \`attendance\``);
        await queryRunner.query(`DROP TABLE \`config\``);
    }

    private async createSuperAdmin(queryRunner: QueryRunner) {
        const hashedPassword = await hash(
            String(process.env.SUPER_ADMIN_PASSWORD),
            Number(process.env.BCRYPT_HASH_ROUNDS),
        );

        const isExist = await queryRunner.query(
            `SELECT COUNT(1) as total FROM \`${process.env.MYSQL_DB}\`.\`admin\` WHERE \`email\`=? LIMIT 1`,
            [process.env.SUPER_ADMIN_EMAIL],
        );

        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let resetToken = '';
        const length = 100;

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            resetToken += characters.charAt(randomIndex);
        }

        if (!Number(isExist[0].total)) {
            await queryRunner.query(`INSERT INTO
          \`${process.env.MYSQL_DB}\`.\`admin\` (\`email\`, \`password\`, \`reset_token\`)
          VALUES (?, ?, ?)`,
                [process.env.SUPER_ADMIN_EMAIL, hashedPassword, resetToken]
            );
        }
    }
}

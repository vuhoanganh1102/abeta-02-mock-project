import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
export class Migrations1716198657027 implements MigrationInterface {
  name = 'Migrations1716198657027';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const email = 'anhvh1102@gmail.com';
    const password = '12345';
    const hashedPassword = await bcrypt.hashSync(
      password,
      bcrypt.genSaltSync(),
    );
    await queryRunner.query(
      `CREATE TABLE \`config\` (\`key\` varchar(200) NOT NULL, \`name\` varchar(255) NOT NULL, \`value\` text NOT NULL, \`type\` varchar(50) NULL, \`order\` tinyint NULL, \`is_system\` tinyint NULL, \`created_by\` bigint UNSIGNED NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`key\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`admin\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`refresh_token\` varchar(255) NULL, \`reset_token\` varchar(255) NULL, \`deleted_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_de87485f6489f5d0995f584195\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`first_name\` varchar(255) NULL, \`last_name\` varchar(255) NULL, \`password\` varchar(255) NOT NULL, \`phone_number\` varchar(20) NULL, \`date_of_birth\` varchar(255) NULL, \`avatar\` varchar(255) NOT NULL, \`refresh_token\` varchar(255) NULL, \`reset_token\` varchar(255) NULL, \`is_verify\` tinyint NOT NULL DEFAULT '0', \`deleted_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`IDX_01eea41349b6c9275aec646eee\` (\`phone_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `INSERT INTO \`admin\` (id,email, password, reset_token) VALUES (?, ? ,?,?)`,
      [1, email, hashedPassword, 'ahtyu81230a'],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_01eea41349b6c9275aec646eee\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_de87485f6489f5d0995f584195\` ON \`admin\``,
    );
    await queryRunner.query(`DROP TABLE \`admin\``);
    await queryRunner.query(`DROP TABLE \`config\``);
    await queryRunner.query(
      `DELETE FROM \`admin\` WHERE email = 'anhvh1102@gmail.com'`,
    );
  }
}

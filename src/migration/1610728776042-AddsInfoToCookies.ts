import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddsInfoToCookies1610728776042 implements MigrationInterface {
  name = 'AddsInfoToCookies1610728776042';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cookie" ADD "description" text`);
    await queryRunner.query(
      `ALTER TABLE "cookie" ADD "countryCodeIso" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cookie" ADD "retentionPeriod" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cookie" ADD "termsLink" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cookie" DROP COLUMN "termsLink"`);
    await queryRunner.query(
      `ALTER TABLE "cookie" DROP COLUMN "retentionPeriod"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cookie" DROP COLUMN "countryCodeIso"`,
    );
    await queryRunner.query(`ALTER TABLE "cookie" DROP COLUMN "description"`);
  }
}

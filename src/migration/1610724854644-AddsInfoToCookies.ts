import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddsInfoToCookies1610724854644 implements MigrationInterface {
  name = 'AddsInfoToCookies1610724854644';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cookie" ADD "description" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cookie" ADD "countryCodeIso" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cookie" ADD "retentionPeriod" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cookie" ADD "termsLink" character varying NOT NULL`,
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

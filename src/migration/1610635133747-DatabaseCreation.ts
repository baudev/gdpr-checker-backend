import { MigrationInterface, QueryRunner } from 'typeorm';

export class DatabaseCreation1610635133747 implements MigrationInterface {
  name = 'DatabaseCreation1610635133747';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cookie" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "provider" character varying, "type" character varying, "domain" character varying NOT NULL, "IP" character varying, "hasAdequateLevelOfProtection" boolean, "country" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9596e1f3069016c935ad0a3000e" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "url" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, "isHttps" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "reportUuid" uuid, CONSTRAINT "PK_ba7e23d4d2393f9e7d81443ba8f" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "report" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "domain" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "UQ_edf1123f3528e0a77ee545df114" UNIQUE ("domain"), CONSTRAINT "PK_6d75f0b67c2116a6f2009308498" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "url_cookies_cookie" ("urlUuid" uuid NOT NULL, "cookieUuid" uuid NOT NULL, CONSTRAINT "PK_d888cb415dde94e157f369fc2a9" PRIMARY KEY ("urlUuid", "cookieUuid"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_024e57fdd44b19e2e0afa517dd" ON "url_cookies_cookie" ("urlUuid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0b40eefee3db42f48d358c3ebf" ON "url_cookies_cookie" ("cookieUuid") `,
    );
    await queryRunner.query(
      `ALTER TABLE "url" ADD CONSTRAINT "FK_94f440155c195586c8b42d6e9f9" FOREIGN KEY ("reportUuid") REFERENCES "report"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "url_cookies_cookie" ADD CONSTRAINT "FK_024e57fdd44b19e2e0afa517ddc" FOREIGN KEY ("urlUuid") REFERENCES "url"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "url_cookies_cookie" ADD CONSTRAINT "FK_0b40eefee3db42f48d358c3ebf9" FOREIGN KEY ("cookieUuid") REFERENCES "cookie"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "url_cookies_cookie" DROP CONSTRAINT "FK_0b40eefee3db42f48d358c3ebf9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "url_cookies_cookie" DROP CONSTRAINT "FK_024e57fdd44b19e2e0afa517ddc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "url" DROP CONSTRAINT "FK_94f440155c195586c8b42d6e9f9"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_0b40eefee3db42f48d358c3ebf"`);
    await queryRunner.query(`DROP INDEX "IDX_024e57fdd44b19e2e0afa517dd"`);
    await queryRunner.query(`DROP TABLE "url_cookies_cookie"`);
    await queryRunner.query(`DROP TABLE "report"`);
    await queryRunner.query(`DROP TABLE "url"`);
    await queryRunner.query(`DROP TABLE "cookie"`);
  }
}

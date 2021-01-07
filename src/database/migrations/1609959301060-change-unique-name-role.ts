import { MigrationInterface, QueryRunner } from 'typeorm'

export class changeUniqueNameRole1609959301060 implements MigrationInterface {
  name = 'changeUniqueNameRole1609959301060'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "roles"."name" IS NULL`)
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7"`
    )
    await queryRunner.query(`COMMENT ON COLUMN "roles"."name" IS NULL`)
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1234567890123 implements MigrationInterface {
  name = 'InitialMigration1234567890123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "login" character varying NOT NULL,
                "password" character varying NOT NULL,
                "version" integer NOT NULL DEFAULT 1,
                "createdAt" bigint NOT NULL DEFAULT extract(epoch from now()) * 1000,
                "updatedAt" bigint NOT NULL DEFAULT extract(epoch from now()) * 1000,
                CONSTRAINT "UQ_users_login" UNIQUE ("login"),
                CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "artists" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "grammy" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_artists_id" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "albums" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "year" integer NOT NULL,
                "artistId" uuid,
                CONSTRAINT "PK_albums_id" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "tracks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "artistId" uuid,
                "albumId" uuid,
                "duration" integer NOT NULL,
                CONSTRAINT "PK_tracks_id" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "favorites" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "entityId" uuid NOT NULL,
                "entityType" character varying(50) NOT NULL,
                CONSTRAINT "PK_favorites_id" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            ALTER TABLE "albums" 
            ADD CONSTRAINT "FK_albums_artistId" 
            FOREIGN KEY ("artistId") 
            REFERENCES "artists"("id") 
            ON DELETE SET NULL 
            ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "tracks" 
            ADD CONSTRAINT "FK_tracks_artistId" 
            FOREIGN KEY ("artistId") 
            REFERENCES "artists"("id") 
            ON DELETE SET NULL 
            ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "tracks" 
            ADD CONSTRAINT "FK_tracks_albumId" 
            FOREIGN KEY ("albumId") 
            REFERENCES "albums"("id") 
            ON DELETE SET NULL 
            ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tracks" DROP CONSTRAINT "FK_tracks_albumId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" DROP CONSTRAINT "FK_tracks_artistId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "albums" DROP CONSTRAINT "FK_albums_artistId"`,
    );
    await queryRunner.query(`DROP TABLE "favorites"`);
    await queryRunner.query(`DROP TABLE "tracks"`);
    await queryRunner.query(`DROP TABLE "albums"`);
    await queryRunner.query(`DROP TABLE "artists"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}

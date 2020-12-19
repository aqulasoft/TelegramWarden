import {MigrationInterface, QueryRunner} from "typeorm";

export class init1608405014083 implements MigrationInterface {
    name = 'init1608405014083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" character varying NOT NULL, "username" character varying, "firstname" character varying, "lastname" character varying, "lang" character varying, "isBot" boolean NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_chat" ("joinDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "userId" character varying NOT NULL, "chatId" character varying NOT NULL, CONSTRAINT "PK_50760d81e93441fd7358d3ccdde" PRIMARY KEY ("userId", "chatId"))`);
        await queryRunner.query(`CREATE TABLE "chat" ("id" character varying NOT NULL, "title" character varying, "username" character varying, "type" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_chat" ADD CONSTRAINT "FK_63f6e1b207375c35588c673843e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_chat" ADD CONSTRAINT "FK_e2f3a6eefb26aa957feee2c9dc3" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_chat" DROP CONSTRAINT "FK_e2f3a6eefb26aa957feee2c9dc3"`);
        await queryRunner.query(`ALTER TABLE "user_chat" DROP CONSTRAINT "FK_63f6e1b207375c35588c673843e"`);
        await queryRunner.query(`DROP TABLE "chat"`);
        await queryRunner.query(`DROP TABLE "user_chat"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}

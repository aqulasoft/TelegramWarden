import {MigrationInterface, QueryRunner} from "typeorm";

export class init1608750390645 implements MigrationInterface {
    name = 'init1608750390645'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" character varying NOT NULL, "username" character varying, "firstname" character varying, "lastname" character varying, "lang" character varying, "isBot" boolean NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_user" ("joinDate" TIMESTAMP NOT NULL, "leftDate" TIMESTAMP, "messageCount" integer NOT NULL, "violationCount" integer NOT NULL, "userId" character varying NOT NULL, "chatId" character varying NOT NULL, CONSTRAINT "PK_afbdf3817c9256d3ac030b0e917" PRIMARY KEY ("userId", "chatId"))`);
        await queryRunner.query(`CREATE TABLE "chat" ("id" character varying NOT NULL, "title" character varying, "username" character varying, "type" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chat_user" ADD CONSTRAINT "FK_5e9874ea3bd3524db95c2d88e53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_user" ADD CONSTRAINT "FK_8826d04b711b84e36398894275c" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_user" DROP CONSTRAINT "FK_8826d04b711b84e36398894275c"`);
        await queryRunner.query(`ALTER TABLE "chat_user" DROP CONSTRAINT "FK_5e9874ea3bd3524db95c2d88e53"`);
        await queryRunner.query(`DROP TABLE "chat"`);
        await queryRunner.query(`DROP TABLE "chat_user"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}

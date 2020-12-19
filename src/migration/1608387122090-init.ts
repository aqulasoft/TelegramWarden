import {MigrationInterface, QueryRunner} from "typeorm";

export class init1608387122090 implements MigrationInterface {
    name = 'init1608387122090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" character varying NOT NULL, "username" character varying, "firstname" character varying, "lastname" character varying, "lang" character varying, "isBot" boolean NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_group" ("joinDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "userId" character varying NOT NULL, "groupId" character varying NOT NULL, CONSTRAINT "PK_d9a1801971c4c66927d77560e73" PRIMARY KEY ("userId", "groupId"))`);
        await queryRunner.query(`CREATE TABLE "group" ("id" character varying NOT NULL, "title" character varying, "username" character varying, "type" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_group" ADD CONSTRAINT "FK_3d6b372788ab01be58853003c93" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_group" ADD CONSTRAINT "FK_31e541c93fdc0bb63cfde6549b7" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_group" DROP CONSTRAINT "FK_31e541c93fdc0bb63cfde6549b7"`);
        await queryRunner.query(`ALTER TABLE "user_group" DROP CONSTRAINT "FK_3d6b372788ab01be58853003c93"`);
        await queryRunner.query(`DROP TABLE "group"`);
        await queryRunner.query(`DROP TABLE "user_group"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}

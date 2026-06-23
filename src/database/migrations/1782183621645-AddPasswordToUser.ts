import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordToUser1782183621645 implements MigrationInterface {
    name = 'AddPasswordToUser1782183621645'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_refresh_tokens_user_id"`);
        await queryRunner.query(`ALTER TABLE "invites" DROP CONSTRAINT "FK_invites_used_by"`);
        await queryRunner.query(`ALTER TABLE "invites" DROP CONSTRAINT "FK_invites_created_by"`);
        await queryRunner.query(`ALTER TABLE "task_instances" DROP CONSTRAINT "FK_task_instances_assigned_to"`);
        await queryRunner.query(`ALTER TABLE "task_instances" DROP CONSTRAINT "FK_task_instances_template_id"`);
        await queryRunner.query(`ALTER TABLE "task_templates" DROP CONSTRAINT "FK_task_templates_assigned_to"`);
        await queryRunner.query(`ALTER TABLE "task_templates" DROP CONSTRAINT "FK_task_templates_category_id"`);
        await queryRunner.query(`ALTER TABLE "point_transactions" DROP CONSTRAINT "FK_point_transactions_user_id"`);
        await queryRunner.query(`ALTER TABLE "redemptions" DROP CONSTRAINT "FK_redemptions_reviewed_by"`);
        await queryRunner.query(`ALTER TABLE "redemptions" DROP CONSTRAINT "FK_redemptions_reward_id"`);
        await queryRunner.query(`ALTER TABLE "redemptions" DROP CONSTRAINT "FK_redemptions_user_id"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_notifications_user_id"`);
        await queryRunner.query(`ALTER TABLE "task_template_tags" DROP CONSTRAINT "FK_task_template_tags_tag_id"`);
        await queryRunner.query(`ALTER TABLE "task_template_tags" DROP CONSTRAINT "FK_task_template_tags_template_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "google_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT '{member}'`);
        await queryRunner.query(`CREATE INDEX "IDX_4b2f5ca45064c634f55bba8abf" ON "task_template_tags" ("template_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b4c1588085f7653ccf038446ef" ON "task_template_tags" ("tag_id") `);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invites" ADD CONSTRAINT "FK_547a8b9865f16d776c08c72eac0" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invites" ADD CONSTRAINT "FK_0ca8d76277aa4c68d4291d93634" FOREIGN KEY ("used_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_instances" ADD CONSTRAINT "FK_add913023c972c4191a6b850bee" FOREIGN KEY ("template_id") REFERENCES "task_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_instances" ADD CONSTRAINT "FK_312b0bf149c57e0e225d70015fd" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_templates" ADD CONSTRAINT "FK_7226c03e6604d7a9a0a77ca201a" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_templates" ADD CONSTRAINT "FK_f4bcbeca0c33e4f28b4949e87a0" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "point_transactions" ADD CONSTRAINT "FK_56702c8b9e89190347707b75552" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "redemptions" ADD CONSTRAINT "FK_c59b27ed1a764e578add290572c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "redemptions" ADD CONSTRAINT "FK_e845e4dbdf77458f29473e5e0cf" FOREIGN KEY ("reward_id") REFERENCES "rewards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "redemptions" ADD CONSTRAINT "FK_4e6c8f45c7efaeed9a17b769059" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_template_tags" ADD CONSTRAINT "FK_4b2f5ca45064c634f55bba8abf0" FOREIGN KEY ("template_id") REFERENCES "task_templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_template_tags" ADD CONSTRAINT "FK_b4c1588085f7653ccf038446ef1" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_template_tags" DROP CONSTRAINT "FK_b4c1588085f7653ccf038446ef1"`);
        await queryRunner.query(`ALTER TABLE "task_template_tags" DROP CONSTRAINT "FK_4b2f5ca45064c634f55bba8abf0"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`);
        await queryRunner.query(`ALTER TABLE "redemptions" DROP CONSTRAINT "FK_4e6c8f45c7efaeed9a17b769059"`);
        await queryRunner.query(`ALTER TABLE "redemptions" DROP CONSTRAINT "FK_e845e4dbdf77458f29473e5e0cf"`);
        await queryRunner.query(`ALTER TABLE "redemptions" DROP CONSTRAINT "FK_c59b27ed1a764e578add290572c"`);
        await queryRunner.query(`ALTER TABLE "point_transactions" DROP CONSTRAINT "FK_56702c8b9e89190347707b75552"`);
        await queryRunner.query(`ALTER TABLE "task_templates" DROP CONSTRAINT "FK_f4bcbeca0c33e4f28b4949e87a0"`);
        await queryRunner.query(`ALTER TABLE "task_templates" DROP CONSTRAINT "FK_7226c03e6604d7a9a0a77ca201a"`);
        await queryRunner.query(`ALTER TABLE "task_instances" DROP CONSTRAINT "FK_312b0bf149c57e0e225d70015fd"`);
        await queryRunner.query(`ALTER TABLE "task_instances" DROP CONSTRAINT "FK_add913023c972c4191a6b850bee"`);
        await queryRunner.query(`ALTER TABLE "invites" DROP CONSTRAINT "FK_0ca8d76277aa4c68d4291d93634"`);
        await queryRunner.query(`ALTER TABLE "invites" DROP CONSTRAINT "FK_547a8b9865f16d776c08c72eac0"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b4c1588085f7653ccf038446ef"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4b2f5ca45064c634f55bba8abf"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT ARRAY['member']::"users_roles_enum"[]`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "google_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "task_template_tags" ADD CONSTRAINT "FK_task_template_tags_template_id" FOREIGN KEY ("template_id") REFERENCES "task_templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_template_tags" ADD CONSTRAINT "FK_task_template_tags_tag_id" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_notifications_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "redemptions" ADD CONSTRAINT "FK_redemptions_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "redemptions" ADD CONSTRAINT "FK_redemptions_reward_id" FOREIGN KEY ("reward_id") REFERENCES "rewards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "redemptions" ADD CONSTRAINT "FK_redemptions_reviewed_by" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "point_transactions" ADD CONSTRAINT "FK_point_transactions_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_templates" ADD CONSTRAINT "FK_task_templates_category_id" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_templates" ADD CONSTRAINT "FK_task_templates_assigned_to" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_instances" ADD CONSTRAINT "FK_task_instances_template_id" FOREIGN KEY ("template_id") REFERENCES "task_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_instances" ADD CONSTRAINT "FK_task_instances_assigned_to" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invites" ADD CONSTRAINT "FK_invites_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invites" ADD CONSTRAINT "FK_invites_used_by" FOREIGN KEY ("used_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_refresh_tokens_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

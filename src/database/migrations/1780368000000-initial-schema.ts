import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1780368000000 implements MigrationInterface {
  name = 'InitialSchema1780368000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(
      `CREATE TYPE "users_roles_enum" AS ENUM ('member', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TYPE "users_level_enum" AS ENUM ('Bronze', 'Prata', 'Ouro', 'Diamante')`,
    );
    await queryRunner.query(
      `CREATE TYPE "task_templates_difficulty_enum" AS ENUM ('easy', 'medium', 'hard', 'epic')`,
    );
    await queryRunner.query(
      `CREATE TYPE "task_templates_recurrence_type_enum" AS ENUM ('none', 'daily', 'weekly', 'biweekly', 'monthly', 'custom')`,
    );
    await queryRunner.query(
      `CREATE TYPE "task_templates_deadline_type_enum" AS ENUM ('end_of_day', 'specific_time', 'specific_date')`,
    );
    await queryRunner.query(
      `CREATE TYPE "task_instances_status_enum" AS ENUM ('pending', 'in_progress', 'done', 'overdue', 'skipped')`,
    );
    await queryRunner.query(
      `CREATE TYPE "point_transactions_type_enum" AS ENUM ('task_completion', 'streak_bonus', 'penalty', 'redemption_debit', 'redemption_refund', 'manual_adjustment')`,
    );
    await queryRunner.query(
      `CREATE TYPE "redemptions_status_enum" AS ENUM ('pending', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TYPE "notifications_type_enum" AS ENUM ('redemption_approved', 'redemption_rejected', 'task_overdue', 'streak_milestone', 'level_up', 'general')`,
    );

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "google_id" character varying NOT NULL,
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "avatar_url" character varying,
        "roles" "users_roles_enum"[] NOT NULL DEFAULT ARRAY['member']::"users_roles_enum"[],
        "points_balance" integer NOT NULL DEFAULT '0',
        "current_streak" integer NOT NULL DEFAULT '0',
        "longest_streak" integer NOT NULL DEFAULT '0',
        "level" "users_level_enum" NOT NULL DEFAULT 'Bronze',
        "is_active" boolean NOT NULL DEFAULT true,
        CONSTRAINT "UQ_users_google_id" UNIQUE ("google_id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "user_id" uuid NOT NULL,
        "token_hash" character varying NOT NULL,
        "expires_at" TIMESTAMP NOT NULL,
        "revoked_at" TIMESTAMP,
        CONSTRAINT "PK_refresh_tokens" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "refresh_tokens"
      ADD CONSTRAINT "FK_refresh_tokens_user_id"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE TABLE "invites" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "token" uuid NOT NULL,
        "created_by" uuid NOT NULL,
        "used_by" uuid,
        "expires_at" TIMESTAMP NOT NULL,
        "used_at" TIMESTAMP,
        CONSTRAINT "UQ_invites_token" UNIQUE ("token"),
        CONSTRAINT "PK_invites" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "invites"
      ADD CONSTRAINT "FK_invites_created_by"
      FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "invites"
      ADD CONSTRAINT "FK_invites_used_by"
      FOREIGN KEY ("used_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "name" character varying NOT NULL,
        "icon" character varying NOT NULL,
        "color" character varying NOT NULL,
        CONSTRAINT "PK_categories" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "tags" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "name" character varying NOT NULL,
        "color" character varying NOT NULL,
        CONSTRAINT "UQ_tags_name" UNIQUE ("name"),
        CONSTRAINT "PK_tags" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "task_templates" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "title" character varying NOT NULL,
        "description" text,
        "cover_image_url" character varying,
        "category_id" uuid,
        "assigned_to" uuid NOT NULL,
        "difficulty" "task_templates_difficulty_enum" NOT NULL,
        "base_points" integer NOT NULL,
        "points_override" integer,
        "recurrence_type" "task_templates_recurrence_type_enum" NOT NULL DEFAULT 'none',
        "recurrence_config" jsonb,
        "deadline_type" "task_templates_deadline_type_enum" NOT NULL,
        "deadline_value" character varying,
        "penalty_points" integer NOT NULL DEFAULT '0',
        "is_paused" boolean NOT NULL DEFAULT false,
        "paused_until" TIMESTAMP,
        CONSTRAINT "PK_task_templates" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "task_templates"
      ADD CONSTRAINT "FK_task_templates_category_id"
      FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "task_templates"
      ADD CONSTRAINT "FK_task_templates_assigned_to"
      FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE TABLE "task_template_tags" (
        "template_id" uuid NOT NULL,
        "tag_id" uuid NOT NULL,
        CONSTRAINT "PK_task_template_tags" PRIMARY KEY ("template_id", "tag_id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "task_template_tags"
      ADD CONSTRAINT "FK_task_template_tags_template_id"
      FOREIGN KEY ("template_id") REFERENCES "task_templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "task_template_tags"
      ADD CONSTRAINT "FK_task_template_tags_tag_id"
      FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE TABLE "task_instances" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "template_id" uuid NOT NULL,
        "assigned_to" uuid NOT NULL,
        "scheduled_date" date NOT NULL,
        "deadline_at" TIMESTAMP NOT NULL,
        "status" "task_instances_status_enum" NOT NULL DEFAULT 'pending',
        "points_earned" integer,
        "points_penalty" integer,
        "completed_at" TIMESTAMP,
        "override_title" character varying,
        "override_description" text,
        "override_deadline_at" TIMESTAMP,
        "is_exception" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_task_instances" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "task_instances"
      ADD CONSTRAINT "FK_task_instances_template_id"
      FOREIGN KEY ("template_id") REFERENCES "task_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "task_instances"
      ADD CONSTRAINT "FK_task_instances_assigned_to"
      FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE TABLE "point_transactions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "user_id" uuid NOT NULL,
        "amount" integer NOT NULL,
        "type" "point_transactions_type_enum" NOT NULL,
        "reference_id" uuid,
        "description" character varying NOT NULL,
        CONSTRAINT "PK_point_transactions" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "point_transactions"
      ADD CONSTRAINT "FK_point_transactions_user_id"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE TABLE "rewards" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "title" character varying NOT NULL,
        "description" text,
        "cover_image_url" character varying,
        "points_cost" integer NOT NULL,
        "stock_limit" integer,
        "stock_used" integer NOT NULL DEFAULT '0',
        "cooldown_days" integer,
        "is_active" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_rewards" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "redemptions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "user_id" uuid NOT NULL,
        "reward_id" uuid NOT NULL,
        "points_cost" integer NOT NULL,
        "status" "redemptions_status_enum" NOT NULL DEFAULT 'pending',
        "reviewed_by" uuid,
        "reviewed_at" TIMESTAMP,
        "rejection_reason" character varying,
        CONSTRAINT "PK_redemptions" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "redemptions"
      ADD CONSTRAINT "FK_redemptions_user_id"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "redemptions"
      ADD CONSTRAINT "FK_redemptions_reward_id"
      FOREIGN KEY ("reward_id") REFERENCES "rewards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "redemptions"
      ADD CONSTRAINT "FK_redemptions_reviewed_by"
      FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "user_id" uuid NOT NULL,
        "type" "notifications_type_enum" NOT NULL,
        "title" character varying NOT NULL,
        "body" text NOT NULL,
        "reference_id" uuid,
        "is_read" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_notifications" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "notifications"
      ADD CONSTRAINT "FK_notifications_user_id"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_notifications_user_id"`,
    );
    await queryRunner.query(`DROP TABLE "notifications"`);

    await queryRunner.query(
      `ALTER TABLE "redemptions" DROP CONSTRAINT "FK_redemptions_reviewed_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "redemptions" DROP CONSTRAINT "FK_redemptions_reward_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "redemptions" DROP CONSTRAINT "FK_redemptions_user_id"`,
    );
    await queryRunner.query(`DROP TABLE "redemptions"`);

    await queryRunner.query(`DROP TABLE "rewards"`);

    await queryRunner.query(
      `ALTER TABLE "point_transactions" DROP CONSTRAINT "FK_point_transactions_user_id"`,
    );
    await queryRunner.query(`DROP TABLE "point_transactions"`);

    await queryRunner.query(
      `ALTER TABLE "task_instances" DROP CONSTRAINT "FK_task_instances_assigned_to"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_instances" DROP CONSTRAINT "FK_task_instances_template_id"`,
    );
    await queryRunner.query(`DROP TABLE "task_instances"`);

    await queryRunner.query(
      `ALTER TABLE "task_template_tags" DROP CONSTRAINT "FK_task_template_tags_tag_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_template_tags" DROP CONSTRAINT "FK_task_template_tags_template_id"`,
    );
    await queryRunner.query(`DROP TABLE "task_template_tags"`);

    await queryRunner.query(
      `ALTER TABLE "task_templates" DROP CONSTRAINT "FK_task_templates_assigned_to"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_templates" DROP CONSTRAINT "FK_task_templates_category_id"`,
    );
    await queryRunner.query(`DROP TABLE "task_templates"`);

    await queryRunner.query(`DROP TABLE "tags"`);
    await queryRunner.query(`DROP TABLE "categories"`);

    await queryRunner.query(
      `ALTER TABLE "invites" DROP CONSTRAINT "FK_invites_used_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invites" DROP CONSTRAINT "FK_invites_created_by"`,
    );
    await queryRunner.query(`DROP TABLE "invites"`);

    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_refresh_tokens_user_id"`,
    );
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);

    await queryRunner.query(`DROP TABLE "users"`);

    await queryRunner.query(`DROP TYPE "notifications_type_enum"`);
    await queryRunner.query(`DROP TYPE "redemptions_status_enum"`);
    await queryRunner.query(`DROP TYPE "point_transactions_type_enum"`);
    await queryRunner.query(`DROP TYPE "task_instances_status_enum"`);
    await queryRunner.query(`DROP TYPE "task_templates_deadline_type_enum"`);
    await queryRunner.query(`DROP TYPE "task_templates_recurrence_type_enum"`);
    await queryRunner.query(`DROP TYPE "task_templates_difficulty_enum"`);
    await queryRunner.query(`DROP TYPE "users_level_enum"`);
    await queryRunner.query(`DROP TYPE "users_roles_enum"`);
  }
}

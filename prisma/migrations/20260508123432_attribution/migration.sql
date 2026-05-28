-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('AGENCY_ADMIN', 'CLIENT_ADMIN', 'LOCATION_MANAGER', 'VIEWER');

-- CreateEnum
CREATE TYPE "IntegrationPlatform" AS ENUM ('GOOGLE_ADS', 'META_ADS', 'GA4', 'GMB', 'CRM');

-- CreateEnum
CREATE TYPE "MappingType" AS ENUM ('SOURCE', 'CAMPAIGN', 'LOCATION', 'PIPELINE_STAGE');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('RUNNING', 'SUCCESS', 'FAILED', 'PARTIAL');

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "is_data_initialized" BOOLEAN NOT NULL DEFAULT false,
    "initial_sync_days" INTEGER NOT NULL DEFAULT 30,
    "last_successful_sync_at" TIMESTAMP(3),
    "crm_last_sync_at" TIMESTAMP(3),
    "sync_failure_count" INTEGER NOT NULL DEFAULT 0,
    "is_sync_paused" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "crm_location_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "client_id" TEXT,
    "supabase_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_location_access" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_location_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integrations" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "platform" "IntegrationPlatform" NOT NULL,
    "credentials" JSONB NOT NULL,
    "token_expiry" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mappings" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "type" "MappingType" NOT NULL,
    "rule_key" TEXT NOT NULL,
    "rule_value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "google_ads_daily" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "campaign_name" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "cost" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "conversions" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "google_ads_daily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meta_ads_daily" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "campaign_name" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "spend" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "leads" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meta_ads_daily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ga4_organic_daily" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "channel" TEXT NOT NULL DEFAULT '',
    "landing_page" TEXT NOT NULL DEFAULT '',
    "sessions" INTEGER NOT NULL DEFAULT 0,
    "users" INTEGER NOT NULL DEFAULT 0,
    "page_views" INTEGER NOT NULL DEFAULT 0,
    "bounce_rate" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ga4_organic_daily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gmb_daily" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "searches" INTEGER NOT NULL DEFAULT 0,
    "calls" INTEGER NOT NULL DEFAULT 0,
    "direction_requests" INTEGER NOT NULL DEFAULT 0,
    "website_clicks" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gmb_daily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_opportunities" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "crm_opportunity_id" TEXT NOT NULL,
    "pipeline_id" TEXT,
    "pipeline_stage_id" TEXT,
    "pipeline_stage_name" TEXT,
    "status" TEXT,
    "monetary_value" DECIMAL(14,2),
    "contact_id" TEXT,
    "source" TEXT,
    "medium" TEXT,
    "campaign" TEXT,
    "appointment_status" TEXT,
    "crm_created_at" TIMESTAMP(3) NOT NULL,
    "crm_updated_at" TIMESTAMP(3) NOT NULL,
    "synced_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_runs" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "status" "SyncStatus" NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),
    "date_from" DATE,
    "date_to" DATE,
    "error" TEXT,

    CONSTRAINT "sync_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_step_runs" (
    "id" TEXT NOT NULL,
    "sync_run_id" TEXT NOT NULL,
    "step_name" TEXT NOT NULL,
    "status" "SyncStatus" NOT NULL,
    "rows_processed" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "sync_step_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "normalisation_audit" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "table_name" TEXT NOT NULL,
    "original" TEXT NOT NULL,
    "normalised" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "normalisation_audit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_slug_key" ON "clients"("slug");

-- CreateIndex
CREATE INDEX "locations_client_id_idx" ON "locations"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "locations_client_id_slug_key" ON "locations"("client_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_supabase_id_key" ON "users"("supabase_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_client_id_idx" ON "users"("client_id");

-- CreateIndex
CREATE INDEX "user_location_access_user_id_idx" ON "user_location_access"("user_id");

-- CreateIndex
CREATE INDEX "user_location_access_client_id_idx" ON "user_location_access"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_location_access_user_id_location_id_key" ON "user_location_access"("user_id", "location_id");

-- CreateIndex
CREATE INDEX "integrations_client_id_idx" ON "integrations"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "integrations_client_id_platform_key" ON "integrations"("client_id", "platform");

-- CreateIndex
CREATE INDEX "mappings_client_id_type_idx" ON "mappings"("client_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "mappings_client_id_type_rule_key_key" ON "mappings"("client_id", "type", "rule_key");

-- CreateIndex
CREATE INDEX "google_ads_daily_client_id_date_idx" ON "google_ads_daily"("client_id", "date");

-- CreateIndex
CREATE INDEX "google_ads_daily_client_id_location_id_date_idx" ON "google_ads_daily"("client_id", "location_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "google_ads_daily_client_id_location_id_campaign_id_date_key" ON "google_ads_daily"("client_id", "location_id", "campaign_id", "date");

-- CreateIndex
CREATE INDEX "meta_ads_daily_client_id_date_idx" ON "meta_ads_daily"("client_id", "date");

-- CreateIndex
CREATE INDEX "meta_ads_daily_client_id_location_id_date_idx" ON "meta_ads_daily"("client_id", "location_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "meta_ads_daily_client_id_location_id_campaign_id_date_key" ON "meta_ads_daily"("client_id", "location_id", "campaign_id", "date");

-- CreateIndex
CREATE INDEX "ga4_organic_daily_client_id_date_idx" ON "ga4_organic_daily"("client_id", "date");

-- CreateIndex
CREATE INDEX "ga4_organic_daily_client_id_location_id_date_idx" ON "ga4_organic_daily"("client_id", "location_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ga4_organic_daily_client_id_location_id_date_channel_landin_key" ON "ga4_organic_daily"("client_id", "location_id", "date", "channel", "landing_page");

-- CreateIndex
CREATE INDEX "gmb_daily_client_id_date_idx" ON "gmb_daily"("client_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "gmb_daily_client_id_location_id_date_key" ON "gmb_daily"("client_id", "location_id", "date");

-- CreateIndex
CREATE INDEX "crm_opportunities_client_id_crm_created_at_idx" ON "crm_opportunities"("client_id", "crm_created_at");

-- CreateIndex
CREATE INDEX "crm_opportunities_client_id_location_id_crm_created_at_idx" ON "crm_opportunities"("client_id", "location_id", "crm_created_at");

-- CreateIndex
CREATE UNIQUE INDEX "crm_opportunities_client_id_crm_opportunity_id_key" ON "crm_opportunities"("client_id", "crm_opportunity_id");

-- CreateIndex
CREATE INDEX "sync_runs_client_id_started_at_idx" ON "sync_runs"("client_id", "started_at");

-- CreateIndex
CREATE INDEX "sync_step_runs_sync_run_id_idx" ON "sync_step_runs"("sync_run_id");

-- CreateIndex
CREATE INDEX "normalisation_audit_client_id_table_name_idx" ON "normalisation_audit"("client_id", "table_name");

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_location_access" ADD CONSTRAINT "user_location_access_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_location_access" ADD CONSTRAINT "user_location_access_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_location_access" ADD CONSTRAINT "user_location_access_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mappings" ADD CONSTRAINT "mappings_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "google_ads_daily" ADD CONSTRAINT "google_ads_daily_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "google_ads_daily" ADD CONSTRAINT "google_ads_daily_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meta_ads_daily" ADD CONSTRAINT "meta_ads_daily_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meta_ads_daily" ADD CONSTRAINT "meta_ads_daily_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ga4_organic_daily" ADD CONSTRAINT "ga4_organic_daily_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ga4_organic_daily" ADD CONSTRAINT "ga4_organic_daily_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gmb_daily" ADD CONSTRAINT "gmb_daily_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gmb_daily" ADD CONSTRAINT "gmb_daily_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_opportunities" ADD CONSTRAINT "crm_opportunities_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_opportunities" ADD CONSTRAINT "crm_opportunities_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_runs" ADD CONSTRAINT "sync_runs_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_step_runs" ADD CONSTRAINT "sync_step_runs_sync_run_id_fkey" FOREIGN KEY ("sync_run_id") REFERENCES "sync_runs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "normalisation_audit" ADD CONSTRAINT "normalisation_audit_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

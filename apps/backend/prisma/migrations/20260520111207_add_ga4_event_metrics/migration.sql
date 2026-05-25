/*
  Warnings:

  - You are about to drop the column `location_id` on the `crm_opportunities` table. All the data in the column will be lost.
  - You are about to drop the column `location_id` on the `ga4_organic_daily` table. All the data in the column will be lost.
  - You are about to drop the column `location_id` on the `gmb_daily` table. All the data in the column will be lost.
  - You are about to drop the column `location_id` on the `google_ads_daily` table. All the data in the column will be lost.
  - You are about to drop the column `location_id` on the `meta_ads_daily` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[client_id,date,channel,landing_page]` on the table `ga4_organic_daily` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[client_id,date]` on the table `gmb_daily` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[client_id,campaign_id,date]` on the table `google_ads_daily` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[client_id,campaign_id,date]` on the table `meta_ads_daily` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "crm_opportunities" DROP CONSTRAINT "crm_opportunities_location_id_fkey";

-- DropForeignKey
ALTER TABLE "ga4_organic_daily" DROP CONSTRAINT "ga4_organic_daily_location_id_fkey";

-- DropForeignKey
ALTER TABLE "gmb_daily" DROP CONSTRAINT "gmb_daily_location_id_fkey";

-- DropForeignKey
ALTER TABLE "google_ads_daily" DROP CONSTRAINT "google_ads_daily_location_id_fkey";

-- DropForeignKey
ALTER TABLE "meta_ads_daily" DROP CONSTRAINT "meta_ads_daily_location_id_fkey";

-- DropIndex
DROP INDEX "crm_opportunities_client_id_location_id_crm_created_at_idx";

-- DropIndex
DROP INDEX "ga4_organic_daily_client_id_location_id_date_channel_landin_key";

-- DropIndex
DROP INDEX "ga4_organic_daily_client_id_location_id_date_idx";

-- DropIndex
DROP INDEX "gmb_daily_client_id_location_id_date_key";

-- DropIndex
DROP INDEX "google_ads_daily_client_id_location_id_campaign_id_date_key";

-- DropIndex
DROP INDEX "google_ads_daily_client_id_location_id_date_idx";

-- DropIndex
DROP INDEX "meta_ads_daily_client_id_location_id_campaign_id_date_key";

-- DropIndex
DROP INDEX "meta_ads_daily_client_id_location_id_date_idx";

-- AlterTable
ALTER TABLE "crm_opportunities" DROP COLUMN "location_id";

-- AlterTable
ALTER TABLE "ga4_organic_daily" DROP COLUMN "location_id";

-- AlterTable
ALTER TABLE "gmb_daily" DROP COLUMN "location_id";

-- AlterTable
ALTER TABLE "google_ads_daily" DROP COLUMN "location_id";

-- AlterTable
ALTER TABLE "meta_ads_daily" DROP COLUMN "location_id";

-- CreateTable
CREATE TABLE "google_agency_auth" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'google',
    "account_email" TEXT NOT NULL,
    "refresh_token_encrypted" TEXT NOT NULL,
    "scopes" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "last_error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "google_agency_auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ga4_daily_overview" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "sessions" INTEGER NOT NULL DEFAULT 0,
    "active_users" INTEGER NOT NULL DEFAULT 0,
    "new_users" INTEGER NOT NULL DEFAULT 0,
    "engaged_sessions" INTEGER NOT NULL DEFAULT 0,
    "engagement_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "event_count" INTEGER NOT NULL DEFAULT 0,
    "key_events" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ga4_daily_overview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ga4_channel_metrics" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "channel_group" TEXT NOT NULL DEFAULT '',
    "source" TEXT NOT NULL DEFAULT '',
    "medium" TEXT NOT NULL DEFAULT '',
    "campaign" TEXT NOT NULL DEFAULT '',
    "sessions" INTEGER NOT NULL DEFAULT 0,
    "active_users" INTEGER NOT NULL DEFAULT 0,
    "new_users" INTEGER NOT NULL DEFAULT 0,
    "engaged_sessions" INTEGER NOT NULL DEFAULT 0,
    "engagement_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "event_count" INTEGER NOT NULL DEFAULT 0,
    "key_events" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ga4_channel_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ga4_landing_page_metrics" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "landing_page" TEXT NOT NULL DEFAULT '',
    "sessions" INTEGER NOT NULL DEFAULT 0,
    "active_users" INTEGER NOT NULL DEFAULT 0,
    "engaged_sessions" INTEGER NOT NULL DEFAULT 0,
    "engagement_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "event_count" INTEGER NOT NULL DEFAULT 0,
    "key_events" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ga4_landing_page_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ga4_event_metrics" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "event_name" TEXT NOT NULL DEFAULT 'not_set',
    "event_count" INTEGER NOT NULL DEFAULT 0,
    "active_users" INTEGER NOT NULL DEFAULT 0,
    "key_events" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ga4_event_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ga4_daily_overview_client_id_date_idx" ON "ga4_daily_overview"("client_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ga4_daily_overview_client_id_property_id_date_key" ON "ga4_daily_overview"("client_id", "property_id", "date");

-- CreateIndex
CREATE INDEX "ga4_channel_metrics_client_id_date_idx" ON "ga4_channel_metrics"("client_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ga4_channel_metrics_client_id_property_id_date_channel_grou_key" ON "ga4_channel_metrics"("client_id", "property_id", "date", "channel_group", "source", "medium", "campaign");

-- CreateIndex
CREATE INDEX "ga4_landing_page_metrics_client_id_date_idx" ON "ga4_landing_page_metrics"("client_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ga4_landing_page_metrics_client_id_property_id_date_landing_key" ON "ga4_landing_page_metrics"("client_id", "property_id", "date", "landing_page");

-- CreateIndex
CREATE INDEX "ga4_event_metrics_client_id_date_idx" ON "ga4_event_metrics"("client_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ga4_event_metrics_client_id_property_id_date_event_name_key" ON "ga4_event_metrics"("client_id", "property_id", "date", "event_name");

-- CreateIndex
CREATE UNIQUE INDEX "ga4_organic_daily_client_id_date_channel_landing_page_key" ON "ga4_organic_daily"("client_id", "date", "channel", "landing_page");

-- CreateIndex
CREATE UNIQUE INDEX "gmb_daily_client_id_date_key" ON "gmb_daily"("client_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "google_ads_daily_client_id_campaign_id_date_key" ON "google_ads_daily"("client_id", "campaign_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "meta_ads_daily_client_id_campaign_id_date_key" ON "meta_ads_daily"("client_id", "campaign_id", "date");

-- AddForeignKey
ALTER TABLE "ga4_daily_overview" ADD CONSTRAINT "ga4_daily_overview_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ga4_channel_metrics" ADD CONSTRAINT "ga4_channel_metrics_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ga4_landing_page_metrics" ADD CONSTRAINT "ga4_landing_page_metrics_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ga4_event_metrics" ADD CONSTRAINT "ga4_event_metrics_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

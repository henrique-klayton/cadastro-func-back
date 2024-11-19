/*
  Warnings:

  - The values [SCHEDULE_5x1] on the enum `ScheduleType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ScheduleType_new" AS ENUM ('SCHEDULE_6x1', 'SCHEDULE_5x2', 'SCHEDULE_12x36');
ALTER TABLE "Schedule" ALTER COLUMN "type" TYPE "ScheduleType_new" USING ("type"::text::"ScheduleType_new");
ALTER TYPE "ScheduleType" RENAME TO "ScheduleType_old";
ALTER TYPE "ScheduleType_new" RENAME TO "ScheduleType";
DROP TYPE "ScheduleType_old";
COMMIT;

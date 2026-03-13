/*
  Warnings:

  - You are about to drop the column `status` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "user_status_idx";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "status";

-- DropEnum
DROP TYPE "ProfileVisibility";

-- DropEnum
DROP TYPE "UserStatus";

/*
  Warnings:

  - You are about to drop the `password_reset` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('EMAIL', 'PASSWORD_RESET');

-- AlterTable
ALTER TABLE "verification" ADD COLUMN     "type" "VerificationType" NOT NULL DEFAULT 'EMAIL';

-- DropTable
DROP TABLE "password_reset";

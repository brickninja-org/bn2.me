/*
  Warnings:

  - You are about to drop the column `callbackUrls` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `clientSecret` on the `Application` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Application_clientId_key";

-- DropIndex
DROP INDEX "Application_clientSecret_key";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "callbackUrls",
DROP COLUMN "clientId",
DROP COLUMN "clientSecret";

/*
  Warnings:

  - You are about to drop the column `type` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `applicationId` on the `Authorization` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[type,clientId,userId]` on the table `Authorization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientId` to the `Authorization` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('Confidential', 'Public');

-- DropForeignKey
ALTER TABLE "Authorization" DROP CONSTRAINT "Authorization_applicationId_fkey";

-- DropIndex
DROP INDEX "Authorization_type_applicationId_userId_key";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Authorization" DROP COLUMN "applicationId",
ADD COLUMN     "clientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "_accountAuthorization" ADD CONSTRAINT "_accountAuthorization_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_accountAuthorization_AB_unique";

-- DropEnum
DROP TYPE "ApplicationType";

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "type" "ClientType" NOT NULL,
    "callbackUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "applicationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientSecret" (
    "id" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "ClientSecret_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientSecret_secret_key" ON "ClientSecret"("secret");

-- CreateIndex
CREATE UNIQUE INDEX "Authorization_type_clientId_userId_key" ON "Authorization"("type", "clientId", "userId");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientSecret" ADD CONSTRAINT "ClientSecret_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authorization" ADD CONSTRAINT "Authorization_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

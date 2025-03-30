/*
  Warnings:

  - You are about to drop the column `emailId` on the `Authorization` table. All the data in the column will be lost.
  - You are about to drop the `_accountAuthorization` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[applicationId,name]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `applicationId` to the `Authorization` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuthorizationRequestType" AS ENUM ('OAuth2', 'OAuth2_PAR', 'FedCM');

-- CreateEnum
CREATE TYPE "AuthorizationRequestState" AS ENUM ('Pushed', 'Pending', 'Cancelled', 'Authorized');

-- DropForeignKey
ALTER TABLE "Authorization" DROP CONSTRAINT "Authorization_emailId_fkey";

-- DropForeignKey
ALTER TABLE "_accountAuthorization" DROP CONSTRAINT "_accountAuthorization_A_fkey";

-- DropForeignKey
ALTER TABLE "_accountAuthorization" DROP CONSTRAINT "_accountAuthorization_B_fkey";

-- AlterTable
ALTER TABLE "Authorization" DROP COLUMN "emailId",
ADD COLUMN     "applicationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Default Client';

-- DropTable
DROP TABLE "_accountAuthorization";

-- CreateTable
CREATE TABLE "ApplicationGrant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "scope" TEXT[],
    "emailId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationGrant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationUserSettings" (
    "applicationGrantId" TEXT NOT NULL,
    "settings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationUserSettings_pkey" PRIMARY KEY ("applicationGrantId")
);

-- CreateTable
CREATE TABLE "AuthorizationRequest" (
    "id" TEXT NOT NULL,
    "type" "AuthorizationRequestType" NOT NULL,
    "state" "AuthorizationRequestState" NOT NULL DEFAULT 'Pending',
    "data" JSONB NOT NULL,
    "clientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthorizationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_applicationGrant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_applicationGrant_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationGrant_userId_applicationId_key" ON "ApplicationGrant"("userId", "applicationId");

-- CreateIndex
CREATE INDEX "_applicationGrant_B_index" ON "_applicationGrant"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Client_applicationId_name_key" ON "Client"("applicationId", "name");

-- AddForeignKey
ALTER TABLE "ApplicationGrant" ADD CONSTRAINT "ApplicationGrant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationGrant" ADD CONSTRAINT "ApplicationGrant_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationGrant" ADD CONSTRAINT "ApplicationGrant_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "UserEmail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationUserSettings" ADD CONSTRAINT "ApplicationUserSettings_applicationGrantId_fkey" FOREIGN KEY ("applicationGrantId") REFERENCES "ApplicationGrant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authorization" ADD CONSTRAINT "Authorization_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authorization" ADD CONSTRAINT "Authorization_applicationId_userId_fkey" FOREIGN KEY ("applicationId", "userId") REFERENCES "ApplicationGrant"("applicationId", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorizationRequest" ADD CONSTRAINT "AuthorizationRequest_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorizationRequest" ADD CONSTRAINT "AuthorizationRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_applicationGrant" ADD CONSTRAINT "_applicationGrant_A_fkey" FOREIGN KEY ("A") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_applicationGrant" ADD CONSTRAINT "_applicationGrant_B_fkey" FOREIGN KEY ("B") REFERENCES "ApplicationGrant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterEnum
ALTER TYPE "AuthorizationRequestState" ADD VALUE 'Pushed';

-- AlterEnum
ALTER TYPE "AuthorizationRequestType" ADD VALUE 'OAuth2_PAR';

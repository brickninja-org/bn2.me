/*
  Warnings:

  - The values [discord,steam] on the enum `UserProviderType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserProviderType_new" AS ENUM ('github', 'google', 'passkey');
ALTER TABLE "UserProvider" ALTER COLUMN "provider" TYPE "UserProviderType_new" USING ("provider"::text::"UserProviderType_new");
ALTER TABLE "UserProviderRequest" ALTER COLUMN "provider" TYPE "UserProviderType_new" USING ("provider"::text::"UserProviderType_new");
ALTER TYPE "UserProviderType" RENAME TO "UserProviderType_old";
ALTER TYPE "UserProviderType_new" RENAME TO "UserProviderType";
DROP TYPE "UserProviderType_old";
COMMIT;

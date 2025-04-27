/*
  Warnings:

  - The values [Cancelled] on the enum `AuthorizationRequestState` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AuthorizationRequestState_new" AS ENUM ('Pushed', 'Pending', 'Canceled', 'Authorized');
ALTER TABLE "AuthorizationRequest" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "AuthorizationRequest" ALTER COLUMN "state" TYPE "AuthorizationRequestState_new" USING ("state"::text::"AuthorizationRequestState_new");
ALTER TYPE "AuthorizationRequestState" RENAME TO "AuthorizationRequestState_old";
ALTER TYPE "AuthorizationRequestState_new" RENAME TO "AuthorizationRequestState";
DROP TYPE "AuthorizationRequestState_old";
ALTER TABLE "AuthorizationRequest" ALTER COLUMN "state" SET DEFAULT 'Pending';
COMMIT;

/*
  Warnings:

  - You are about to drop the `_applicationGrant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_applicationGrant" DROP CONSTRAINT "_applicationGrant_A_fkey";

-- DropForeignKey
ALTER TABLE "_applicationGrant" DROP CONSTRAINT "_applicationGrant_B_fkey";

-- DropTable
DROP TABLE "_applicationGrant";

-- CreateTable
CREATE TABLE "_applicationGrants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_applicationGrants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_applicationGrants_B_index" ON "_applicationGrants"("B");

-- AddForeignKey
ALTER TABLE "_applicationGrants" ADD CONSTRAINT "_applicationGrants_A_fkey" FOREIGN KEY ("A") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_applicationGrants" ADD CONSTRAINT "_applicationGrants_B_fkey" FOREIGN KEY ("B") REFERENCES "ApplicationGrant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

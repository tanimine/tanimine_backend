/*
  Warnings:

  - You are about to drop the column `userId` on the `farmer_device` table. All the data in the column will be lost.
  - You are about to drop the column `usersId` on the `farmer_device` table. All the data in the column will be lost.
  - Added the required column `farmerId` to the `farmer_device` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "farmer_device" DROP CONSTRAINT "farmer_device_usersId_fkey";

-- AlterTable
ALTER TABLE "farmer_device" DROP COLUMN "userId",
DROP COLUMN "usersId",
ADD COLUMN     "farmerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "roles" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "farmer_device" ADD CONSTRAINT "farmer_device_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "farmers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

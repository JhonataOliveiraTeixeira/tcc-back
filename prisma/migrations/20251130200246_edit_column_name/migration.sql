/*
  Warnings:

  - You are about to drop the column `curse` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "curse",
ADD COLUMN     "course" TEXT;

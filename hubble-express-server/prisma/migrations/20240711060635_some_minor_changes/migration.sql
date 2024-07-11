/*
  Warnings:

  - The `messages` column on the `Chat` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `myChats` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "messages",
ADD COLUMN     "messages" JSONB;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "myChats",
ADD COLUMN     "myChats" JSONB;

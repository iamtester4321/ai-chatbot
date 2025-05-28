/*
  Warnings:

  - You are about to drop the `FileUpload` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FileUpload" DROP CONSTRAINT "FileUpload_chatId_fkey";

-- DropForeignKey
ALTER TABLE "FileUpload" DROP CONSTRAINT "FileUpload_userId_fkey";

-- DropTable
DROP TABLE "FileUpload";

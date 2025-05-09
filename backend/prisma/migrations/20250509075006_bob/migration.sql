/*
  Warnings:

  - A unique constraint covering the columns `[chatId]` on the table `share` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "share_chatId_key" ON "share"("chatId");

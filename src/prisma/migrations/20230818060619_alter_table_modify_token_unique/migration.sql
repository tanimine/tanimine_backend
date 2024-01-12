/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `change_password_tokens` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `user_verification_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "change_password_tokens_token_key" ON "change_password_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_verification_tokens_token_key" ON "user_verification_tokens"("token");

/*
  Warnings:

  - You are about to drop the column `sequence` on the `FireworkRecipe` table. All the data in the column will be lost.
  - Added the required column `config` to the `FireworkRecipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FireworkRecipe" DROP COLUMN "sequence",
ADD COLUMN     "config" JSONB NOT NULL;

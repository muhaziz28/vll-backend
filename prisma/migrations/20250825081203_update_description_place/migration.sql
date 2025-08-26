/*
  Warnings:

  - You are about to drop the column `description` on the `place` table. All the data in the column will be lost.
  - Added the required column `description_en` to the `place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description_id` to the `place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description_mi` to the `place` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `place` DROP COLUMN `description`,
    ADD COLUMN `description_en` LONGTEXT NOT NULL,
    ADD COLUMN `description_id` LONGTEXT NOT NULL,
    ADD COLUMN `description_mi` LONGTEXT NOT NULL;

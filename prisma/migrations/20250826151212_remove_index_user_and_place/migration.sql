-- DropForeignKey
ALTER TABLE `place_reviews` DROP FOREIGN KEY `place_reviews_place_id_fkey`;

-- DropIndex
DROP INDEX `place_reviews_place_id_user_id_key` ON `place_reviews`;

-- AddForeignKey
ALTER TABLE `place_reviews` ADD CONSTRAINT `place_reviews_place_id_fkey` FOREIGN KEY (`place_id`) REFERENCES `place`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

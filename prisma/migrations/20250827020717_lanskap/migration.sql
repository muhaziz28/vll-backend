-- CreateTable
CREATE TABLE `lanskap_linguistik` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `file` VARCHAR(191) NOT NULL,
    `file_size` INTEGER NOT NULL,
    `file_path` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

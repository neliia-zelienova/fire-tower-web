-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `role` ENUM('guest', 'owner') NOT NULL DEFAULT 'guest',
    `tower` ENUM('north_east', 'north_west', 'south_east', 'south_west') NOT NULL,
    `room_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `room` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `wind_direction` ENUM('north', 'east', 'south', 'west') NOT NULL,
    `userId` VARCHAR(191) NULL,
    `deck_id` INTEGER NOT NULL,
    `deckId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deck` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `room_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `card` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `played` BOOLEAN NOT NULL,
    `card_id` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `deck_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `available_cards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `type` ENUM('fire', 'wind', 'water', 'firebreak', 'event') NOT NULL,
    `action` ENUM('add', 'remove', 'build') NOT NULL,
    `pattern` ENUM('square', 'line', 'void_square', 'point', 'double_point') NULL,
    `direction` ENUM('north', 'east', 'south', 'west') NULL,
    `event` ENUM('firestorm', 'aid', 'shadow') NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deck` ADD CONSTRAINT `deck_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `card` ADD CONSTRAINT `card_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `card` ADD CONSTRAINT `card_deck_id_fkey` FOREIGN KEY (`deck_id`) REFERENCES `deck`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

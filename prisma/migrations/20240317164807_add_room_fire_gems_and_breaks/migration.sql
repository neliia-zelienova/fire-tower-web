/*
  Warnings:

  - Added the required column `fire_gems` to the `room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firebreak_tokens` to the `room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `room` ADD COLUMN `fire_gems` JSON NOT NULL,
    ADD COLUMN `firebreak_tokens` JSON NOT NULL;

-- Database schema for Lead Management App
CREATE DATABASE IF NOT EXISTS `lms` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lms`;

CREATE TABLE IF NOT EXISTS `leads` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `company` VARCHAR(200) NULL,
  `source` VARCHAR(100) NULL,
  `message` TEXT NULL,
  `status` ENUM('New','Contacted','Qualified','Won','Lost') NOT NULL DEFAULT 'New',
  `utm_source` VARCHAR(100) NULL,
  `utm_medium` VARCHAR(100) NULL,
  `utm_campaign` VARCHAR(200) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_email` (`email`),
  KEY `idx_utm_source` (`utm_source`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



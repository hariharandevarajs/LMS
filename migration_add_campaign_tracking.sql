-- Migration: Add campaign tracking fields to existing leads table
-- Run this if you already have a database with leads table

USE `lms`;

ALTER TABLE `leads` 
  ADD COLUMN `utm_source` VARCHAR(100) NULL AFTER `status`,
  ADD COLUMN `utm_medium` VARCHAR(100) NULL AFTER `utm_source`,
  ADD COLUMN `utm_campaign` VARCHAR(200) NULL AFTER `utm_medium`;

ALTER TABLE `leads` ADD INDEX `idx_utm_source` (`utm_source`);





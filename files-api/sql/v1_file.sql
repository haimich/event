USE `event`;

CREATE TABLE `files` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `mime_type` VARCHAR(255) DEFAULT NULL,
  `filesystem_location` VARCHAR(255) DEFAULT NULL,
  `url` VARCHAR(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
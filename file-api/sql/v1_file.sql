USE `event`;

CREATE TABLE `file` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `mime_type` VARCHAR(255) DEFAULT NULL,
  `filesystem_location` VARCHAR(255) DEFAULT NULL,
  `url` VARCHAR(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO file (filesystem_location, mime_type, created_at, modified_at) VALUES ('/home/juicebox/Code/event/file-api/uploads/image.png', 'image/png', '2015-10-22 17:09:44', '2015-10-22 17:09:44');
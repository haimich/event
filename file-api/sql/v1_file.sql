USE `event`;

CREATE TABLE `attachment` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `url` VARCHAR(255) DEFAULT NULL,
  `mime_type` VARCHAR(255) DEFAULT NULL,
  `session_id` BIGINT DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`session_id`) REFERENCES session(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#INSERT INTO attachment(`url`, `mime_type`, `session_id`) VALUES('internet', 'application/json', 12321);
USE `event`;

CREATE TABLE `user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `external_id` BIGINT DEFAULT NULL,
  `username` VARCHAR(255) DEFAULT NULL,
  `firstname` VARCHAR(255) DEFAULT NULL,
  `name` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO user(`external_id`, `username`, `firstname`, `name`, `email`, `created_at`, `modified_at`) VALUES('1234', 'eventman', 'Event', 'Man', 'eventman@1und1.de', '2015-10-20 08:45:00', '2015-10-20 08:45:00');
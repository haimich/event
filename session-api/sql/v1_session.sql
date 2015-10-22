USE `event`;

CREATE TABLE `session_type` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `session_state` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `session` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) DEFAULT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `duration` BIGINT DEFAULT NULL,
  `state_id` BIGINT DEFAULT NULL,
  `speaker_id` BIGINT DEFAULT NULL,
  `session_type_id` BIGINT DEFAULT 0,
  `session_state_id` BIGINT DEFAULT 0,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`session_type_id`) REFERENCES session_type(`id`),
  FOREIGN KEY (`session_state_id`) REFERENCES session_state(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `session_file` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `session_id` BIGINT,
  `file_id` BIGINT,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`session_id`) REFERENCES session(`id`),
  FOREIGN KEY (`file_id`) REFERENCES file(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO session_type(`name`) VALUES('presentation');
INSERT INTO session_state(`name`) VALUES('in progress');
INSERT INTO session_state(`name`) VALUES('published');
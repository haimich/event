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
  `speaker_id` BIGINT DEFAULT NULL,
  `session_type_id` BIGINT DEFAULT 0,
  `session_state_id` BIGINT DEFAULT 0,
  `created_at` datetime DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`session_type_id`) REFERENCES session_type(`id`),
  FOREIGN KEY (`session_state_id`) REFERENCES session_state(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO session_type(`name`) VALUES('presentation');
INSERT INTO session_state(`name`) VALUES('in progress');
INSERT INTO session_state(`name`) VALUES('published');
INSERT INTO session_state(`name`) VALUES('deleted');

INSERT INTO session(`title`, `description`, `date`, `speaker_id`, `session_type_id`, `session_state_id`, `created_at`, `modified_at`) VALUES('Test presentation', 'My test presentation', '2015-10-23', 1, 1, 1, '2015-10-23 10:20:00', '2015-10-23 10:20:00');

CREATE TABLE `session_file` (
  `session_id` BIGINT NOT NULL,
  `file_id` BIGINT NOT NULL,
  `type` VARCHAR(255) DEFAULT NULL,
  `status` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`session_id`, `file_id`),
  CONSTRAINT uc_pimary_key UNIQUE (`session_id`, `file_id`),
  FOREIGN KEY (`session_id`) REFERENCES session(`id`),
  FOREIGN KEY (`file_id`) REFERENCES file(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO session_file(`session_id`, `file_id`, `type`, `status`) VALUES(1, 1, 'presentation', null);

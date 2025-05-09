-- Base de données : `chat-room`

-- Structure de la table `users`
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `role` enum('ADMIN','USER') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Structure de la table `chats`
DROP TABLE IF EXISTS `chats`;
CREATE TABLE IF NOT EXISTS `chats` (
  `chat_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_user_id` bigint(20) NOT NULL,
  `second_user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`chat_id`),
  KEY `FKo688ca4m0ao1xo7v90kihu9iu` (`first_user_id`),
  KEY `FK4ajej3dwffhs69qa8rl4vr317` (`second_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Structure de la table `messages`
DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `chat_id` int(11) NOT NULL,
  `receiver_id` bigint(20) NOT NULL,
  `sender_id` bigint(20) NOT NULL,
  `timestamp` datetime DEFAULT NULL,
  `content` varchar(255) NOT NULL,
  `media_url` varchar(255) DEFAULT NULL,
  `message_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK64w44ngcpqp99ptcb9werdfmb` (`chat_id`),
  KEY `FKt05r0b6n0iis8u7dfna4xdh73` (`receiver_id`),
  KEY `FK4ui4nnwntodh6wjvck53dbk9m` (`sender_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Contraintes pour la table `chats`
ALTER TABLE `chats`
  ADD CONSTRAINT `FK4ajej3dwffhs69qa8rl4vr317` FOREIGN KEY (`second_user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKo688ca4m0ao1xo7v90kihu9iu` FOREIGN KEY (`first_user_id`) REFERENCES `users` (`id`);

-- Contraintes pour la table `messages`
ALTER TABLE `messages`
  ADD CONSTRAINT `FK4ui4nnwntodh6wjvck53dbk9m` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FK64w44ngcpqp99ptcb9werdfmb` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`chat_id`),
  ADD CONSTRAINT `FKt05r0b6n0iis8u7dfna4xdh73` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`);
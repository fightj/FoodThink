-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: i12e107.p.ssafy.io    Database: foodthink
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `feedcomment`
--

DROP TABLE IF EXISTS `feedcomment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedcomment` (
  `comment_id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `write_time` datetime(6) DEFAULT NULL,
  `feed_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `FK1sdgkq0aq879ge7pumehs554s` (`feed_id`),
  KEY `FK17itsr71iae5h90oih644i0h9` (`user_id`),
  CONSTRAINT `FK17itsr71iae5h90oih644i0h9` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FK1sdgkq0aq879ge7pumehs554s` FOREIGN KEY (`feed_id`) REFERENCES `feed` (`feed_id`)
) ENGINE=InnoDB AUTO_INCREMENT=180 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedcomment`
--

LOCK TABLES `feedcomment` WRITE;
/*!40000 ALTER TABLE `feedcomment` DISABLE KEYS */;
INSERT INTO `feedcomment` VALUES (142,'치즈스프보다 훨씬 낫다','2025-02-20 05:59:07.966157',69,69),(143,'너, 토트랜드로 오겠어?','2025-02-20 06:00:57.366489',71,62),(144,'거긴 어디지? 현생을 살아라.','2025-02-20 06:13:42.366535',71,69),(146,'디저트 아님 인정 못해.','2025-02-20 06:40:20.967972',84,62),(147,'나의 레시피를 참고하였군. 환상적인 색감, 부드러운 소스, 그리고 완벽하게 코팅된 파스타...통과!','2025-02-20 07:34:25.382777',85,69),(149,'진정한 어른이 되었군.','2025-02-20 08:05:20.615466',92,69),(150,'이스트 블루 와인과 딱 어울리겠어.','2025-02-20 08:12:54.484549',92,62),(151,'소울소울 열매 주인은 나야!','2025-02-20 08:14:39.578769',91,62),(152,'흠 나도 도전해봐야겠어.','2025-02-20 08:15:02.673421',85,62),(153,'마힜겠당,, 만간 먹어봐야겠네용','2025-02-20 09:01:56.958640',85,83),(154,'밥 두그릇 뚝딱','2025-02-20 09:02:48.605612',91,83),(157,'와 침 고인다 ...','2025-02-20 10:58:58.383406',91,70),(158,'와.. 침 고인다..','2025-02-20 11:00:43.306379',83,70),(160,'난 이 요리를 해봤어요','2025-02-20 11:45:10.982270',91,69),(163,'안녕하세요','2025-02-20 11:47:52.110933',94,70),(165,'안녕하세요','2025-02-20 11:50:34.829919',87,70),(167,'하이용','2025-02-20 11:51:00.420797',87,69),(169,'맵다 개찌치김','2025-02-20 11:51:39.252912',83,69),(172,'와 마싯겟다','2025-02-20 12:05:14.107847',92,85),(173,'람쥐헴 요리 잘하내','2025-02-20 12:05:50.898401',94,85),(174,'맛있어보이네요~^^ 식단메뉴로 넣어보면 좋을 것 같습니다 공유 감사해요~~','2025-02-20 14:51:49.581347',93,87),(175,'배고파졌어요….','2025-02-20 14:52:29.662414',87,87),(176,'내일 간식은 레몬쿠키로 결정 ?','2025-02-20 14:55:58.481940',70,87),(177,'ㅋㅋㅋㅋㅋㅋㅋㅋ','2025-02-20 14:58:39.563380',97,62),(178,'dddd','2025-02-20 15:50:28.662288',97,68),(179,'정말 훌륭하다.','2025-02-21 00:03:05.368077',97,69);
/*!40000 ALTER TABLE `feedcomment` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-21  9:11:26

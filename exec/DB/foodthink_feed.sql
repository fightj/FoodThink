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
-- Table structure for table `feed`
--

DROP TABLE IF EXISTS `feed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feed` (
  `feed_id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) NOT NULL,
  `food_name` varchar(255) NOT NULL,
  `write_time` datetime(6) DEFAULT NULL,
  `recipe_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`feed_id`),
  KEY `FKc7w8wdht6qvdhhf8od7rt5pxp` (`recipe_id`),
  KEY `FK7hlh93hvlb1gagl7oyic19kvk` (`user_id`),
  CONSTRAINT `FK7hlh93hvlb1gagl7oyic19kvk` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKc7w8wdht6qvdhhf8od7rt5pxp` FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`recipe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feed`
--

LOCK TABLES `feed` WRITE;
/*!40000 ALTER TABLE `feed` DISABLE KEYS */;
INSERT INTO `feed` VALUES (69,'맘~~~맘맘마마~~!!! 에피타이저로 스프 만한 게 있을까? 케이크를 가져와!','걸쭉한 치즈 감자 스프','2025-02-20 05:51:11.630770',3947,62),(70,'쿠키 대신!!! 쿠키 대신을 찾아라! 상을 줘야겠어!','레몬쿠키','2025-02-20 05:55:59.813037',8650,62),(71,'이게 평범한 귤을 입에서 녹는 걸작으로 바꾸는 방법이다. 그냥 젤리라고? 아니, 이건 순수한 감귤의 기적이다. ?? 시중에서 파는 젤리가 괜찮다고 생각한다면 다시 생각해봐. 이게 진짜 맛이다. 제대로 만들든가, 만들지 말든가.','귤양갱','2025-02-20 05:58:19.449627',8620,69),(72,'뭐? 꽃으로 만든 디저트라고? 흠~~~ 뭐, 나쁘지 않군! 하지만 좀 더 달면 좋겠어!','화전','2025-02-20 06:00:16.312913',6575,62),(73,'비싼 와규 따위 잊어버려. 불필요한 기름 NO, 쓸데없는 장식 NO, 그냥 소고기의 완벽함. 이걸 오버쿡하면 나한테 말도 걸지 마라.','한우우둔살스테이크','2025-02-20 06:01:26.929052',5833,69),(74,'네 베이글이 질기고 눅눅하다면, 뭔가 잘못된 거다. 당장 고쳐.','아보카도_연어베이글_샌드위치','2025-02-20 06:05:41.444626',12218,69),(76,'이게 평범한 가지를 레스토랑급 요리로 바꾸는 방법이다. 네 가지가 축축하고 흐물거리면? 그냥 버려라. 제대로 만들든가, 아예 하지 말든가.','가지 스테이크','2025-02-20 06:12:58.843699',17080,69),(80,'부드럽게 흘러내리는 계란 물결, 적당히 익어 촉촉한 감자, 깔끔하면서도 깊은 국물. 단순하지만 몸을 따뜻하게 해주는 최고의 조합. 계란이 몽글몽글 뭉치고 국물이 탁하다면? 이미 망한 거다.','감자계란','2025-02-20 06:21:24.979507',13678,69),(81,'양념이 잘 밴 양배추와 채소 속이 가득 찬 완벽한 한 입. 요즘 mz말로는 겉바속촉이다.','라이스페이퍼 양배추 만두','2025-02-20 06:25:37.830543',13907,69),(83,'쉽게 작성되어 따라하기 간편했어요~','나만의 돼지고기 김치찌개!','2025-02-20 06:31:13.366017',11844,70),(84,'내 아이들도 이걸 정말 좋아한다. 우리 막내가 한 입 먹더니 ‘아빠, 이거 진짜 맛있어요!’라고 했다.','카레_두부구이','2025-02-20 06:32:46.754554',14033,69),(85,'너무너무너무너무 맛있어요!!','시금치 오일 파스타','2025-02-20 06:42:51.223212',13762,70),(87,'오일 파스타 어때요','시금치 오일 파스타','2025-02-20 07:04:05.591414',13762,62),(88,'크','소시지 피자','2025-02-20 07:05:15.238566',14202,70),(91,'이게 진짜 제대로 만든 한식 소울푸드다.','두부 짜글이','2025-02-20 07:14:24.758403',13946,69),(92,'어릴땐 최고의 간식이었는데 지금은 최고의 술안주가 되었어요 ~~~!!','베이컨떡말이','2025-02-20 07:16:27.737704',13893,70),(93,'이게 평범한 재료를 존중하는 방법이다.','들기름 무나물볶음','2025-02-20 07:30:44.807071',13380,69),(94,'시금치를 너무 익히는 실수는 절대 하지 마라.','시금치 계란볶음','2025-02-20 08:49:41.436840',13659,69),(97,'정통 까르보나라는 간단하면서 너무 맛있어요 꼭 해보시길 ','까르보나라','2025-02-20 14:55:18.405522',NULL,87),(98,'아주아주 이른 크리스마스일까 아주 늦은 크리스마스일까','산타 도시락 케이크','2025-02-20 16:04:38.012666',NULL,62);
/*!40000 ALTER TABLE `feed` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-21  9:11:27

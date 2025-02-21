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
-- Table structure for table `ingre_interest`
--

DROP TABLE IF EXISTS `ingre_interest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingre_interest` (
  `ingre_interest_id` bigint NOT NULL AUTO_INCREMENT,
  `ingredient` varchar(255) DEFAULT NULL,
  `is_liked` bit(1) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`ingre_interest_id`),
  KEY `FK1wx0hfdhsdl725ifvwjdjlchv` (`user_id`),
  CONSTRAINT `FK1wx0hfdhsdl725ifvwjdjlchv` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingre_interest`
--

LOCK TABLES `ingre_interest` WRITE;
/*!40000 ALTER TABLE `ingre_interest` DISABLE KEYS */;
INSERT INTO `ingre_interest` VALUES (1003,'블루치즈',_binary '',61),(1004,'마라 소스',_binary '',61),(1005,'라즈베리',_binary '',61),(1006,'난류(가금류)',_binary '\0',61),(1016,'블루치즈',_binary '',67),(1017,'게',_binary '\0',67),(1024,'블루치즈',_binary '',62),(1025,'라즈베리',_binary '',62),(1026,'비트',_binary '',62),(1027,'샐러리',_binary '',62),(1028,'새우',_binary '\0',62),(1037,'청국장',_binary '',71),(1038,'토마토',_binary '\0',71),(1039,'순대 내장',_binary '',72),(1040,'올리브',_binary '',72),(1041,'마라 소스',_binary '',72),(1042,'번데기',_binary '',72),(1043,'비트',_binary '',72),(1044,'라즈베리',_binary '',72),(1045,'해파리 냉채',_binary '',75),(1046,'가지',_binary '',75),(1047,'샐러리',_binary '',75),(1048,'산낙지',_binary '',76),(1049,'고추냉이',_binary '',76),(1053,'미더덕',_binary '',79),(1054,'피망',_binary '',79),(1055,'비트',_binary '',79),(1056,'샐러리',_binary '',79),(1057,'가지',_binary '',79),(1058,'건포도',_binary '',79),(1059,'고추냉이',_binary '',79),(1060,'굴',_binary '',79),(1061,'난류(가금류)',_binary '\0',79),(1062,'미더덕',_binary '',80),(1063,'고등어',_binary '\0',80),(1064,'마라 소스',_binary '',83),(1065,'순대 내장',_binary '',83),(1066,'고수',_binary '',84),(1067,'마라 소스',_binary '',84),(1068,'순대 내장',_binary '',84),(1069,'고추냉이',_binary '',84),(1070,'산낙지',_binary '',84),(1071,'우니(성게알)',_binary '',84),(1072,'해파리 냉채',_binary '',84),(1105,'청국장',_binary '',70),(1106,'올리브',_binary '',70),(1107,'고추냉이',_binary '',70),(1108,'해파리 냉채',_binary '',70),(1109,'산낙지',_binary '',70),(1110,'번데기',_binary '',70),(1111,'비트',_binary '',70),(1112,'블루치즈',_binary '',70),(1113,'난류(가금류)',_binary '\0',70),(1114,'고등어',_binary '\0',70),(1115,'복숭아',_binary '\0',70),(1116,'땅콩',_binary '\0',70),(1117,'대두',_binary '\0',70),(1118,'우유',_binary '\0',70),(1119,'마라 소스',_binary '',85),(1120,'순대 내장',_binary '',85),(1121,'고추냉이',_binary '',85),(1122,'굴',_binary '',85),(1123,'산낙지',_binary '',85),(1124,'우니(성게알)',_binary '',85),(1125,'피망',_binary '',85),(1126,'해파리 냉채',_binary '',85),(1127,'가지',_binary '',85),(1128,'라즈베리',_binary '',87),(1129,'두리안',_binary '',87),(1130,'가지',_binary '',87),(1131,'우니(성게알)',_binary '',68),(1132,'라즈베리',_binary '',68),(1133,'해파리 냉채',_binary '',68),(1134,'건포도',_binary '',68),(1135,'청국장',_binary '',68),(1136,'산낙지',_binary '',68),(1137,'번데기',_binary '',68),(1138,'복숭아',_binary '\0',68),(1139,'새우',_binary '\0',68),(1140,'대두',_binary '\0',68),(1141,'게',_binary '\0',68);
/*!40000 ALTER TABLE `ingre_interest` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-21  9:11:29

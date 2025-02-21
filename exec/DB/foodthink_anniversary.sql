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
-- Table structure for table `anniversary`
--

DROP TABLE IF EXISTS `anniversary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anniversary` (
  `anniversary_id` bigint NOT NULL AUTO_INCREMENT,
  `anniversary_menu` varchar(255) DEFAULT NULL,
  `anniversary_name` varchar(255) DEFAULT NULL,
  `menu_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`anniversary_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anniversary`
--

LOCK TABLES `anniversary` WRITE;
/*!40000 ALTER TABLE `anniversary` DISABLE KEYS */;
INSERT INTO `anniversary` VALUES (1,'떡국','설날','https://foodthinkawsbucket.s3.ap-northeast-2.amazonaws.com/%EB%96%A1%EA%B5%AD.png'),(2,'송편','추석','https://foodthinkawsbucket.s3.ap-northeast-2.amazonaws.com/%EC%86%A1%ED%8E%B8.png'),(3,'오곡밥','정월대보름','https://foodthinkawsbucket.s3.ap-northeast-2.amazonaws.com/%EC%98%A4%EA%B3%A1%EB%B0%A5.png'),(4,'화전','한식','https://foodthinkawsbucket.s3.ap-northeast-2.amazonaws.com/%ED%99%94%EC%A0%84.png'),(5,'수리취떡','단오','https://foodthinkawsbucket.s3.ap-northeast-2.amazonaws.com/%EC%88%98%EB%A6%AC%EC%B7%A8%EB%96%A1.png'),(6,'삼계탕','초복','https://foodthinkawsbucket.s3.ap-northeast-2.amazonaws.com/%EC%82%BC%EA%B3%84%ED%83%95.png'),(7,'삼계탕','중복','https://foodthinkawsbucket.s3.ap-northeast-2.amazonaws.com/%EC%82%BC%EA%B3%84%ED%83%95.png'),(8,'삼계탕','말복','https://foodthinkawsbucket.s3.ap-northeast-2.amazonaws.com/%EC%82%BC%EA%B3%84%ED%83%95.png'),(9,'밀전병','칠석','https://foodthinkawsbucket.s3.ap-northeast-2.amazonaws.com/%EB%B0%80%EC%A0%84%EB%B3%91.png'),(10,'팥죽','동지','https://foodthinkawsbucket.s3.ap-northeast-2.amazonaws.com/%ED%8C%A5%EC%A3%BD.png');
/*!40000 ALTER TABLE `anniversary` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-21  9:11:25

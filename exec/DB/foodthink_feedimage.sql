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
-- Table structure for table `feedimage`
--

DROP TABLE IF EXISTS `feedimage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedimage` (
  `image_id` bigint NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) DEFAULT NULL,
  `sequence` int NOT NULL,
  `feed_id` bigint NOT NULL,
  PRIMARY KEY (`image_id`),
  KEY `FK5ktn1o5avse84s6yb8h65wos4` (`feed_id`),
  CONSTRAINT `FK5ktn1o5avse84s6yb8h65wos4` FOREIGN KEY (`feed_id`) REFERENCES `feed` (`feed_id`)
) ENGINE=InnoDB AUTO_INCREMENT=187 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedimage`
--

LOCK TABLES `feedimage` WRITE;
/*!40000 ALTER TABLE `feedimage` DISABLE KEYS */;
INSERT INTO `feedimage` VALUES (130,'https://foodthinkawsbucket.s3.amazonaws.com/89071ab9-bee0-4ee7-a0bf-700970593aeb-감자스프.png',1,69),(131,'https://foodthinkawsbucket.s3.amazonaws.com/74aaa8d1-a95b-4e77-a4e3-5183b2a025e0-쿠키1.png',1,70),(132,'https://foodthinkawsbucket.s3.amazonaws.com/cc85f3ff-647c-451f-af2d-d101d3273661-쿠키2.png',2,70),(133,'https://foodthinkawsbucket.s3.amazonaws.com/e566c171-8a54-455f-9b94-24d85ee85d24-귤양갱.jpg',1,71),(134,'https://foodthinkawsbucket.s3.amazonaws.com/091a9723-d023-4d8e-8d71-81f852dccb05-화전1.png',1,72),(135,'https://foodthinkawsbucket.s3.amazonaws.com/127ec9a0-e992-414b-a9c4-32a6e7329494-화전2.png',2,72),(136,'https://foodthinkawsbucket.s3.amazonaws.com/dd557166-2f8f-4004-8c70-5e76642ee7aa-화전3.png',3,72),(137,'https://foodthinkawsbucket.s3.amazonaws.com/492620c8-4d69-4587-b853-a052603cffa0-한우우둔살.jpg',1,73),(138,'https://foodthinkawsbucket.s3.amazonaws.com/353d3a28-f3f6-47c7-b4ee-971e88b4b05d-베이글1.jpg',1,74),(139,'https://foodthinkawsbucket.s3.amazonaws.com/6389fba9-fd6e-4d9e-bce0-84855b5e2599-베이글2.jpg',2,74),(145,'https://foodthinkawsbucket.s3.amazonaws.com/de618094-1e99-4ce9-acf5-bd126a6bf5b7-가지스테이크.jpg',1,76),(149,'https://foodthinkawsbucket.s3.amazonaws.com/730ed4ee-4a9e-4755-a57d-a1ec1d0feb40-감계국1.jpg',1,80),(151,'https://foodthinkawsbucket.s3.amazonaws.com/d22d51ae-1304-4895-bb5d-627c6017d608-양배추두부만두.jpg',1,81),(152,'https://foodthinkawsbucket.s3.amazonaws.com/1b43c362-42ed-4440-801e-6f4dbdb5f696-양배추두부만두1.jpg',2,81),(154,'https://foodthinkawsbucket.s3.amazonaws.com/67eabe40-d14e-46fd-a9e1-94e676d4cd23-다운로드.jpg',1,83),(155,'https://foodthinkawsbucket.s3.amazonaws.com/b4c77a73-a035-48ae-8c6d-fa4596754cbf-카레두부.jpg',1,84),(156,'https://foodthinkawsbucket.s3.amazonaws.com/b3cecfb1-8aca-4261-9c4d-0d54975e83a0-카레두부2.jpg',2,84),(157,'https://foodthinkawsbucket.s3.amazonaws.com/98512e17-3597-4a32-a8ba-fb3c022a3056-img.jpg',1,85),(170,'https://foodthinkawsbucket.s3.amazonaws.com/fed6d639-8221-449a-b768-5ef060a6bc17-e7f908f6-a371-4653-9a4d-616258357551-qqqqqqqq.png',1,87),(171,'https://foodthinkawsbucket.s3.amazonaws.com/24b16355-3231-4bc2-9fe9-e242aa566f87-1740035091096.png',1,88),(178,'https://foodthinkawsbucket.s3.amazonaws.com/d0c14949-c56a-4d08-9322-2c277a764f81-두부짜글이.jpg',1,91),(179,'https://foodthinkawsbucket.s3.amazonaws.com/befbfeb8-1893-4055-9404-be9231eab966-베이컨떡말이-2.jpg',1,92),(180,'https://foodthinkawsbucket.s3.amazonaws.com/c5e82079-2a4f-4f2a-8011-c5af6515163c-무나물볶음.jpg',1,93),(181,'https://foodthinkawsbucket.s3.amazonaws.com/d117397f-ce71-4797-b619-35e04b83bbb2-시금치계란볶음.jpg',1,94),(185,'https://foodthinkawsbucket.s3.amazonaws.com/9019df3d-00be-49dd-bdb1-b95a49738f67-80D1FB58-EDE1-4E83-8301-ED552CCEB35C.jpeg',1,97),(186,'https://foodthinkawsbucket.s3.amazonaws.com/28b7bff6-47c5-47d9-afce-f461ee8a941c-1000066268.jpg',1,98);
/*!40000 ALTER TABLE `feedimage` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-21  9:11:31

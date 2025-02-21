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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL,
  `social_id` varchar(255) DEFAULT NULL,
  `social_type` varchar(255) DEFAULT NULL,
  `season` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'1',NULL,'윈터',NULL,'ROLE_USER','1','KAKAO','봄'),(2,'2',NULL,'루피',NULL,'ROLE_USER','2','KAKAO','봄'),(3,'3',NULL,'호크스',NULL,'ROLE_USER','3','KAKAO','봄'),(4,'4',NULL,'엘사',NULL,'ROLE_USER','4','KAKAO','봄'),(5,'5',NULL,'파토스',NULL,'ROLE_USER','5','KAKAO','봄'),(6,'6',NULL,'아린',NULL,'ROLE_USER','6','KAKAO','봄'),(7,'7',NULL,'루미너스',NULL,'ROLE_USER','7','KAKAO','봄'),(8,'8',NULL,'카리나',NULL,'ROLE_USER','8','KAKAO','봄'),(9,'9',NULL,'고윤정',NULL,'ROLE_USER','9','KAKAO','봄'),(10,'10',NULL,'박보영',NULL,'ROLE_USER','10','KAKAO','봄'),(11,'11',NULL,'닝닝',NULL,'ROLE_USER','1','KAKAO','봄'),(12,'12',NULL,'미키마우스',NULL,'ROLE_USER','12','KAKAO','봄'),(13,'13',NULL,'와조스키',NULL,'ROLE_USER','13','KAKAO','봄'),(14,'14',NULL,'영케이',NULL,'ROLE_USER','14','KAKAO','봄'),(15,'15',NULL,'주디',NULL,'ROLE_USER','15','KAKAO','봄'),(16,'16',NULL,'닉',NULL,'ROLE_USER','16','KAKAO','봄'),(17,'17',NULL,'핑핑이',NULL,'ROLE_USER','17','KAKAO','봄'),(18,'18',NULL,'스폰지밥',NULL,'ROLE_USER','18','KAKAO','봄'),(19,'19',NULL,'뚱이',NULL,'ROLE_USER','19','KAKAO','봄'),(20,'20',NULL,'짱구',NULL,'ROLE_USER','20','KAKAO','봄'),(61,'teayoung0812@naver.com','https://foodthinkawsbucket.s3.amazonaws.com/7efed304-d103-4ded-bff4-1ac3359118b0-다운로드.jpg','자칭요리왕','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlYXlvdW5nMDgxMkBuYXZlci5jb20iLCJpYXQiOjE3NDAwOTU1MzAsImV4cCI6MTc0MDcwMDMzMH0.WCj2HLr_YWb-j1TNfj0JeCN68UHh8DsUAQmSeROXldU','ROLE_USER','3890349526','KAKAO','여름'),(62,'dldnjfwjddnjs02@naver.com','https://foodthinkawsbucket.s3.amazonaws.com/ebc1b013-2451-4ff6-a08c-f1d96cb3b7f5-링링.webp','빅맘','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRsZG5qZndqZGRuanMwMkBuYXZlci5jb20iLCJpYXQiOjE3NDAwOTIyMjAsImV4cCI6MTc0MDY5NzAyMH0.4W9JhpvKAZI_uP0fFuem-FQa2zUTRtGcnSYADUIAlZQ','ROLE_USER','3891216977','KAKAO','겨울'),(67,'ydbqls13@daum.net',NULL,'ydbqls13@daum.net','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InlkYnFsczEzQGRhdW0ubmV0IiwiaWF0IjoxNzQwMDk1NjE0LCJleHAiOjE3NDA3MDA0MTR9.i08Wf-jJvw9zeqo7X-brUb0pJtvaC2P-k2JWL13yQKo','ROLE_USER','3903553133','KAKAO','봄'),(68,'fightj@naver.com','https://foodthinkawsbucket.s3.amazonaws.com/a1a291b5-6fa9-4072-9e0e-1122b159889d-푸바오.jfif','푸바오','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImZpZ2h0akBuYXZlci5jb20iLCJpYXQiOjE3NDAwOTU1MDAsImV4cCI6MTc0MDcwMDMwMH0.8JYJR19kv6GRW3wWYr2eAhkN5z0eMsg8qu-eq_uCdDw','ROLE_USER','3906543935','KAKAO','겨울'),(69,'ghgghg96@naver.com','https://foodthinkawsbucket.s3.amazonaws.com/6710da0c-5db8-496a-b116-90aeeb2146a1-고든램지.jpg','고든다람쥐','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImdoZ2doZzk2QG5hdmVyLmNvbSIsImlhdCI6MTc0MDA5NTczNCwiZXhwIjoxNzQwNzAwNTM0fQ.vbLpQIXYZB5xuzog-SsQuXl2O9iqHANuIva9Jql62WU','ROLE_USER','3906549860','KAKAO','겨울'),(70,'alswp936@kakao.com','https://foodthinkawsbucket.s3.amazonaws.com/670d0ee2-1696-41b8-9548-e7215b6bfaa4-ssafy.png','김싸피','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFsc3dwOTM2QGtha2FvLmNvbSIsImlhdCI6MTc0MDA5NTc4NCwiZXhwIjoxNzQwNzAwNTg0fQ.JZpnGAkyN4hKy9sujyBD-h9R_VN6kAu8cE_og3YQMlg','ROLE_USER','3906513796','KAKAO','봄'),(71,'kkskks6803@gmail.com',NULL,'kkskks6803@gmail.com','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Imtrc2trczY4MDNAZ21haWwuY29tIiwiaWF0IjoxNzQwMDMzNTk4LCJleHAiOjE3NDA2MzgzOTh9.kqjMAwm0hcwmvS3ZpJQ4iE5JDr3ueOJ6We-TgxqEIP8','ROLE_USER','3929541196','KAKAO','봄'),(72,'gung4749@naver.com',NULL,'gung4749@naver.com','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Imd1bmc0NzQ5QG5hdmVyLmNvbSIsImlhdCI6MTc0MDAzNDU3NCwiZXhwIjoxNzQwNjM5Mzc0fQ.HmlllngA281o0YJAdcE15Zg3vUrZFcIzTAlfjDy1gWM','ROLE_USER','3929544542','KAKAO','봄'),(73,'yo0910@naver.com',NULL,'yo0910@naver.com','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InlvMDkxMEBuYXZlci5jb20iLCJpYXQiOjE3NDAwMzM5NzksImV4cCI6MTc0MDYzODc3OX0.xfKAklVbaZZ2zuocTldL4DjA027IrInWYkhB1tATL60','ROLE_USER','3929550826','KAKAO','봄'),(74,'sunggyu62@naver.com',NULL,'sunggyu62@naver.com','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InN1bmdneXU2MkBuYXZlci5jb20iLCJpYXQiOjE3NDAwMzQxNTIsImV4cCI6MTc0MDYzODk1Mn0.5oebXQuw1UTqz579k6O_P-IVpcW9pO_2_UZ0hIkUiEY','ROLE_USER','3929555127','KAKAO','봄'),(75,'sky6001a@naver.com',NULL,'sky6001a@naver.com','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InNreTYwMDFhQG5hdmVyLmNvbSIsImlhdCI6MTc0MDAzNDU0MCwiZXhwIjoxNzQwNjM5MzQwfQ.atoLa1kh6yQktHlvqoH2bs_mF3e6sce7t4MEpu3UCB4','ROLE_USER','3929564460','KAKAO','봄'),(76,'huglove90@nate.com',NULL,'huglove90@nate.com','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Imh1Z2xvdmU5MEBuYXRlLmNvbSIsImlhdCI6MTc0MDAzNDg1NSwiZXhwIjoxNzQwNjM5NjU1fQ.uZwWQUvU1jk74hkPCABgQ0wTkUhDJBzRfGjEMT_BQyE','ROLE_USER','3929571737','KAKAO','봄'),(77,'kmsl028@naver.com',NULL,'kmsl028@naver.com','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Imttc2wwMjhAbmF2ZXIuY29tIiwiaWF0IjoxNzQwMDM1MjY4LCJleHAiOjE3NDA2NDAwNjh9.2nwvc4RSnUqjJOyTNO5wfLZv1UnjfWaJEGIlr_-yaR0','ROLE_USER','3929581633','KAKAO','봄'),(78,'makim7691@naver.com',NULL,'makim7691@naver.com','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im1ha2ltNzY5MUBuYXZlci5jb20iLCJpYXQiOjE3NDAwMzcwNzUsImV4cCI6MTc0MDY0MTg3NX0.nw0E7VcMezEGyEUzclR7eEXHXNBuUzlNs9-R6aN8DL0','ROLE_USER','3929608827','KAKAO','겨울'),(79,'asia67@daum.net',NULL,'asia67@daum.net','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFzaWE2N0BkYXVtLm5ldCIsImlhdCI6MTc0MDAzNzAzNywiZXhwIjoxNzQwNjQxODM3fQ.seoi1NIaniBidUJ0cCbLpKQLjrQSEIfOse_b7gJMCtE','ROLE_USER','3929624371','KAKAO','봄'),(80,'tomatonice00@gmail.com',NULL,'tomatonice00@gmail.com','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRvbWF0b25pY2UwMEBnbWFpbC5jb20iLCJpYXQiOjE3NDAwMzc5NDEsImV4cCI6MTc0MDY0Mjc0MX0.bDm6GcEg4rwTScLZHtR8QryKdxB4FUbmzuOMPiM53Zo','ROLE_USER','3929645699','KAKAO','봄'),(81,'flvl98@naver.com',NULL,'flvl98@naver.com','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImZsdmw5OEBuYXZlci5jb20iLCJpYXQiOjE3NDAwMzgyNjQsImV4cCI6MTc0MDY0MzA2NH0.mRYPWIQ3ZZwfyZBR1uclocpKwJYVVN8iBYaABiGW92g','ROLE_USER','3929653343','KAKAO','봄'),(82,'iceykock@naver.com',NULL,'iceykock@naver.com','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImljZXlrb2NrQG5hdmVyLmNvbSIsImlhdCI6MTc0MDAzODkzNSwiZXhwIjoxNzQwNjQzNzM1fQ.kEIGMrvYfwzmR24hpDCxHy8FSkFP6QCFHbaBis7gkBY','ROLE_USER','3929669248','KAKAO','봄'),(83,'ksh5625@nate.com',NULL,'소이','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImtzaDU2MjVAbmF0ZS5jb20iLCJpYXQiOjE3NDAwOTUxNzgsImV4cCI6MTc0MDY5OTk3OH0.FNp577DjOhjIWA1L0B4UFAFjdgQHO-rdI-oSWqxQFMo','ROLE_USER','3929734882','KAKAO','봄'),(84,'rlaekwjd65@nate.com',NULL,'rlaekwjd65@nate.com','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InJsYWVrd2pkNjVAbmF0ZS5jb20iLCJpYXQiOjE3NDAwNDM0NTIsImV4cCI6MTc0MDY0ODI1Mn0.7Qrery7bHL1aZoQH9Ld9mmY06NkGJRSFKOI1ArUhMoo','ROLE_USER','3929773015','KAKAO','봄'),(85,'gptn0124@kakao.com',NULL,'gptn0124@kakao.com','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImdwdG4wMTI0QGtha2FvLmNvbSIsImlhdCI6MTc0MDA1Mjc5OCwiZXhwIjoxNzQwNjU3NTk4fQ.5GRDCnc9sGLf0PqDdAhsOS-eYb-WatKS9Aj0UdCgi1k','ROLE_USER','3929977899','KAKAO','봄'),(86,'sky0702k@nate.com',NULL,'sky0702k@nate.com','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InNreTA3MDJrQG5hdGUuY29tIiwiaWF0IjoxNzQwMDYxMDUwLCJleHAiOjE3NDA2NjU4NTB9.e2sXRHw72893CszcUhamwNB4Xf1Awo3R3Kyi2rnd5ys','ROLE_USER','3930149923','KAKAO','봄'),(87,'seongsim8009@daum.net',NULL,'영양사의하루','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InNlb25nc2ltODAwOUBkYXVtLm5ldCIsImlhdCI6MTc0MDA2MzY2MCwiZXhwIjoxNzQwNjY4NDYwfQ.go2g6ne_e9-hMS1JpKIni2lKKnp-pXB6T2Emysv7XRA','ROLE_USER','3930185282','KAKAO','봄');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-21  9:11:32

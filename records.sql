-- MySQL dump 10.13  Distrib 5.1.73, for redhat-linux-gnu (x86_64)
--
-- Host: 10.10.108.165    Database: test
-- ------------------------------------------------------
-- Server version	5.6.20-ucloudrel1-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `t_sport_record`
--

DROP TABLE IF EXISTS `t_sport_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_sport_record` (
  `seq` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `sportid` int(11) NOT NULL,
  `amount` float NOT NULL,
  `arg1` float NOT NULL,
  `arg2` float NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`seq`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_sport_record`
--

LOCK TABLES `t_sport_record` WRITE;
/*!40000 ALTER TABLE `t_sport_record` DISABLE KEYS */;
INSERT INTO `t_sport_record` VALUES (11,1,6,400,10,40,'2016-04-05 18:18:01'),(12,1,6,400,10,40,'2016-04-05 18:21:13'),(13,1,6,360,9,40,'2016-04-05 18:24:40'),(14,1,5,280,10,28,'2016-04-05 18:31:48'),(15,1,5,280,10,28,'2016-04-05 18:39:54'),(16,1,4,280,10,28,'2016-04-05 18:52:54'),(17,1,3,600,10,60,'2016-04-05 19:00:15');
/*!40000 ALTER TABLE `t_sport_record` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-04-05 23:22:39

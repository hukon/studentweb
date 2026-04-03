-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: sql200.infinityfree.com
-- Generation Time: Apr 03, 2026 at 05:44 PM
-- Server version: 11.4.10-MariaDB
-- PHP Version: 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `if0_41562686_student`
--

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `dob` date DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `pic_path` varchar(255) DEFAULT NULL,
  `comprehension_orale` tinyint(1) DEFAULT 0,
  `ecriture` tinyint(1) DEFAULT 0,
  `vocabulaire` tinyint(1) DEFAULT 0,
  `grammaire` tinyint(1) DEFAULT 0,
  `conjugaison` tinyint(1) DEFAULT 0,
  `production_ecrite` tinyint(1) DEFAULT 0,
  `category1` varchar(120) DEFAULT NULL,
  `difficulties` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `class_id`, `name`, `dob`, `bio`, `pic_path`, `comprehension_orale`, `ecriture`, `vocabulaire`, `grammaire`, `conjugaison`, `production_ecrite`, `category1`, `difficulties`, `created_at`, `updated_at`) VALUES
(1, 1, 'BETCHIM Bayane Zineb', '2012-03-10', 'Moyenne: 15.43/20', 'uploads/BETCHIM_Bayane_Zineb.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(2, 1, 'BEDAR Oumnia', '2012-12-05', 'Moyenne: 14.69/20', 'uploads/BEDAR_Oumnia.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(3, 1, 'BEDAR Samiha Nour El Yakine', '2011-08-26', 'Redoublant - Moyenne précédente: 9.54/20', 'uploads/BEDAR_Samiha_Nour_El_Yakine.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(4, 1, 'BARKET Mohamed', '2012-10-25', 'Moyenne: 18.39/20', 'uploads/BARKET_Mohamed.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(5, 1, 'BACHI ECHRIF Ritadj', '2012-04-03', 'Moyenne: 18.45/20', 'uploads/BACHI_ECHRIF_Ritadj.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(6, 1, 'BEKIS Ali', '2010-03-18', 'Redoublant - Moyenne précédente: 17.50/20', 'uploads/BEKIS_Ali.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(7, 1, 'BEL ALEM Mohamed', '2011-04-02', 'Moyenne: 10.22/20', 'uploads/BEL_ALEM_Mohamed.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(8, 1, 'BEN DADA Lamis', '2010-05-02', 'Redoublant - Moyenne précédente: 9.25/20', 'uploads/BEN_DADA_Lamis.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(9, 1, 'BOURDIM Hadil', '2009-08-16', 'Moyenne: 9.79/20', 'uploads/BOURDIM_Hadil.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(10, 1, 'BOUGHARN Israa Fatma', '2012-06-25', 'Moyenne: 10.00/20', 'uploads/BOUGHARN_Israa_Fatma.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(11, 1, 'BOULAHIA Anis', '2009-09-21', 'Redoublant - Moyenne précédente: 8.94/20', 'uploads/BOULAHIA_Anis.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(12, 1, 'BOULAHIA Bouchra Hiba', '2012-06-14', 'Moyenne: 15.07/20', 'uploads/BOULAHIA_Bouchra_Hiba.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(13, 1, 'BOULANOUAR Oumaima Malak', '2012-03-23', 'Moyenne: 16.60/20', 'uploads/BOULANOUAR_Oumaima_Malak.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(14, 1, 'BOULANOUAR Badr Eddine', '2010-11-04', 'Redoublant - Moyenne précédente: 8.66/20', 'uploads/BOULANOUAR_Badr_Eddine.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(15, 1, 'BOULANOUAR Taouba', '2012-10-21', 'Moyenne: 12.28/20', 'uploads/BOULANOUAR_Taouba.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(16, 1, 'TERAHI Maria', '2012-08-27', 'Moyenne: 11.45/20', 'uploads/TERAHI_Maria.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(17, 1, 'DJEBLI Abdel Rahmene', '2012-05-03', 'Moyenne: 17.37/20', 'uploads/DJEBLI_Abdel_Rahmene.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(18, 1, 'DJEDOU Abdel Djalil', '2012-06-30', 'Moyenne: 16.98/20', 'uploads/DJEDOU_Abdel_Djalil.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(19, 1, 'DJEDOU Yahia Ishak', '2012-07-12', 'Moyenne: 14.55/20', 'uploads/DJEDOU_Yahia_Ishak.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(20, 1, 'DJALOUL Ibtihel', '2012-03-13', 'Moyenne: 12.43/20', 'uploads/DJALOUL_Ibtihel.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(21, 1, 'DJALOUL Adem', '2012-04-10', 'Moyenne: 11.48/20', 'uploads/DJALOUL_Adem.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(22, 1, 'DJANBA Abdel Rahmene', '2011-08-09', 'Moyenne: 11.17/20', 'uploads/DJANBA_Abdel_Rahmene.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(23, 1, 'HARCHE Takwa', '2011-05-03', 'Redoublant - Moyenne précédente: 7.82/20', 'uploads/HARCHE_Takwa.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(24, 1, 'HEOUIFI Ritadj', '2010-01-03', 'Moyenne: 10.00/20', 'uploads/HEOUIFI_Ritadj.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(25, 1, 'DENFIR Younes', '2012-04-18', 'Moyenne: 10.12/20', 'uploads/DENFIR_Younes.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(26, 1, 'RTIMA Yazane', '2010-09-09', 'Redoublant - Moyenne précédente: 9.86/20', 'uploads/RTIMA_Yazane.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(27, 1, 'RMAZENIA Med Abdou', '2012-08-13', 'Moyenne: 10.80/20', 'uploads/RMAZENIA_Med_Abdou.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(28, 1, 'ROUAG Abdel Rahmene', '2011-07-02', 'Moyenne: 9.36/20', 'uploads/ROUAG_Abdel_Rahmene.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(29, 1, 'ZEHIMI Maram Menat Erahmene', '2012-02-28', 'Moyenne: 13.72/20', 'uploads/ZEHIMI_Maram_Menat_Erahmene.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(30, 1, 'ZIADI Ahmed', '2012-05-21', 'Moyenne: 10.70/20', 'uploads/ZIADI_Ahmed.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(31, 1, 'ZIDENE Taouba', '2012-04-10', 'Moyenne: 14.85/20', 'uploads/ZIDENE_Taouba.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(32, 1, 'SELAMI Kaouthar', '2012-05-07', 'Moyenne: 13.77/20', 'uploads/SELAMI_Kaouthar.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(33, 1, 'CHIDA Djana', '2012-06-06', 'Moyenne: 14.21/20', 'uploads/CHIDA_Djana.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(34, 1, 'SALHI Ikram', '2012-12-07', 'Moyenne: 10.99/20', 'uploads/SALHI_Ikram.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(35, 1, 'ARAB Med Abderrahmane', '2011-01-07', 'Moyenne: 10.51/20', 'uploads/ARAB_Med_Abderrahmane.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(36, 1, 'ARAR Karima', '2009-12-19', 'Redoublant - Moyenne précédente: 9.54/20', 'uploads/ARAR_Karima.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(37, 1, 'ALI SAHRAOUI Ahmed', '2012-06-11', 'Moyenne: 12.56/20', 'uploads/ALI_SAHRAOUI_Ahmed.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(38, 1, 'ALIOUA Aicha', '2012-07-17', 'Moyenne: 11.03/20', 'uploads/ALIOUA_Aicha.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(39, 1, 'OULMI Adem', '2012-10-19', 'Moyenne: 17.01/20', 'uploads/OULMI_Adem.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(40, 1, 'GHAMOUD Ranim', '2012-10-25', 'Moyenne: 13.74/20', 'uploads/GHAMOUD_Ranim.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(41, 1, 'GHAMOUD Mohamed', '2012-07-26', 'Moyenne: 15.88/20', 'uploads/GHAMOUD_Mohamed.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(42, 1, 'GHOULEM Assem', '2011-05-20', 'Moyenne: 10.00/20', 'uploads/GHOULEM_Assem.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(43, 1, 'GUIDOUM Ilyes', '2012-08-28', 'Moyenne: 11.31/20', 'uploads/GUIDOUM_Ilyes.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(44, 1, 'KAROUR Safouane', '2013-01-23', 'Moyenne: 13.98/20', 'uploads/KAROUR_Safouane.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(45, 1, 'LADJROUD Nouha Ayet Erahmene', '2012-08-07', 'Moyenne: 11.65/20', 'uploads/LADJROUD_Nouha_Ayet_Erahmene.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(46, 1, 'MAHOUCHE Djasser', '2010-08-01', 'Moyenne: 10.67/20', 'uploads/MAHOUCHE_Djasser.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(47, 1, 'MEGHRI Chaima', '2011-02-04', 'Redoublant - Moyenne précédente: 8.95/20', 'uploads/MEGHRI_Chaima.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(48, 1, 'MAHOUR BACHA Med Ibrahim', '2010-11-20', 'Redoublant - Moyenne précédente: 8.05/20', 'uploads/MAHOUR_BACHA_Med_Ibrahim.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(49, 1, 'NEDJAI Khalil Ibrahim', '2012-03-15', 'Moyenne: 15.34/20', 'uploads/NEDJAI_Khalil_Ibrahim.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(50, 2, 'SID Bassmala', '2012-02-14', 'Moyenne: 14.69/20', 'uploads/SID_Bassmala.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(51, 2, 'EL EULMI Abdel Raouf', '2011-03-08', 'Redoublant - Moyenne précédente: 9.03/20', 'uploads/EL_EULMI_Abdel_Raouf.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(52, 2, 'MADROUH Med Islam', '2012-09-21', 'Average: 10.00/20', 'uploads/MADROUH_Med_Islam.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(53, 2, 'BARKET Asma', '2012-10-05', 'Moyenne: 14.52/20', 'uploads/BARKET_Asma.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(54, 2, 'BOURKENE Takoua', '2012-11-17', 'Moyenne: 13.57/20', 'uploads/BOURKENE_Takoua.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(55, 2, 'BESBAS Amani', '2012-03-10', 'Moyenne: 15.00/20', 'uploads/BESBAS_Amani.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(56, 2, 'BILEL Maroua', '2011-03-29', 'Redoublant - Moyenne précédente: 9.36/20', 'uploads/BILEL_Maroua.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(57, 2, 'BEL HOUCHET Amira', '2010-09-07', 'Moyenne: 9.82/20', 'uploads/BEL_HOUCHET_Amira.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(58, 2, 'BEN BARGHOUT Meriem', '2012-03-02', 'Moyenne: 12.48/20', 'uploads/BEN_BARGHOUT_Meriem.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(59, 2, 'BEN MEZGHENA Ishak', '2012-06-24', 'Moyenne: 10.61/20', 'uploads/BEN_MEZGHENA_Ishak.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(60, 2, 'BOUHEDJAR Zakaria', '2012-10-28', 'Moyenne: 13.95/20', 'uploads/BOUHEDJAR_Zakaria.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(61, 2, 'BOUHAFS Lina', '2012-03-14', 'Moyenne: 18.55/20', 'uploads/BOUHAFS_Lina.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(62, 2, 'BOUZERARA Aya', '2012-04-14', 'Moyenne: 10.00/20', 'uploads/BOUZERARA_Aya.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(63, 2, 'BOUZERARA Ghouzlane', '2012-11-13', 'Moyenne: 13.07/20', 'uploads/BOUZERARA_Ghouzlane.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(64, 2, 'BOUZEGHAR Ritedj', '2010-09-13', 'Redoublant - Moyenne précédente: 8.99/20', 'uploads/BOUZEGHAR_Ritedj.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(65, 2, 'BOUSSOUAR Takwa', '2012-09-03', 'Moyenne: 13.03/20', 'uploads/BOUSSOUAR_Takwa.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(66, 2, 'BOUDIAF Salssabil', '2012-10-23', 'Moyenne: 11.28/20', 'uploads/BOUDIAF_Salssabil.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(67, 2, 'BOUNKIB Maria Nour El assil', '2011-08-18', 'Moyenne: 17.86/20', 'uploads/BOUNKIB_Maria_Nour_El_assil.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(68, 2, 'DJALOUL Amir', '2012-10-04', 'Moyenne: 14.18/20', 'uploads/DJALOUL_Amir.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(69, 2, 'DJOUDI Rami', '2012-07-11', 'Moyenne: 14.65/20', 'uploads/DJOUDI_Rami.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(70, 2, 'HADED Younes', '2012-12-19', 'Moyenne: 11.26/20', 'uploads/HADED_Younes.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(71, 2, 'HAKIMI Maria', '0000-00-00', 'Moyenne: 10.50/20', 'uploads/HAKIMI_Maria.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(72, 2, 'HAMOUDI Lina', '2012-11-06', 'Moyenne: 15.58/20', 'uploads/HAMOUDI_Lina.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(73, 2, 'HAMOUDI Med Fadi', '2010-10-06', 'Redoublant - Moyenne précédente: 9.34/20', 'uploads/HAMOUDI_Med_Fadi.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(74, 2, 'KHABEB Abdallah', '2011-03-01', 'Moyenne: 11.33/20', 'uploads/KHABEB_Abdallah.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(75, 2, 'KHELIFA Abdel Basset', '2010-05-09', 'Moyenne: 16.29/20', 'uploads/KHELIFA_Abdel_Basset.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(76, 2, 'DEBA Anes Abdel Mounim', '2012-05-09', 'Moyenne: 11.40/20', 'uploads/DEBA_Anes_Abdel_Mounim.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(77, 2, 'RACHID Baraa', '2012-03-20', 'Moyenne: 10.35/20', 'uploads/RACHID_Baraa.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(78, 2, 'REKIZ Amdjad', '2011-11-20', 'Moyenne: 13.68/20', 'uploads/REKIZ_Amdjad.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(79, 2, 'ROUINA Hafssa', '2012-06-09', 'Redoublant - Moyenne précédente: 9.57/20', 'uploads/ROUINA_Hafssa.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(80, 2, 'SEBBIHI Fadi', '2012-12-04', 'Moyenne: 10.07/20', 'uploads/SEBBIHI_Fadi.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(81, 2, 'CHAREF Wassim', '2012-07-14', 'Moyenne: 17.88/20', 'uploads/CHAREF_Wassim.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(82, 2, 'CHACHA Aya', '2012-04-14', 'Moyenne: 11.18/20', 'uploads/CHACHA_Aya.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(83, 2, 'CHEBLI Rim', '2011-08-20', 'Moyenne: 12.97/20', 'uploads/CHEBLI_Rim.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(84, 2, 'CHEBLI Abdel Moukim', '2012-09-28', 'Moyenne: 11.65/20', 'uploads/CHEBLI_Abdel_Moukim.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(85, 2, 'TALBI Koussai', '2012-12-19', 'Moyenne: 11.30/20', 'uploads/TALBI_Koussai.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(86, 2, 'ARAB Malem', '2012-08-08', 'Moyenne: 15.30/20', 'uploads/ARAB_Malem.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(87, 2, 'ARAR Djana', '2012-08-16', 'Moyenne: 11.12/20', 'uploads/ARAR_Djana.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(88, 2, 'ARAR Yahia Abdel Moumene', '2010-07-10', 'Redoublant - Moyenne précédente: 8.64/20', 'uploads/ARAR_Yahia_Abdel_Moumene.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(89, 2, 'AMIROUCHE Mohamed', '2010-10-30', 'Moyenne: 10.00/20', 'uploads/AMIROUCHE_Mohamed.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(90, 2, 'FENINECHE Mouloud Amine', '2010-12-03', 'Moyenne: 17.66/20', 'uploads/FENINECHE_Mouloud_Amine.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(91, 2, 'FOUNES Mohamed', '2012-04-12', 'Moyenne: 16.93/20', 'uploads/FOUNES_Mohamed.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(92, 2, 'GHESSOUM Malak', '2012-05-23', 'Moyenne: 10.62/20', 'uploads/GHESSOUM_Malak.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(93, 2, 'KAHOUL Nadjib Med Yacine', '2010-08-10', 'Redoublant - Moyenne précédente: 9.47/20', 'uploads/KAHOUL_Nadjib_Med_Yacine.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(94, 2, 'KAROUCHE Assil', '2012-04-09', 'Moyenne: 10.45/20', 'uploads/KAROUCHE_Assil.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(95, 2, 'KERAIBAH Hedayet Takwa', '2012-12-17', 'Moyenne: 15.29/20', 'uploads/KERAIBAH_Hedayet_Takwa.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(96, 2, 'MADI Maram', '2012-08-29', 'Moyenne: 16.38/20', 'uploads/MADI_Maram.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(97, 2, 'MACHHOUK Ines', '2013-01-22', 'Moyenne: 9.78/20', 'uploads/MACHHOUK_Ines.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(98, 2, 'MATTRAH Soulef', '2010-12-23', 'Moyenne: 10.36/20', 'uploads/MATTRAH_Soulef.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(99, 2, 'OUNISSI Iyed Abdel Rahmene', '2012-01-04', 'Moyenne: 10.07/20', 'uploads/OUNISSI_Iyed_Abdel_Rahmene.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(100, 3, 'BAZA Lamis', '2012-09-27', 'Moyenne: 6.72/20', 'uploads/BAZA_Lamis.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(101, 3, 'BEN BERGHOUTH Abdou', '2014-05-18', 'Moyenne: 8.79/20', 'uploads/BEN_BERGHOUTH_Abdou.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(102, 3, 'BEMEDIENNE Asma', '2013-09-01', 'Moyenne: 9.85/20', 'uploads/BEMEDIENNE_Asma.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(103, 3, 'DJEDOU Ishak Haroune', '2014-10-13', 'Moyenne: 6.68/20', 'uploads/DJEDOU_Ishak_Haroune.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(104, 3, 'HADED Dourssaf Djououria', '2014-05-04', 'Moyenne: 9.08/20', 'uploads/HADED_Dourssaf_Djououria.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(105, 3, 'HADED Fadi Abdel Monihem', '2014-04-28', 'Moyenne: 8.99/20', 'uploads/HADED_Fadi_Abdel_Monihem.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(106, 3, 'HELIMET Anes El Oudjoud', '2014-06-16', 'Moyenne: 8.23/20', 'uploads/HELIMET_Anes_El_Oudjoud.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(107, 3, 'HEMRICHE Abdel Mouemin', '2013-11-26', 'Redoublant - Moyenne précédente: 7.16/20', 'uploads/HEMRICHE_Abdel_Mouemin.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(108, 3, 'HAMOUDI Faissal Yahia', '2012-06-23', 'Moyenne: 9.79/20', 'uploads/HAMOUDI_Faissal_Yahia.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(109, 3, 'HAMOUCHE Meriem', '2015-02-05', 'Moyenne: 9.72/20', 'uploads/HAMOUCHE_Meriem.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(110, 3, 'KHALFOUNE Khalil Imad', '2013-03-12', 'Moyenne: 9.49/20', 'uploads/KHALFOUNE_Khalil_Imad.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(111, 3, 'DAOUED Abel Rahim', '2014-09-29', 'Moyenne: 9.42/20', 'uploads/DAOUED_Abel_Rahim.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(112, 3, 'DILMI Tasnim', '2014-07-31', 'Moyenne: 7.77/20', 'uploads/DILMI_Tasnim.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(113, 3, 'THOUIBI Iyed Mohamed', '2012-11-25', 'Moyenne: 5.85/20', 'uploads/THOUIBI_Iyed_Mohamed.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(114, 3, 'ZAGHOUEL Mohamed Ahmed', '2014-03-29', 'Moyenne: 8.04/20', 'uploads/ZAGHOUEL_Mohamed_Ahmed.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(115, 3, 'ZIADI Taouba Nour El Yakine', '2014-05-28', 'Moyenne: 6.13/20', 'uploads/ZIADI_Taouba_Nour_El_Yakine.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(116, 3, 'ZITOUNI Anes Said', '2014-04-09', 'Moyenne: 9.60/20', 'uploads/ZITOUNI_Anes_Said.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(117, 3, 'ZIDENE Med Ishak', '2014-09-17', 'Moyenne: 9.59/20', 'uploads/ZIDENE_Med_Ishak.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(118, 3, 'SAALMI Ala', '2012-02-18', 'Redoublant - Moyenne précédente: 3.02/20', 'uploads/SAALMI_Ala.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(119, 3, 'SEFARI Ibrahim', '2014-07-23', 'Moyenne: 9.14/20', 'uploads/SEFARI_Ibrahim.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(120, 3, 'SEFARI Tasnim', '2012-05-02', 'Moyenne: 6.60/20', 'uploads/SEFARI_Tasnim.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(121, 3, 'SEFARI Yasser', '2014-02-12', 'Moyenne: 8.07/20', 'uploads/SEFARI_Yasser.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(122, 3, 'CHEGOU Ishak', '2013-10-13', 'Moyenne: 7.04/20', 'uploads/CHEGOU_Ishak.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(123, 3, 'Chououew Iyed Mouatez', '2013-12-05', 'Redoublant - Moyenne précédente: 9.78/20', 'uploads/Chououew_Iyed_Mouatez.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(124, 3, 'ARAB Hanene', '2010-03-06', 'Moyenne: 8.17/20', 'uploads/ARAB_Hanene.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(125, 3, 'ARAB Maroua', '2014-06-27', 'Moyenne: 5.72/20', 'uploads/ARAB_Maroua.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(126, 3, 'ARAR Rahaf', '2014-01-15', 'Moyenne: 7.28/20', 'uploads/ARAR_Rahaf.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(127, 3, 'ATAFFi Meriem Amani', '2014-06-12', 'Moyenne: 7.58/20', 'uploads/ATAFFi_Meriem_Amani.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(128, 3, 'GHEBRID Bourhene Dhiaa', '2011-07-06', 'Redoublant - Moyenne précédente: 7.29/20', 'uploads/GHEBRID_Bourhene_Dhiaa.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(129, 3, 'GHARZOUL Abdel Samad', '2014-09-15', 'Moyenne: 8.80/20', 'uploads/GHARZOUL_Abdel_Samad.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(130, 3, 'GHAMOUD Malek', '2012-05-31', 'Redoublant - Moyenne précédente: 8.28/20', 'uploads/GHAMOUD_Malek.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(131, 3, 'FENINECHE kosai', '2012-04-23', 'Redoublant - Moyenne précédente: 6.14/20', 'uploads/FENINECHE_kosai.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(132, 3, 'KASSEMI El Mahdi Zain', '2013-09-20', 'Moyenne: 8.42/20', 'uploads/KASSEMI_El_Mahdi_Zain.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(133, 3, 'KOUHIL Med Amdjad', NULL, NULL, 'uploads/KOUHIL_Med_Amdjad.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(134, 3, 'KERHICHE Khadidja', '2014-06-26', 'Moyenne: 6.87/20', 'uploads/KERHICHE_Khadidja.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(135, 3, 'GHERNANI Abdel Hay', '2013-12-06', 'Moyenne: 5.74/20', 'uploads/GHERNANI_Abdel_Hay.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(136, 3, 'KAROUCHE Yahia', '2014-06-07', 'Moyenne: 8.30/20', 'uploads/KAROUCHE_Yahia.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(137, 3, 'KOUHIL Ritedj', '2012-05-04', 'Moyenne: 5.41/20', 'uploads/KOUHIL_Ritedj.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(138, 3, 'LABBAD Bouthaina', '2014-08-03', 'Moyenne: 8.62/20', 'uploads/LABBAD_Bouthaina.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(139, 3, 'MABROUK Med Amine', '2013-06-01', 'Moyenne: 8.28/20', 'uploads/MABROUK_Med_Amine.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(140, 3, 'MEZAACHE Djoumana', '2014-06-27', 'Moyenne: 8.59/20', 'uploads/MEZAACHE_Djoumana.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(141, 3, 'MESAI Mohamed', '2014-09-06', 'Moyenne: 7.22/20', 'uploads/MESAI_Mohamed.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(142, 3, 'MIMOUNE Oussama', '2011-07-13', 'Moyenne: 9.16/20', 'uploads/MIMOUNE_Oussama.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(143, 3, 'NAILI Abed', '2014-04-19', 'Moyenne: 9.52/20', 'uploads/NAILI_Abed.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(144, 3, 'NOUREDDINE Tadj Eddine', '2014-03-17', 'Moyenne: 6.02/20', 'uploads/NOUREDDINE_Tadj_Eddine.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(145, 3, 'NIOUANE Asma', '2014-03-17', 'Moyenne: 6.29/20', 'uploads/NIOUANE_Asma.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(146, 3, 'HARADA Ishak', '2011-01-10', 'Redoublant - Moyenne précédente: 6.37/20', 'uploads/HARADA_Ishak.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(147, 3, 'OUAZENE Walid', NULL, NULL, 'uploads/OUAZENE_Walid.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(148, 4, 'ELBAR Med Iyed', '2014-01-11', 'Moyenne: 8.21/20', 'uploads/ELBAR_Med_Iyed.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(149, 4, 'BEKIS Yasser', '2014-10-14', 'Moyenne: 9.19/20', 'uploads/BEKIS_Yasser.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(150, 4, 'BELAID Med Abd Erezek', '2010-02-02', 'Redoublant - Moyenne précédente: 9.17/20', 'uploads/BELAID_Med_Abd_Erezek.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(151, 4, 'BEN NAIDJA Nidhal', '2014-04-01', 'Moyenne: 7.23/20', 'uploads/BEN_NAIDJA_Nidhal.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(152, 4, 'BEN YAHIA Wail', '2015-03-14', 'Moyenne: 9.52/20', 'uploads/BEN_YAHIA_Wail.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(153, 4, 'BOUKHACHEBA Ishak', '2013-10-20', 'Moyenne: 6.59/20', 'uploads/BOUKHACHEBA_Ishak.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(154, 4, 'BOUKHACHEBA Chaima', '2014-04-06', 'Moyenne: 5.64/20', 'uploads/BOUKHACHEBA_Chaima.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(155, 4, 'BOURDIM Iyed Abdel Illah', '2014-03-04', 'Moyenne: 6.50/20', 'uploads/BOURDIM_Iyed_Abdel_Illah.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(156, 4, 'BOUGHERARA Ritedj', '2014-03-09', 'Moyenne: 8.29/20', 'uploads/BOUGHERARA_Ritedj.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(157, 4, 'BOUYAHIA Med Louai', '2012-11-02', 'Redoublant - Moyenne précédente: 5.98/20', 'uploads/BOUYAHIA_Med_Louai.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(158, 4, 'BOUYAHIA Khalil', '2014-12-09', 'Moyenne: 6.70/20', 'uploads/BOUYAHIA_Khalil.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(159, 4, 'TENOUTIT Ritadj', '2014-04-20', 'Moyenne: 7.28/20', 'uploads/TENOUTIT_Ritadj.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(160, 4, 'DJEFAL Aroua', '2014-05-17', 'Moyenne: 9.95/20', 'uploads/DJEFAL_Aroua.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(161, 4, 'HARCHE Rimas', '2013-04-06', 'Redoublant - Moyenne précédente: 8.14/20', 'uploads/HARCHE_Rimas.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(162, 4, 'HADED Rahma', '2014-09-28', 'Redoublant - Moyenne précédente: 8.01/20', 'uploads/HADED_Rahma.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(163, 4, 'KHOUDIR SAFI Eddine', '2011-09-27', 'Redoublant - Moyenne précédente: 8.33/20', 'uploads/KHOUDIR_SAFI_Eddine.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(164, 4, 'DAHMENE Daoued', '2011-07-23', 'Redoublant - Moyenne précédente: 9.19/20', 'uploads/DAHMENE_Daoued.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(165, 4, 'DERIDI Anes', '2011-11-08', 'Moyenne: 7.34/20', 'uploads/DERIDI_Anes.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(166, 4, 'DEGHOUL Anis', '2014-07-23', 'Moyenne: 8.36/20', 'uploads/DEGHOUL_Anis.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(167, 4, 'DEGHDEGH Ines Sofia', '2014-02-15', 'Moyenne: 9.60/20', 'uploads/DEGHDEGH_Ines_Sofia.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(168, 4, 'THOUIBI Maria', '2014-02-17', 'Moyenne: 8.83/20', 'uploads/THOUIBI_Maria.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(169, 4, 'RADOUANE Saliha', '2013-02-07', 'Redoublant - Moyenne précédente: 9.65/20', 'uploads/RADOUANE_Saliha.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(170, 4, 'ZERARI Aouis', '2013-10-27', 'Moyenne: 7.57/20', 'uploads/ZERARI_Aouis.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(171, 4, 'ZIDANE Anhar', '2014-07-08', 'Moyenne: 9.42/20', 'uploads/ZIDANE_Anhar.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(172, 4, 'SARSSOUB Meriem', '2014-07-21', 'Moyenne: 8.57/20', 'uploads/SARSSOUB_Meriem.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(173, 4, 'CHEBLI Ayham Moatassam Billah', '2013-11-25', 'Moyenne: 5.33/20', 'uploads/CHEBLI_Ayham_Moatassam_Billah.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(174, 4, 'CHEOUIA Fatma Ezahra', '2014-03-07', 'Moyenne: 9.07/20', 'uploads/CHEOUIA_Fatma_Ezahra.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(175, 4, 'TOUCHANE Fouad', '2009-06-01', 'Redoublant - Moyenne précédente: 7.11/20', 'uploads/TOUCHANE_Fouad.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(176, 4, 'ABDEL Aziz Anouar', '2011-12-24', 'Moyenne: 6.12/20', 'uploads/ABDEL_Aziz_Anouar.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(177, 4, 'ABDEL NOURI Ahmed', '2014-05-07', 'Moyenne: 8.98/20', 'uploads/ABDEL_NOURI_Ahmed.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(178, 4, 'ALOUECHE Yakoub', '2012-12-14', 'Moyenne: 6.32/20', 'uploads/ALOUECHE_Yakoub.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(179, 4, 'ANENE Maroua', '2014-06-12', 'Moyenne: 9.21/20', 'uploads/ANENE_Maroua.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(180, 4, 'GHETTAL Abdellah', '2012-05-04', 'Redoublant - Moyenne précédente: 9.76/20', 'uploads/GHETTAL_Abdellah.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(181, 4, 'LAOUZ Maria', '2014-11-12', 'Moyenne: 8.37/20', 'uploads/LAOUZ_Maria.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(182, 4, 'GHAHTAR Abel Ouadoud', '2014-03-02', 'Moyenne: 8.55/20', 'uploads/GHAHTAR_Abel_Ouadoud.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(183, 4, 'KASSAS Ahmed Taki Eddine', '2014-09-19', NULL, 'uploads/KASSAS_Ahmed_Taki_Eddine.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(184, 4, 'GUIDOUM Mohamed', '2012-08-28', 'Redoublant - Moyenne précédente: 8.06/20', 'uploads/GUIDOUM_Mohamed.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(185, 4, 'KEMACHE Islam', '2014-03-13', 'Redoublant - Moyenne précédente: 9.48/20', 'uploads/KEMACHE_Islam.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(186, 4, 'KANOUNI Mouadh', '2014-11-22', 'Moyenne: 9.62/20', 'uploads/KANOUNI_Mouadh.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(187, 4, 'LAAMOURI Khaouthar', '2013-03-22', 'Redoublant - Moyenne précédente: 8.88/20', 'uploads/LAAMOURI_Khaouthar.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(188, 4, 'MERABTI Abdel Rahmene', '2015-02-15', 'Moyenne: 5.81/20', 'uploads/MERABTI_Abdel_Rahmene.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(189, 4, 'MESSAOUD Salem Amer', '2014-04-09', 'Moyenne: 7.83/20', 'uploads/MESSAOUD_Salem_Amer.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(190, 4, 'MAHOUCHE Khadidja', '2014-04-13', 'Moyenne: 6.20/20', 'uploads/MAHOUCHE_Khadidja.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(191, 4, 'MANOUR Laamri', '2013-09-06', 'Redoublant - Moyenne précédente: 8.91/20', 'uploads/MANOUR_Laamri.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(192, 4, 'MAHOUR BACHA Abdou', '2014-12-15', 'Moyenne: 5.74/20', 'uploads/MAHOUR_BACHA_Abdou.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(193, 4, 'NEOUAR Nihal', '2014-10-16', 'Moyenne: 6.65/20', 'uploads/NEOUAR_Nihal.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(194, 4, 'HANI Anfel', '2014-04-13', 'Moyenne: 7.48/20', 'uploads/HANI_Anfel.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40'),
(195, 4, 'HELAL Farah', NULL, NULL, 'uploads/HELAL_Farah.jpg', 0, 0, 0, 0, 0, 0, NULL, NULL, '2026-04-02 14:31:40', '2026-04-02 14:31:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_students_class` (`class_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=196;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `fk_students_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

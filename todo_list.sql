-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 03, 2021 at 06:28 AM
-- Server version: 10.4.18-MariaDB
-- PHP Version: 8.0.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `todo_list`
--

-- --------------------------------------------------------

--
-- Table structure for table `tdl_main_project`
--

CREATE TABLE `tdl_main_project` (
  `mp_id` int NOT NULL AUTO_INCREMENT,
  `mp_u_fk` int NOT NULL,
  `mp_status` tinyint NOT NULL,
  `mp_title` varchar(100) NOT NULL,
  `mp_desc` text DEFAULT NULL,
  `mp_deadline` datetime NOT NULL,
  `mp_photo` blob DEFAULT NULL,
  `mp_created_at` datetime NOT NULL,
  `mp_updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tdl_tasks`
--

CREATE TABLE `tdl_tasks` (
  `t_id` int NOT NULL AUTO_INCREMENT,
  `t_mp_fk` int NOT NULL,
  `t_status` varchar(5) NOT NULL,
  `t_deadline` datetime NOT NULL,
  `t_title` varchar(100) NOT NULL,
  `t_desc` text DEFAULT NULL,
  `t_created_at` datetime NOT NULL,
  `t_updated_at` datetime DEFAULT NULL,
  `t_u_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tdl_user_accounts`
--

CREATE TABLE `tdl_user_accounts` (
  `u_id` int NOT NULL AUTO_INCREMENT,
  `u_role` varchar(5) NOT NULL,
  `u_email` varchar(100) NOT NULL,
  `u_password` varchar(100) NOT NULL,
  `u_full_name` varchar(100) NOT NULL,
  `u_last_login` datetime DEFAULT NULL,
  `u_last_logout` datetime DEFAULT NULL,
  `u_created_at` datetime NOT NULL,
  `u_status` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS auth_token (
  atoken_id VARCHAR(100) NOT NULL,
  customer_id INT NOT NULL,
  atoken_device VARCHAR(200) NOT NULL,
  atoken_platform VARCHAR(200) NOT NULL,
  atoken_access VARCHAR(200) NOT NULL,
  atoken_status VARCHAR(10) NOT NULL,
  atoken_refresh VARCHAR(200) NOT NULL,
  expired_date TIMESTAMP NOT NULL,
  created_date TIMESTAMP NOT NULL,
  updated_date TIMESTAMP NOT NULL,
  PRIMARY KEY (atoken_id)
);

--
-- Indexes for table `tdl_main_project`
--
ALTER TABLE `tdl_main_project`
  ADD PRIMARY KEY (`mp_id`),
  ADD KEY `mp_u_fk` (`mp_u_fk`);

--
-- Indexes for table `tdl_tasks`
--
ALTER TABLE `tdl_tasks`
  ADD PRIMARY KEY (`t_id`),
  ADD KEY `t_mp_fk` (`t_mp_fk`);

--
-- Indexes for table `tdl_user_accounts`
--
ALTER TABLE `tdl_user_accounts`
  ADD PRIMARY KEY (`u_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tdl_main_project`
--
ALTER TABLE `tdl_main_project`
  MODIFY `mp_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tdl_tasks`
--
ALTER TABLE `tdl_tasks`
  MODIFY `t_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tdl_user_accounts`
--
ALTER TABLE `tdl_user_accounts`
  MODIFY `u_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tdl_main_project`
--
ALTER TABLE `tdl_main_project`
  ADD CONSTRAINT `tdl_main_project_ibfk_1` FOREIGN KEY (`mp_u_fk`) REFERENCES `tdl_user_accounts` (`u_id`);

--
-- Constraints for table `tdl_tasks`
--
ALTER TABLE `tdl_tasks`
  ADD CONSTRAINT `tdl_tasks_ibfk_1` FOREIGN KEY (`t_mp_fk`) REFERENCES `tdl_user_accounts` (`u_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

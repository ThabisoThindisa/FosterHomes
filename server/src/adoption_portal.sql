-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 07, 2026 at 05:30 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `adoption_portal`
--

-- --------------------------------------------------------

--
-- Table structure for table `adoption_applications`
--

CREATE TABLE `adoption_applications` (
  `application_id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `social_worker_id` int(11) DEFAULT NULL,
  `program_id` int(11) DEFAULT NULL,
  `application_date` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('submitted','under_review','assessment','approved','matched','completed','rejected','withdrawn') NOT NULL DEFAULT 'submitted',
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adoption_matches`
--

CREATE TABLE `adoption_matches` (
  `match_id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `child_id` int(11) NOT NULL,
  `match_date` date NOT NULL,
  `status` enum('proposed','accepted','declined','completed') NOT NULL DEFAULT 'proposed',
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adoption_programs`
--

CREATE TABLE `adoption_programs` (
  `program_id` int(11) NOT NULL,
  `ad_name` varchar(150) NOT NULL,
  `ad_description` text NOT NULL,
  `ad_eligibility_requirements` text DEFAULT NULL,
  `ad_is_active` tinyint(1) NOT NULL DEFAULT 1,
  `ad_created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `adoption_programs`
--

INSERT INTO `adoption_programs` (`program_id`, `ad_name`, `ad_description`, `ad_eligibility_requirements`, `ad_is_active`, `ad_created_at`) VALUES
(1, 'Domestic Adoption Programme', 'A programme supporting eligible individuals and families through the domestic adoption process.', 'Applicants must meet the applicable legal, social and financial requirements and complete the required assessment process.', 1, '2026-09-20 14:44:21'),
(2, 'Foster-to-Adopt Programme', 'A programme for approved foster caregivers who may become eligible to adopt a child in their care.', 'Applicants must be approved foster caregivers and complete the required adoption assessment.', 1, '2026-09-20 14:44:21'),
(9, 'Meet ups', 'Trust building and communication', 'First time adoption', 1, '2026-09-23 21:54:38'),
(24, 'aa', 'aa', 'aa', 1, '2026-09-25 15:07:17'),
(25, 'test', 'test', 'aaa', 1, '2026-09-25 15:50:18'),
(26, 'sun', 'sun', 'aaaaa', 1, '2026-09-28 13:32:54');

-- --------------------------------------------------------

--
-- Table structure for table `applicants`
--

CREATE TABLE `applicants` (
  `applicant_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `s_marital_status` varchar(50) DEFAULT NULL,
  `s_occupation` varchar(150) DEFAULT NULL,
  `s_address` text DEFAULT NULL,
  `s_adoption_preferences` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applicants`
--

INSERT INTO `applicants` (`applicant_id`, `user_id`, `s_marital_status`, `s_occupation`, `s_address`, `s_adoption_preferences`) VALUES
(1, 11, NULL, NULL, NULL, NULL),
(3, 13, NULL, NULL, NULL, NULL),
(5, 15, NULL, NULL, NULL, NULL),
(7, 19, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `application_documents`
--

CREATE TABLE `application_documents` (
  `document_id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `document_type` varchar(100) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `uploaded_at` datetime NOT NULL DEFAULT current_timestamp(),
  `verification_status` enum('pending','verified','rejected') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `appointment_id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `social_worker_id` int(11) NOT NULL,
  `appointment_date` datetime NOT NULL,
  `appointment_type` varchar(100) DEFAULT NULL,
  `status` enum('requested','confirmed','completed','cancelled') NOT NULL DEFAULT 'requested',
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `children`
--

CREATE TABLE `children` (
  `child_id` int(11) NOT NULL,
  `c_reference_code` varchar(50) NOT NULL,
  `c_Fullname` varchar(300) NOT NULL,
  `c_date_of_birth` date DEFAULT NULL,
  `c_gender` varchar(30) DEFAULT NULL,
  `status` enum('in_care','eligible_for_adoption','matched','adopted','reunified') NOT NULL DEFAULT 'in_care',
  `special_needs` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `children`
--

INSERT INTO `children` (`child_id`, `c_reference_code`, `c_Fullname`, `c_date_of_birth`, `c_gender`, `status`, `special_needs`, `created_at`) VALUES
(1, 'A33', 'Thabiso', '2025-12-16', 'Male', 'in_care', 'yes', '2026-10-06 21:07:26'),
(2, 'B33', 'love', '2026-10-01', 'Male', 'in_care', 'no', '2026-10-06 21:45:25');

-- --------------------------------------------------------

--
-- Table structure for table `enquiries`
--

CREATE TABLE `enquiries` (
  `enquiry_id` int(11) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('new','in_progress','resolved') NOT NULL DEFAULT 'new',
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fosterhomes`
--

CREATE TABLE `fosterhomes` (
  `foster_home_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `fh_name` varchar(150) NOT NULL,
  `fh_address` text NOT NULL,
  `fh_contact_number` varchar(20) DEFAULT NULL,
  `fh_email` varchar(255) DEFAULT NULL,
  `fh_capacity` int(11) NOT NULL DEFAULT 1,
  `fh_available_spaces` int(11) NOT NULL DEFAULT 1,
  `fh_status` enum('pending','approved','rejected','inactive') NOT NULL DEFAULT 'pending',
  `fh_created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fosterhomes`
--

INSERT INTO `fosterhomes` (`foster_home_id`, `user_id`, `fh_name`, `fh_address`, `fh_contact_number`, `fh_email`, `fh_capacity`, `fh_available_spaces`, `fh_status`, `fh_created_at`) VALUES
(1, 12, 'Hope Foster Home', 'Pretoria, Gauteng', '0712345678', 'hope@example.com', 5, 3, 'approved', '2026-09-29 17:48:56'),
(2, 13, 'Sunshine Care Home', 'Johannesburg, Gauteng', '0723456789', 'sunshine@example.com', 8, 4, 'approved', '2026-09-29 17:48:56'),
(3, 15, 'Little Angels Foster Home', 'Polokwane, Limpopo', '0734567890', 'angels@example.com', 6, 2, 'pending', '2026-09-29 17:48:56'),
(4, 12, 'New Beginnings Home', 'Centurion, Gauteng', '0745678901', 'beginnings@example.com', 4, 1, 'approved', '2026-09-29 17:48:56'),
(5, 13, 'Bright Future Foster Home', 'Mbombela, Mpumalanga', '0756789012', 'brightfuture@example.com', 10, 6, 'approved', '2026-09-29 17:48:56'),
(6, 15, 'Safe Haven Foster Home', 'Rustenburg, North West', '0767890123', 'safehaven@example.com', 7, 3, 'pending', '2026-09-29 17:48:56'),
(7, 12, 'Rainbow Foster Home', 'Tzaneen, Limpopo', '0789012345', 'rainbow@example.com', 5, 0, 'inactive', '2026-09-29 17:48:56'),
(8, 13, 'Peaceful Hearts Home', 'Bloemfontein, Free State', '0790123456', 'peaceful@example.com', 9, 5, 'approved', '2026-09-29 17:48:56'),
(9, 15, 'Caring Hands Foster Home', 'Kimberley, Northern Cape', '0801234567', 'caringhands@example.com', 6, 2, 'rejected', '2026-09-29 17:48:56'),
(10, 12, 'Golden Hope Foster Home', 'Durban, KwaZulu-Natal', '0812345678', 'goldenhope@example.com', 8, 3, 'approved', '2026-09-29 17:48:56');

-- --------------------------------------------------------

--
-- Table structure for table `gallery`
--

CREATE TABLE `gallery` (
  `id` int(11) NOT NULL,
  `image_data` longblob NOT NULL,
  `image_type` varchar(100) NOT NULL,
  `alt_text` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gallery`
--

INSERT INTO `gallery` (`id`, `image_data`, `image_type`, `alt_text`) VALUES
(1, 0x2f75706c6f6164732f64656637623631392d313961322d343765332d393138622d3263396630323165316130652e6a7067, 'image/jpeg', 'aaaa');

-- --------------------------------------------------------

--
-- Table structure for table `ourstories`
--

CREATE TABLE `ourstories` (
  `Story_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ourstories`
--

INSERT INTO `ourstories` (`Story_id`, `title`, `content`, `author_id`, `published_at`, `is_published`) VALUES
(2, 'Preparing Your Home for Adoption', 'Creating a safe, welcoming, and stable home environment is an important part of preparing for adoption. Prospective adoptive parents should consider the child\'s physical, emotional, educational, and social needs.', 4, '2026-02-03 10:30:00', 1),
(4, 'Supporting Children Through Transition', 'Children going through the adoption process may experience a range of emotions. Families can help by providing reassurance, consistency, patience, and age-appropriate communication throughout the transition.', 4, '2026-04-18 11:00:00', 1),
(6, 'New Adoption Support Resources', 'Our adoption support resources have been expanded to provide applicants and families with additional information about preparing for adoption and supporting children before and after placement.', 4, '2026-06-12 13:00:00', 1),
(8, 'Upcoming Adoption Awareness Event', 'Our organisation will be hosting an adoption awareness event to provide information about adoption and connect prospective applicants with adoption professionals.', 4, '2026-08-15 12:00:00', 1),
(9, 'Running cat', 'today', NULL, '2026-10-05 16:57:40', 1);

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `service_id` int(11) NOT NULL,
  `s_service_name` varchar(150) NOT NULL,
  `s_description` text NOT NULL,
  `s_contact_email` varchar(255) DEFAULT NULL,
  `s_contact_phone` varchar(20) DEFAULT NULL,
  `s_created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `social_workers`
--

CREATE TABLE `social_workers` (
  `social_worker_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `s_registration_number` varchar(100) NOT NULL,
  `s_organisation_name` varchar(200) DEFAULT NULL,
  `s_office_location` varchar(255) DEFAULT NULL,
  `s_specialisation` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `social_workers`
--

INSERT INTO `social_workers` (`social_worker_id`, `user_id`, `s_registration_number`, `s_organisation_name`, `s_office_location`, `s_specialisation`) VALUES
(1, 3, 'SACSSP-2021-00456', 'Hope Family Services', 'Johannesburg, Gauteng', 'Child Adoption and Foster Care'),
(2, 4, 'SACSSP-2022-00781', 'Family Support Network', 'Pretoria, Gauteng', 'Family Counselling and Child Welfare');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `u_full_name` varchar(150) NOT NULL,
  `u_BirthID` varchar(255) NOT NULL,
  `u_email` varchar(255) NOT NULL,
  `u_password_hash` varchar(255) NOT NULL,
  `u_phone` varchar(20) DEFAULT NULL,
  `u_role` enum('admin','social_worker','adoptive_parent','birth_parent') NOT NULL DEFAULT 'adoptive_parent',
  `u_is_active` tinyint(1) NOT NULL DEFAULT 1,
  `u_created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `u_full_name`, `u_BirthID`, `u_email`, `u_password_hash`, `u_phone`, `u_role`, `u_is_active`, `u_created_at`) VALUES
(3, 'Sipho Dlamini', '8205205300089', 'sipho.dlamini@example.com', '$2b$10$ExampleHash003', '0734567890', 'social_worker', 1, '2026-09-19 13:13:09'),
(4, 'Lerato Maseko', '8807154200082', 'lerato.maseko@example.com', '$2b$10$ExampleHash004', '0745678901', 'social_worker', 1, '2026-09-19 13:13:09'),
(11, 'thabiso', '1111111111111', 'thabisothindisa1@gmail.com', '$2a$12$AjIFo1rWNP9z64SreBTCIOoVA15K1ox4wE5/QHY73pvUc4Awmkb1K', '0766547791', 'admin', 1, '2026-09-19 14:47:16'),
(12, '3', '444', 't@gmail.com', '$2a$12$lxbjHWWH6dQDkeO/nb9YA.df3u3z3kY8VT19FmmB5LLnJxWkkrZu6', NULL, 'adoptive_parent', 1, '2026-09-20 13:40:30'),
(13, 'test', '0000000000000', 'test@gmail.com', '$2a$12$UIWG5FxIXLyhwO5eZFSaSO5NP4/ALMeMS1KfxES.KZhu.orggCwW.', NULL, 'adoptive_parent', 1, '2026-09-23 18:11:21'),
(14, 'thabiso', '0006045560080', 'admin@gmail.com', '$2a$12$7EVRtIbgkbUyKzOY90KDJeiMWqgL/OZoJl/Qy4PD86m53vSXHCgbi', NULL, 'admin', 1, '2026-09-23 21:29:43'),
(15, 'vincent', '123456789101', 'vin@gmail.com', '$2a$12$E8SwS4zmvOkbmBfjGwwd/eZF07cPzgTk/zKhWWqvQkq6T69FgcQSW', NULL, 'adoptive_parent', 1, '2026-09-24 18:34:44'),
(16, 'vin', '8888888888888', 'vincet@gmail.com', '$2a$12$I/laZ6qpc5icwPJovjHDJeHhHELRgYOkvv7o7Ixo9/v6KmSKHXp3m', NULL, 'adoptive_parent', 1, '2026-09-29 16:29:14'),
(17, 'Thandiwe Mokoena', '9107245800086', 'thandiwe.mokoena@example.com', '$2b$10$ExampleHash020', '0756789012', 'social_worker', 1, '2026-10-05 16:10:51'),
(18, 'David Mthembu', '8909185200089', 'david.mthembu@example.com', '$2b$10$ExampleHash021', '0767890123', 'social_worker', 1, '2026-10-05 16:10:51'),
(19, 'Homes', '1234567899999', 'homes@gmail.com', '$2a$12$mzZqdt9XJeBMY6A/oA1ni.40IRNWYewxC6aFZAn5H4cU/6mRPzFGi', NULL, 'adoptive_parent', 1, '2026-10-07 08:26:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adoption_applications`
--
ALTER TABLE `adoption_applications`
  ADD PRIMARY KEY (`application_id`),
  ADD KEY `FK_Applications_Applicants` (`applicant_id`),
  ADD KEY `FK_Applications_SocialWorkers` (`social_worker_id`),
  ADD KEY `FK_Applications_Programs` (`program_id`);

--
-- Indexes for table `adoption_matches`
--
ALTER TABLE `adoption_matches`
  ADD PRIMARY KEY (`match_id`),
  ADD UNIQUE KEY `UQ_Matches_Application_Child` (`application_id`,`child_id`),
  ADD KEY `FK_Matches_Children` (`child_id`);

--
-- Indexes for table `adoption_programs`
--
ALTER TABLE `adoption_programs`
  ADD PRIMARY KEY (`program_id`);

--
-- Indexes for table `applicants`
--
ALTER TABLE `applicants`
  ADD PRIMARY KEY (`applicant_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `application_documents`
--
ALTER TABLE `application_documents`
  ADD PRIMARY KEY (`document_id`),
  ADD KEY `FK_Documents_Applications` (`application_id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`appointment_id`),
  ADD KEY `FK_Appointments_Applicants` (`applicant_id`),
  ADD KEY `FK_Appointments_SocialWorkers` (`social_worker_id`);

--
-- Indexes for table `children`
--
ALTER TABLE `children`
  ADD PRIMARY KEY (`child_id`),
  ADD UNIQUE KEY `c_reference_code` (`c_reference_code`);

--
-- Indexes for table `enquiries`
--
ALTER TABLE `enquiries`
  ADD PRIMARY KEY (`enquiry_id`);

--
-- Indexes for table `fosterhomes`
--
ALTER TABLE `fosterhomes`
  ADD PRIMARY KEY (`foster_home_id`),
  ADD KEY `FK_FosterHomes_Users` (`user_id`);

--
-- Indexes for table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ourstories`
--
ALTER TABLE `ourstories`
  ADD PRIMARY KEY (`Story_id`),
  ADD KEY `FK_News_Users` (`author_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`service_id`);

--
-- Indexes for table `social_workers`
--
ALTER TABLE `social_workers`
  ADD PRIMARY KEY (`social_worker_id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `s_registration_number` (`s_registration_number`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `u_BirthID` (`u_BirthID`),
  ADD UNIQUE KEY `u_email` (`u_email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adoption_applications`
--
ALTER TABLE `adoption_applications`
  MODIFY `application_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `adoption_matches`
--
ALTER TABLE `adoption_matches`
  MODIFY `match_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `adoption_programs`
--
ALTER TABLE `adoption_programs`
  MODIFY `program_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `applicants`
--
ALTER TABLE `applicants`
  MODIFY `applicant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `application_documents`
--
ALTER TABLE `application_documents`
  MODIFY `document_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `appointment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `children`
--
ALTER TABLE `children`
  MODIFY `child_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `enquiries`
--
ALTER TABLE `enquiries`
  MODIFY `enquiry_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fosterhomes`
--
ALTER TABLE `fosterhomes`
  MODIFY `foster_home_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ourstories`
--
ALTER TABLE `ourstories`
  MODIFY `Story_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `social_workers`
--
ALTER TABLE `social_workers`
  MODIFY `social_worker_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `adoption_applications`
--
ALTER TABLE `adoption_applications`
  ADD CONSTRAINT `FK_Applications_Applicants` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`applicant_id`),
  ADD CONSTRAINT `FK_Applications_Programs` FOREIGN KEY (`program_id`) REFERENCES `adoption_programs` (`program_id`),
  ADD CONSTRAINT `FK_Applications_SocialWorkers` FOREIGN KEY (`social_worker_id`) REFERENCES `social_workers` (`social_worker_id`);

--
-- Constraints for table `adoption_matches`
--
ALTER TABLE `adoption_matches`
  ADD CONSTRAINT `FK_Matches_Applications` FOREIGN KEY (`application_id`) REFERENCES `adoption_applications` (`application_id`),
  ADD CONSTRAINT `FK_Matches_Children` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`);

--
-- Constraints for table `applicants`
--
ALTER TABLE `applicants`
  ADD CONSTRAINT `FK_Applicants_Users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `application_documents`
--
ALTER TABLE `application_documents`
  ADD CONSTRAINT `FK_Documents_Applications` FOREIGN KEY (`application_id`) REFERENCES `adoption_applications` (`application_id`);

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `FK_Appointments_Applicants` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`applicant_id`),
  ADD CONSTRAINT `FK_Appointments_SocialWorkers` FOREIGN KEY (`social_worker_id`) REFERENCES `social_workers` (`social_worker_id`);

--
-- Constraints for table `fosterhomes`
--
ALTER TABLE `fosterhomes`
  ADD CONSTRAINT `FK_FosterHomes_Users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `social_workers`
--
ALTER TABLE `social_workers`
  ADD CONSTRAINT `FK_SocialWorkers_Users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 24, 2026 at 03:17 AM
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
(2, 'Foster-to-Adopt Programme', 'A programme for approved foster caregivers who may become eligible to adopt a child in their care.', 'Applicants must be approved foster caregivers and complete the required adoption assessment.', 1, '2026-09-20 14:44:21');

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
(2, 12, NULL, NULL, NULL, NULL),
(3, 13, NULL, NULL, NULL, NULL);

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
  `c_date_of_birth` date DEFAULT NULL,
  `c_gender` varchar(30) DEFAULT NULL,
  `status` enum('in_care','eligible_for_adoption','matched','adopted','reunified') NOT NULL DEFAULT 'in_care',
  `special_needs` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Table structure for table `gallery`
--

CREATE TABLE `gallery` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `file_upload` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gallery`
--

INSERT INTO `gallery` (`id`, `name`, `file_upload`) VALUES
(1, 'Family', '/images/medium-shot-parents-holding-baby.jpg'),
(2, 'Children', '/images/close-up-smiley-family-home.jpg'),
(3, 'Community Event', '/images/united-states-soldier-departing-from-his-family.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `news_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`news_id`, `title`, `content`, `author_id`, `published_at`, `is_published`) VALUES
(1, 'Understanding the Adoption Process', 'The adoption process involves several important steps, including an initial application, assessment, interviews, background checks, and approval. Applicants are encouraged to work closely with their social worker throughout the process.', 3, '2026-01-15 09:00:00', 1),
(2, 'Preparing Your Home for Adoption', 'Creating a safe, welcoming, and stable home environment is an important part of preparing for adoption. Prospective adoptive parents should consider the child\'s physical, emotional, educational, and social needs.', 4, '2026-02-03 10:30:00', 1),
(3, 'Adoption Information Session', 'Our upcoming information session will provide prospective applicants with an opportunity to learn more about adoption requirements, assessments, documentation, and the role of social workers.', 3, '2026-03-10 14:00:00', 1),
(4, 'Supporting Children Through Transition', 'Children going through the adoption process may experience a range of emotions. Families can help by providing reassurance, consistency, patience, and age-appropriate communication throughout the transition.', 4, '2026-04-18 11:00:00', 1),
(5, 'Frequently Asked Questions About Adoption', 'We have compiled answers to some of the most common questions about adoption applications, eligibility requirements, assessments, matching, and post-adoption support.', 3, '2026-05-06 09:30:00', 1),
(6, 'New Adoption Support Resources', 'Our adoption support resources have been expanded to provide applicants and families with additional information about preparing for adoption and supporting children before and after placement.', 4, '2026-06-12 13:00:00', 1),
(7, 'Preparing for Your Social Worker Assessment', 'Applicants can prepare for their social worker assessment by ensuring that their required documents are available and being prepared to discuss their family circumstances, living arrangements, and reasons for adopting.', 3, '2026-07-20 10:00:00', 1),
(8, 'Upcoming Adoption Awareness Event', 'Our organisation will be hosting an adoption awareness event to provide information about adoption and connect prospective applicants with adoption professionals.', 4, '2026-08-15 12:00:00', 1),
(9, 'Building Stable and Supportive Families', 'Stable family environments can help children develop a sense of security and belonging. Prospective adoptive parents are encouraged to learn about the needs of children and seek appropriate support when necessary.', 3, '2026-09-05 09:00:00', 1);

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
(11, 'thabiso', '0006045560080', 'thabisothindisa1@gmail.com', '$2a$12$AjIFo1rWNP9z64SreBTCIOoVA15K1ox4wE5/QHY73pvUc4Awmkb1K', '0766547791', 'admin', 1, '2026-09-19 14:47:16'),
(12, '3', '444', 't@gmail.com', '$2a$12$lxbjHWWH6dQDkeO/nb9YA.df3u3z3kY8VT19FmmB5LLnJxWkkrZu6', NULL, 'adoptive_parent', 1, '2026-09-20 13:40:30'),
(13, 'Admin', '0000000000000', 'admin@gmail.com', '$2a$12$UIWG5FxIXLyhwO5eZFSaSO5NP4/ALMeMS1KfxES.KZhu.orggCwW.', NULL, 'adoptive_parent', 1, '2026-09-23 18:11:21');

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
-- Indexes for table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`news_id`),
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
  MODIFY `program_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `applicants`
--
ALTER TABLE `applicants`
  MODIFY `applicant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `child_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enquiries`
--
ALTER TABLE `enquiries`
  MODIFY `enquiry_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `news_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `social_workers`
--
ALTER TABLE `social_workers`
  MODIFY `social_worker_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

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
-- Constraints for table `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `FK_News_Users` FOREIGN KEY (`author_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `social_workers`
--
ALTER TABLE `social_workers`
  ADD CONSTRAINT `FK_SocialWorkers_Users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

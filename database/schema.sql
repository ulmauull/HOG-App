-- ============================================================================
-- HOME OF GAMERS (HOG) — PC SESSION MANAGEMENT & BOOKING SYSTEM
-- Database Schema & Initial Data Seeder (MySQL 8.0+ / MariaDB 10.4+)
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `heartbeat_logs`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `pc_agents`;
DROP TABLE IF EXISTS `packages`;
DROP TABLE IF EXISTS `pcs`;
DROP TABLE IF EXISTS `admins`;
DROP TABLE IF EXISTS `system_settings`;
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. SYSTEM SETTINGS
-- ----------------------------------------------------------------------------
CREATE TABLE `system_settings` (
  `setting_key` VARCHAR(64) NOT NULL,
  `setting_value` TEXT NOT NULL,
  `setting_type` ENUM('string', 'integer', 'float', 'boolean', 'json') NOT NULL DEFAULT 'string',
  `description` VARCHAR(255) NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. ADMIN ACCOUNTS
-- ----------------------------------------------------------------------------
CREATE TABLE `admins` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(64) NOT NULL,
  `email` VARCHAR(128) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(128) NOT NULL,
  `role` ENUM('superadmin', 'operator', 'cashier') NOT NULL DEFAULT 'operator',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `last_login_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_admin_username` (`username`),
  UNIQUE KEY `idx_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. GAMING PCS (12 Registered Rigs)
-- ----------------------------------------------------------------------------
CREATE TABLE `pcs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pc_code` VARCHAR(16) NOT NULL,
  `room_type` ENUM('smoking', 'non-smoking') NOT NULL DEFAULT 'smoking',
  `specs_gpu` VARCHAR(128) NOT NULL DEFAULT 'RTX 4070 Ti 12GB',
  `specs_display` VARCHAR(128) NOT NULL DEFAULT '240Hz Fast IPS 0.5ms',
  `specs_peripherals` VARCHAR(128) NOT NULL DEFAULT 'Mechanical Keyboard & Optical Mouse',
  `is_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `default_duration_minutes` INT UNSIGNED NOT NULL DEFAULT 120,
  `current_session_id` INT UNSIGNED NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_pc_code` (`pc_code`),
  INDEX `idx_pc_room` (`room_type`),
  INDEX `idx_pc_status` (`is_enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. PC AGENTS (Windows Service Credentials & Telemetry)
-- ----------------------------------------------------------------------------
CREATE TABLE `pc_agents` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pc_id` INT UNSIGNED NOT NULL,
  `api_key_hash` VARCHAR(255) NOT NULL,
  `agent_version` VARCHAR(32) NOT NULL DEFAULT '1.0.0',
  `is_online` TINYINT(1) NOT NULL DEFAULT 0,
  `last_heartbeat_at` DATETIME NULL,
  `last_ip_address` VARCHAR(45) NULL,
  `health_status` VARCHAR(64) NOT NULL DEFAULT 'offline',
  `system_uptime_seconds` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_agent_pc` (`pc_id`),
  CONSTRAINT `fk_agent_pc` FOREIGN KEY (`pc_id`) REFERENCES `pcs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. BILLING PACKAGES
-- ----------------------------------------------------------------------------
CREATE TABLE `packages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `package_code` VARCHAR(32) NOT NULL,
  `name` VARCHAR(128) NOT NULL,
  `price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `duration_minutes` INT UNSIGNED NOT NULL DEFAULT 60,
  `start_time_limit` TIME NULL,
  `end_time_limit` TIME NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `description` TEXT NULL,
  `perks` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_package_code` (`package_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. CUSTOMERS
-- ----------------------------------------------------------------------------
CREATE TABLE `customers` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(128) NOT NULL,
  `phone` VARCHAR(32) NOT NULL,
  `email` VARCHAR(128) NULL,
  `steam_or_discord_id` VARCHAR(64) NULL,
  `notes` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_cust_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. BOOKINGS & RESERVATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE `bookings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_code` VARCHAR(32) NOT NULL,
  `customer_id` INT UNSIGNED NOT NULL,
  `pc_id` INT UNSIGNED NOT NULL,
  `room_type` ENUM('smoking', 'non-smoking') NOT NULL,
  `package_id` INT UNSIGNED NOT NULL,
  `booking_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `duration_minutes` INT UNSIGNED NOT NULL,
  `total_price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('pending_payment', 'confirmed', 'checked_in', 'cancelled', 'expired', 'completed') NOT NULL DEFAULT 'pending_payment',
  `grace_period_minutes` INT UNSIGNED NOT NULL DEFAULT 45,
  `checked_in_at` DATETIME NULL,
  `released_at` DATETIME NULL,
  `replacement_pc_id` INT UNSIGNED NULL,
  `notes` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_booking_code` (`booking_code`),
  INDEX `idx_booking_schedule` (`pc_id`, `booking_date`, `start_time`, `end_time`),
  INDEX `idx_booking_status` (`status`),
  CONSTRAINT `fk_booking_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `fk_booking_pc` FOREIGN KEY (`pc_id`) REFERENCES `pcs` (`id`),
  CONSTRAINT `fk_booking_package` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`),
  CONSTRAINT `fk_booking_replacement_pc` FOREIGN KEY (`replacement_pc_id`) REFERENCES `pcs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. PAYMENTS & PROOF VERIFICATION
-- ----------------------------------------------------------------------------
CREATE TABLE `payments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_id` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `payment_method` ENUM('qris', 'bca_va', 'mandiri_va', 'cash') NOT NULL DEFAULT 'qris',
  `payment_status` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
  `proof_image_path` VARCHAR(255) NULL,
  `verified_by_admin_id` INT UNSIGNED NULL,
  `verified_at` DATETIME NULL,
  `rejection_reason` VARCHAR(255) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_payment_booking` (`booking_id`),
  CONSTRAINT `fk_payment_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_payment_admin` FOREIGN KEY (`verified_by_admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 9. SESSIONS (Authoritative Timestamps for Rigs)
-- ----------------------------------------------------------------------------
CREATE TABLE `sessions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `session_code` VARCHAR(32) NOT NULL,
  `pc_id` INT UNSIGNED NOT NULL,
  `customer_id` INT UNSIGNED NULL,
  `booking_id` INT UNSIGNED NULL,
  `start_time` DATETIME NOT NULL,
  `scheduled_end_time` DATETIME NOT NULL,
  `actual_end_time` DATETIME NULL,
  `duration_minutes` INT UNSIGNED NOT NULL,
  `status` ENUM('active', 'extended', 'ended_manual', 'expired') NOT NULL DEFAULT 'active',
  `start_type` ENUM('agent_startup', 'walk_in', 'booking_checkin', 'admin_manual') NOT NULL DEFAULT 'agent_startup',
  `notes` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_session_code` (`session_code`),
  INDEX `idx_session_pc_status` (`pc_id`, `status`),
  INDEX `idx_session_time` (`start_time`, `scheduled_end_time`),
  CONSTRAINT `fk_session_pc` FOREIGN KEY (`pc_id`) REFERENCES `pcs` (`id`),
  CONSTRAINT `fk_session_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_session_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 10. HEARTBEAT LOGS (Telemetry)
-- ----------------------------------------------------------------------------
CREATE TABLE `heartbeat_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pc_id` INT UNSIGNED NOT NULL,
  `session_id` INT UNSIGNED NULL,
  `agent_version` VARCHAR(32) NOT NULL,
  `client_timestamp` DATETIME NOT NULL,
  `server_timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cpu_load_percent` FLOAT NULL,
  `ram_usage_mb` INT UNSIGNED NULL,
  `ping_ms` INT UNSIGNED NULL,
  `health_status` VARCHAR(64) NOT NULL DEFAULT 'ok',
  `ip_address` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_hb_pc_time` (`pc_id`, `server_timestamp`),
  CONSTRAINT `fk_hb_pc` FOREIGN KEY (`pc_id`) REFERENCES `pcs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 11. AUDIT LOGS
-- ----------------------------------------------------------------------------
CREATE TABLE `audit_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_id` INT UNSIGNED NULL,
  `actor_type` ENUM('admin', 'agent', 'system', 'customer') NOT NULL DEFAULT 'admin',
  `action` VARCHAR(64) NOT NULL,
  `entity_type` VARCHAR(64) NOT NULL,
  `entity_id` VARCHAR(64) NULL,
  `old_values` JSON NULL,
  `new_values` JSON NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_audit_entity` (`entity_type`, `entity_id`),
  INDEX `idx_audit_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- INITIAL SEED DATA
-- ============================================================================

-- 1. System Settings
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `setting_type`, `description`) VALUES
('heartbeat_interval_seconds', '15', 'integer', 'Interval agent mengirim heartbeat ke backend'),
('offline_threshold_seconds', '60', 'integer', 'Batas waktu PC dianggap offline jika tidak ada heartbeat'),
('default_grace_period_minutes', '45', 'integer', 'Toleransi keterlambatan check-in booking sebelum dilepas'),
('allow_walkin_instant', '1', 'boolean', 'Izinkan operator memulai sesi walk-in langsung'),
('auto_search_replacement_pc', '1', 'boolean', 'Cari PC pengganti otomatis di ruangan sama jika customer telat'),
('cafe_name', 'Home Of Gamers (HOG)', 'string', 'Nama arena warnet'),
('network_speed', '1 Gbps (Backup 500 Mbps)', 'string', 'Kecepatan internet resmi HOG'),
('free_download_policy', 'BEBAS DOWNLOAD GAME YANG KAMU MAU TANPA REQUEST DARI OPERATOR', 'string', 'Ketentuan bebas download game'),
('booking_whatsapp', '0878-7867-2111', 'string', 'Kontak WhatsApp resmi reservasi HOG'),
('min_booking_hours', '3', 'integer', 'Minimal reservasi booking PC via WhatsApp/Website');

-- 2. Default Admin (Password: Admin@HOG2025!)
INSERT INTO `admins` (`username`, `email`, `password_hash`, `full_name`, `role`) VALUES
('admin', 'admin@homeofgamers.id', '$2y$12$K1bV0d5rF.Vb4Zg7OQ/mxeI9L1rY7VwYI9ZzN5yB4wB3tG8tZ6kSe', 'HOG Chief Operator', 'superadmin');

-- 3. Exactly 12 Gaming PCs from Official HOG Specs Table
INSERT INTO `pcs` (`id`, `pc_code`, `room_type`, `specs_gpu`, `specs_display`, `specs_peripherals`, `default_duration_minutes`) VALUES
(1, 'PC-01', 'smoking', 'RTX 4060 Ti | i7 Gen 14', '360 (OC 390) Hz', 'Gamen III, MXRSKEY & Leobog A80 HE • Logitech G203/G102 • HyperX (FAN)', 180),
(2, 'PC-02', 'smoking', 'RTX 4060 Ti | i5 Gen 12', '300 Hz', 'Gamen III, MXRSKEY & Leobog A80 HE • Logitech G203/G102 • HyperX (FAN)', 180),
(3, 'PC-03', 'smoking', 'RX 6600 | i5 Gen 12', '240 (OC 270) Hz', 'Gamen III, MXRSKEY & Leobog A80 HE • Logitech G203/G102 • HyperX (FAN)', 180),
(4, 'PC-04', 'smoking', 'RTX 3070 | i5 Gen 12', '240 (OC 270) Hz', 'Gamen III, MXRSKEY & Leobog A80 HE • Logitech G203/G102 • HyperX (FAN)', 180),
(5, 'PC-05', 'smoking', 'RTX 4060 Ti | i5 Gen 12', '360 (OC 390) Hz', 'Gamen III, MXRSKEY & Leobog A80 HE • Logitech G203/G102 • HyperX (FAN)', 180),
(6, 'PC-06', 'smoking', 'RTX 4060 Ti | i5 Gen 12', '360 (OC 390) Hz', 'Gamen III, MXRSKEY & Leobog A80 HE • Logitech G203/G102 • HyperX (FAN)', 180),
(7, 'PC-07', 'non-smoking', 'RTX 4060 Ti | i5 Gen 12', '240 (OC 270) Hz', 'Gamen III, MXRSKEY & Leobog A80 HE • Logitech G203/G102 • HyperX (FAN - FLEXIBLE)', 180),
(8, 'PC-08', 'non-smoking', 'RTX 4060 Ti | i5 Gen 12', '360 (OC 390) Hz', 'Gamen III, MXRSKEY & Leobog A80 HE • Logitech G203/G102 • HyperX (AC - NO SMOKING)', 180),
(9, 'PC-09', 'non-smoking', 'RTX 4060 Ti | i5 Gen 13', '240 (OC 270) Hz', 'Gamen III, MXRSKEY & Leobog A80 HE • Logitech G203/G102 • HyperX (AC - NO SMOKING)', 180),
(10, 'PC-10', 'non-smoking', 'RTX 4070 SU | i7 Gen 14', '300 Hz', 'Gamen III, MXRSKEY & Leobog A80 HE • Logitech G203/G102 • HyperX (AC - NO SMOKING)', 180),
(11, 'PC-11', 'non-smoking', 'RTX 4070 SU | i7 Gen 14', '300 Hz', 'Gamen III, MXRSKEY & Leobog A80 HE • Logitech G203/G102 • HyperX (AC - NO SMOKING)', 180),
(12, 'PC-12', 'non-smoking', 'RTX 4070 SU | i7 Gen 14', '300 Hz', 'Gamen III, MXRSKEY & Leobog A80 HE • Logitech G203/G102 • HyperX (AC - NO SMOKING)', 180);

-- 4. Initial Agent Tokens (Pre-generated secure tokens for each PC agent)
INSERT INTO `pc_agents` (`pc_id`, `api_key_hash`, `agent_version`, `is_online`, `health_status`) VALUES
(1, SHA2('HOG_SECRET_AGENT_KEY_PC01_2025', 256), '1.0.0', 0, 'ready'),
(2, SHA2('HOG_SECRET_AGENT_KEY_PC02_2025', 256), '1.0.0', 0, 'ready'),
(3, SHA2('HOG_SECRET_AGENT_KEY_PC03_2025', 256), '1.0.0', 0, 'ready'),
(4, SHA2('HOG_SECRET_AGENT_KEY_PC04_2025', 256), '1.0.0', 0, 'ready'),
(5, SHA2('HOG_SECRET_AGENT_KEY_PC05_2025', 256), '1.0.0', 0, 'ready'),
(6, SHA2('HOG_SECRET_AGENT_KEY_PC06_2025', 256), '1.0.0', 0, 'ready'),
(7, SHA2('HOG_SECRET_AGENT_KEY_PC07_2025', 256), '1.0.0', 0, 'ready'),
(8, SHA2('HOG_SECRET_AGENT_KEY_PC08_2025', 256), '1.0.0', 0, 'ready'),
(9, SHA2('HOG_SECRET_AGENT_KEY_PC09_2025', 256), '1.0.0', 0, 'ready'),
(10, SHA2('HOG_SECRET_AGENT_KEY_PC10_2025', 256), '1.0.0', 0, 'ready'),
(11, SHA2('HOG_SECRET_AGENT_KEY_PC11_2025', 256), '1.0.0', 0, 'ready'),
(12, SHA2('HOG_SECRET_AGENT_KEY_PC12_2025', 256), '1.0.0', 0, 'ready');

-- 5. Exactly 13 Billing Packages from Official HOG Price List Poster
INSERT INTO `packages` (`package_code`, `name`, `price`, `duration_minutes`, `start_time_limit`, `end_time_limit`, `description`, `perks`) VALUES
('reg_30m', '30 Menit Regular', 5000.00, 30, NULL, NULL, 'Paket 30 Menit Regular (Exp 3 Bulan)', 'Exp 3 Bulan'),
('reg_1h', '1 Jam Regular', 10000.00, 60, NULL, NULL, 'Paket 1 Jam Regular (Exp 3 Bulan)', 'Exp 3 Bulan'),
('reg_2h', '2 Jam Regular', 20000.00, 120, NULL, NULL, 'Paket 2 Jam Regular (Exp 3 Bulan)', 'Exp 3 Bulan'),
('reg_3h', '3 Jam Regular', 30000.00, 180, NULL, NULL, 'Paket 3 Jam Regular + Bonus 30 Menit (Exp 3 Bulan)', 'Bonus 30 Menit • Exp 3 Bulan'),
('reg_4h', '4 Jam Regular', 40000.00, 240, NULL, NULL, 'Paket 4 Jam Regular + Bonus 40 Menit (Exp 3 Bulan)', 'Bonus 40 Menit • Exp 3 Bulan'),
('reg_5h', '5 Jam Regular', 50000.00, 300, NULL, NULL, 'Paket 5 Jam Regular + Bonus 50 Menit (Exp 3 Bulan)', 'Bonus 50 Menit • Exp 3 Bulan'),
('mabar_2pc', 'Paket Mabar 2 PC', 70000.00, 300, NULL, NULL, 'Paket Mabar 2 PC (5 Jam Masing-Masing PC)', '5 Jam Masing-Masing PC • Exp Ketika Waktu Selesai'),
('paket_12h', 'Paket 12 Jam', 90000.00, 720, NULL, NULL, 'Paket Marathon 12 Jam Non-stop', '12 Jam Penuh • Exp Ketika Waktu Selesai'),
('paket_24h', 'Paket 24 Jam', 150000.00, 1440, NULL, NULL, 'Paket Seharian Penuh 24 Jam Non-stop', '24 Jam Penuh • Exp Ketika Waktu Selesai'),
('pagi', 'Paket Pagi*', 40000.00, 360, '05:00:00', '10:00:00', 'Datang diantara Jam 5 sampai Jam 10 dapat waktu 6 Jam', '6 Jam • Datang Jam 05:00 - 10:00'),
('siang', 'Paket Siang**', 40000.00, 360, '11:00:00', '15:00:00', 'Datang diantara jam 11 sampai jam 3 dapat waktu 6 Jam', '6 Jam • Datang Jam 11:00 - 15:00'),
('malam', 'Paket Malam***', 50000.00, 540, '20:00:00', '02:00:00', 'Datang diantara Jam 8 malam sampai Jam 2 pagi dapat waktu 9 Jam', '9 Jam • Datang Jam 20:00 - 02:00'),
('war_tiket', 'War Tiket', 45000.00, 300, NULL, NULL, 'Paket Khusus War Tiket Konser / Event (5 Jam Speed 1 Gbps)', '5 Jam • Dedicated 1 Gbps • Exp Ketika Waktu Selesai');

-- =====================================================================
-- HOME OF GAMERS (HOG) — SUPABASE POSTGRESQL RELATIONAL SCHEMA
-- =====================================================================
-- Compatible with Supabase SQL Editor and direct PostgreSQL connections.
-- Official Price List, Specs, and Free Download Policies from HOG Poster.
-- =====================================================================

-- Enable necessary PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------
-- 1. System Settings Table
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_settings (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    setting_key VARCHAR(64) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description VARCHAR(255),
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 2. Administrators Table
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(64) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    role VARCHAR(32) DEFAULT 'operator' CHECK (role IN ('superadmin', 'manager', 'operator')),
    is_active SMALLINT DEFAULT 1,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 3. PCs Registry Table (Exactly 12 Gaming Rigs)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pcs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pc_code VARCHAR(16) UNIQUE NOT NULL,
    room_type VARCHAR(32) NOT NULL CHECK (room_type IN ('smoking', 'non-smoking')),
    specs_gpu VARCHAR(64) NOT NULL,
    specs_cpu VARCHAR(64) NOT NULL,
    specs_display VARCHAR(64) NOT NULL,
    specs_peripherals VARCHAR(255) NOT NULL,
    cooling VARCHAR(16) DEFAULT 'FAN' CHECK (cooling IN ('FAN', 'AC')),
    smoking_policy VARCHAR(16) DEFAULT 'YA' CHECK (smoking_policy IN ('YA', 'NO', 'FLEXIBLE')),
    is_enabled SMALLINT DEFAULT 1,
    connection_status VARCHAR(32) DEFAULT 'offline' CHECK (connection_status IN ('online', 'offline', 'reconnecting')),
    last_heartbeat TIMESTAMPTZ,
    last_known_ip VARCHAR(45),
    default_duration_minutes INT DEFAULT 180,
    current_session_id BIGINT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pcs_code ON pcs(pc_code);
CREATE INDEX IF NOT EXISTS idx_pcs_room ON pcs(room_type);
CREATE INDEX IF NOT EXISTS idx_pcs_status ON pcs(is_enabled, connection_status);

-- ---------------------------------------------------------------------
-- 4. PC Agent Authentication & Telemetry Table
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pc_agents (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pc_id BIGINT UNIQUE NOT NULL REFERENCES pcs(id) ON DELETE CASCADE,
    agent_token_hash VARCHAR(64) NOT NULL,
    agent_version VARCHAR(32) DEFAULT '1.0.0',
    os_version VARCHAR(128),
    last_reconnect_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pc_agents_token ON pc_agents(agent_token_hash);

-- ---------------------------------------------------------------------
-- 5. Packages Table (13 Official HOG Price List Packages)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS packages (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    room_type VARCHAR(32) DEFAULT 'all' CHECK (room_type IN ('smoking', 'non-smoking', 'all')),
    duration_minutes INT NOT NULL,
    bonus_minutes INT DEFAULT 0,
    price NUMERIC(10, 2) NOT NULL,
    expired_rule VARCHAR(64) DEFAULT '3 Bulan',
    valid_hours VARCHAR(64),
    description VARCHAR(255),
    badge_highlight VARCHAR(32),
    is_active SMALLINT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 6. Customers Table
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    phone VARCHAR(32) UNIQUE NOT NULL,
    email VARCHAR(128),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- ---------------------------------------------------------------------
-- 7. Bookings Table
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    booking_code VARCHAR(32) UNIQUE NOT NULL,
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    pc_id BIGINT NOT NULL REFERENCES pcs(id),
    replacement_pc_id BIGINT REFERENCES pcs(id),
    package_id BIGINT NOT NULL REFERENCES packages(id),
    room_type VARCHAR(32) NOT NULL CHECK (room_type IN ('smoking', 'non-smoking')),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    grace_period_minutes INT DEFAULT 45,
    status VARCHAR(32) DEFAULT 'pending_payment' CHECK (status IN (
        'pending_payment', 'confirmed', 'checked_in', 'active', 'completed', 'cancelled', 'expired'
    )),
    checked_in_at TIMESTAMPTZ,
    released_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_code ON bookings(booking_code);
CREATE INDEX IF NOT EXISTS idx_bookings_pc_date ON bookings(pc_id, booking_date, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- ---------------------------------------------------------------------
-- 8. Payments Table
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    booking_id BIGINT UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(32) NOT NULL CHECK (payment_method IN ('cash', 'qris', 'bank_transfer')),
    payment_status VARCHAR(32) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'rejected')),
    proof_image_path VARCHAR(255),
    verified_by_admin_id BIGINT REFERENCES admins(id),
    verified_at TIMESTAMPTZ,
    rejection_reason VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);

-- ---------------------------------------------------------------------
-- 9. Gaming Sessions Table (Authoritative Countdown Engine)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sessions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    session_code VARCHAR(32) UNIQUE NOT NULL,
    pc_id BIGINT NOT NULL REFERENCES pcs(id),
    package_id BIGINT REFERENCES packages(id),
    booking_id BIGINT REFERENCES bookings(id),
    scheduled_start_time TIMESTAMPTZ NOT NULL,
    scheduled_end_time TIMESTAMPTZ NOT NULL,
    actual_start_time TIMESTAMPTZ,
    actual_end_time TIMESTAMPTZ,
    duration_minutes INT NOT NULL,
    status VARCHAR(32) DEFAULT 'active' CHECK (status IN ('active', 'extended', 'completed', 'terminated_early', 'expired')),
    start_type VARCHAR(32) DEFAULT 'agent_startup' CHECK (start_type IN ('agent_startup', 'walk_in', 'booking_checkin', 'operator_manual')),
    operator_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_pc_status ON sessions(pc_id, status);
CREATE INDEX IF NOT EXISTS idx_sessions_end_time ON sessions(scheduled_end_time);

-- Add foreign key constraint from pcs to sessions
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_pcs_current_session') THEN
        ALTER TABLE pcs ADD CONSTRAINT fk_pcs_current_session FOREIGN KEY (current_session_id) REFERENCES sessions(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ---------------------------------------------------------------------
-- 10. Heartbeat Logs Table
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS heartbeat_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pc_id BIGINT NOT NULL REFERENCES pcs(id) ON DELETE CASCADE,
    session_id BIGINT REFERENCES sessions(id) ON DELETE SET NULL,
    agent_version VARCHAR(32),
    client_timestamp BIGINT,
    ip_address VARCHAR(45),
    cpu_usage_pct NUMERIC(5, 2),
    ram_usage_pct NUMERIC(5, 2),
    status_summary VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_heartbeat_pc_created ON heartbeat_logs(pc_id, created_at);

-- ---------------------------------------------------------------------
-- 11. Audit Logs Table
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    admin_id BIGINT REFERENCES admins(id) ON DELETE SET NULL,
    actor_type VARCHAR(32) DEFAULT 'operator' CHECK (actor_type IN ('system', 'operator', 'agent', 'customer')),
    action VARCHAR(64) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id BIGINT,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);

-- =====================================================================
-- SEED DATA (Official HOG Price List, PC Specs & Settings)
-- =====================================================================

-- System Settings
INSERT INTO system_settings (setting_key, setting_value, description)
VALUES 
    ('heartbeat_interval_seconds', '15', 'Default agent heartbeat interval in seconds'),
    ('offline_threshold_seconds', '60', 'Threshold in seconds to mark agent connection offline'),
    ('default_grace_period_minutes', '45', 'Late arrival tolerance before release (30-60m)'),
    ('allow_cross_room_reassignment', 'false', 'Strict rule: same-room replacement only'),
    ('auto_release_expired_bookings', 'true', 'Automatically release reservations after grace period'),
    ('network_speed', '1 Gbps (Backup 500 Mbps)', 'Kecepatan internet resmi HOG'),
    ('free_download_policy', 'BEBAS DOWNLOAD GAME YANG KAMU MAU TANPA REQUEST DARI OPERATOR', 'Ketentuan bebas download game'),
    ('booking_whatsapp', '0878-7867-2111', 'Kontak WhatsApp resmi reservasi HOG'),
    ('min_booking_hours', '3', 'Minimal reservasi booking PC via WhatsApp/Website')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- Default Administrator: admin / Admin@HOG2025!
INSERT INTO admins (username, password_hash, full_name, role, is_active)
VALUES (
    'admin',
    '$2y$12$K1bV0d5rF.Vb4Zg7OQ/mxeI9L1rY7VwYI9ZzN5yB4wB3tG8tZ6kSe',
    'HOG Chief Operator',
    'superadmin',
    1
)
ON CONFLICT (username) DO NOTHING;

-- Exactly 13 Packages from Official HOG Price List Poster
INSERT INTO packages (name, room_type, duration_minutes, bonus_minutes, price, expired_rule, valid_hours, description, badge_highlight)
VALUES
    ('30 Menit Regular', 'all', 30, 0, 5000.00, '3 Bulan', NULL, 'Paket 30 Menit Regular (Exp 3 Bulan)', NULL),
    ('1 Jam Regular', 'all', 60, 0, 10000.00, '3 Bulan', NULL, 'Paket 1 Jam Regular (Exp 3 Bulan)', NULL),
    ('2 Jam Regular', 'all', 120, 0, 20000.00, '3 Bulan', NULL, 'Paket 2 Jam Regular (Exp 3 Bulan)', NULL),
    ('3 Jam Regular', 'all', 180, 30, 30000.00, '3 Bulan', NULL, 'Paket 3 Jam Regular + Bonus 30 Menit (Exp 3 Bulan)', 'Bonus 30m'),
    ('4 Jam Regular', 'all', 240, 40, 40000.00, '3 Bulan', NULL, 'Paket 4 Jam Regular + Bonus 40 Menit (Exp 3 Bulan)', 'Bonus 40m'),
    ('5 Jam Regular', 'all', 300, 50, 50000.00, '3 Bulan', NULL, 'Paket 5 Jam Regular + Bonus 50 Menit (Exp 3 Bulan)', 'Bonus 50m'),
    ('Paket Mabar 2 PC', 'all', 300, 0, 70000.00, 'Exp Ketika Waktu Selesai', NULL, 'Paket Mabar 2 PC (5 Jam Masing-Masing PC)', 'Mabar Hemat'),
    ('Paket 12 Jam', 'all', 720, 0, 90000.00, 'Exp Ketika Waktu Selesai', NULL, 'Paket Marathon 12 Jam Non-stop', 'Marathon'),
    ('Paket 24 Jam', 'all', 1440, 0, 150000.00, 'Exp Ketika Waktu Selesai', NULL, 'Paket Seharian Penuh 24 Jam Non-stop', 'All Day Pass'),
    ('Paket Pagi*', 'all', 360, 0, 40000.00, 'Exp Ketika Waktu Selesai', '05:00 - 10:00', 'Datang diantara Jam 5 sampai Jam 10 dapat waktu 6 Jam', 'yellow'),
    ('Paket Siang**', 'all', 360, 0, 40000.00, 'Exp Ketika Waktu Selesai', '11:00 - 15:00', 'Datang diantara jam 11 sampai jam 3 dapat waktu 6 Jam', 'magenta'),
    ('Paket Malam***', 'all', 540, 0, 50000.00, 'Exp Ketika Waktu Selesai', '20:00 - 02:00', 'Datang diantara Jam 8 malam sampai Jam 2 pagi dapat waktu 9 Jam', 'orange'),
    ('War Tiket', 'all', 300, 0, 45000.00, 'Exp Ketika Waktu Selesai', NULL, 'Paket Khusus War Tiket Konser / Event (5 Jam Speed 1 Gbps)', 'Speed 1 Gbps')
ON CONFLICT DO NOTHING;

-- Exactly 12 PCs from Official HOG Specs Table
-- PC 1-6: Smoking Room (FAN)
-- PC 7: Flexible Zone (FAN)
-- PC 8-12: Non-Smoking Room (AC)
INSERT INTO pcs (pc_code, room_type, specs_gpu, specs_cpu, specs_display, specs_peripherals, cooling, smoking_policy, default_duration_minutes)
VALUES
    ('PC-01', 'smoking', 'RTX 4060 Ti', 'i7 Gen 14', '360 (OC 390) Hz', 'Gamen III, MXRSKEY Rapid Trigger & Leobog A80 HE • Logitech G 203/G 102 • HyperX', 'FAN', 'YA', 180),
    ('PC-02', 'smoking', 'RTX 4060 Ti', 'i5 Gen 12', '300 Hz', 'Gamen III, MXRSKEY Rapid Trigger & Leobog A80 HE • Logitech G 203/G 102 • HyperX', 'FAN', 'YA', 180),
    ('PC-03', 'smoking', 'RX 6600', 'i5 Gen 12', '240 (OC 270) Hz', 'Gamen III, MXRSKEY Rapid Trigger & Leobog A80 HE • Logitech G 203/G 102 • HyperX', 'FAN', 'YA', 180),
    ('PC-04', 'smoking', 'RTX 3070', 'i5 Gen 12', '240 (OC 270) Hz', 'Gamen III, MXRSKEY Rapid Trigger & Leobog A80 HE • Logitech G 203/G 102 • HyperX', 'FAN', 'YA', 180),
    ('PC-05', 'smoking', 'RTX 4060 Ti', 'i5 Gen 12', '360 (OC 390) Hz', 'Gamen III, MXRSKEY Rapid Trigger & Leobog A80 HE • Logitech G 203/G 102 • HyperX', 'FAN', 'YA', 180),
    ('PC-06', 'smoking', 'RTX 4060 Ti', 'i5 Gen 12', '360 (OC 390) Hz', 'Gamen III, MXRSKEY Rapid Trigger & Leobog A80 HE • Logitech G 203/G 102 • HyperX', 'FAN', 'YA', 180),
    ('PC-07', 'non-smoking', 'RTX 4060 Ti', 'i5 Gen 12', '240 (OC 270) Hz', 'Gamen III, MXRSKEY Rapid Trigger & Leobog A80 HE • Logitech G 203/G 102 • HyperX', 'FAN', 'FLEXIBLE', 180),
    ('PC-08', 'non-smoking', 'RTX 4060 Ti', 'i5 Gen 12', '360 (OC 390) Hz', 'Gamen III, MXRSKEY Rapid Trigger & Leobog A80 HE • Logitech G 203/G 102 • HyperX', 'AC', 'NO', 180),
    ('PC-09', 'non-smoking', 'RTX 4060 Ti', 'i5 Gen 13', '240 (OC 270) Hz', 'Gamen III, MXRSKEY Rapid Trigger & Leobog A80 HE • Logitech G 203/G 102 • HyperX', 'AC', 'NO', 180),
    ('PC-10', 'non-smoking', 'RTX 4070 SU', 'i7 Gen 14', '300 Hz', 'Gamen III, MXRSKEY Rapid Trigger & Leobog A80 HE • Logitech G 203/G 102 • HyperX', 'AC', 'NO', 180),
    ('PC-11', 'non-smoking', 'RTX 4070 SU', 'i7 Gen 14', '300 Hz', 'Gamen III, MXRSKEY Rapid Trigger & Leobog A80 HE • Logitech G 203/G 102 • HyperX', 'AC', 'NO', 180),
    ('PC-12', 'non-smoking', 'RTX 4070 SU', 'i7 Gen 14', '300 Hz', 'Gamen III, MXRSKEY Rapid Trigger & Leobog A80 HE • Logitech G 203/G 102 • HyperX', 'AC', 'NO', 180)
ON CONFLICT (pc_code) DO NOTHING;

-- Pre-hashed SHA-256 Tokens for Windows Agents on PC-01 through PC-12
INSERT INTO pc_agents (pc_id, agent_token_hash, agent_version)
SELECT id, encode(digest('HOG_SECRET_TOKEN_' || REPLACE(pc_code, '-', ''), 'sha256'), 'hex'), '1.0.0'
FROM pcs
ON CONFLICT (pc_id) DO NOTHING;

-- =====================================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE pcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pc_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE heartbeat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view active pcs') THEN
        CREATE POLICY "Public can view active pcs" ON pcs FOR SELECT USING (is_enabled = 1);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view active packages') THEN
        CREATE POLICY "Public can view active packages" ON packages FOR SELECT USING (is_active = 1);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can create bookings') THEN
        CREATE POLICY "Public can create bookings" ON bookings FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view booking status') THEN
        CREATE POLICY "Public can view booking status" ON bookings FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can register customer') THEN
        CREATE POLICY "Public can register customer" ON customers FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view customers') THEN
        CREATE POLICY "Public can view customers" ON customers FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can create payment record') THEN
        CREATE POLICY "Public can create payment record" ON payments FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view payments') THEN
        CREATE POLICY "Public can view payments" ON payments FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access pcs') THEN
        CREATE POLICY "Service role full access pcs" ON pcs FOR ALL USING (true);
        CREATE POLICY "Service role full access pc_agents" ON pc_agents FOR ALL USING (true);
        CREATE POLICY "Service role full access sessions" ON sessions FOR ALL USING (true);
        CREATE POLICY "Service role full access bookings" ON bookings FOR ALL USING (true);
        CREATE POLICY "Service role full access payments" ON payments FOR ALL USING (true);
        CREATE POLICY "Service role full access customers" ON customers FOR ALL USING (true);
        CREATE POLICY "Service role full access packages" ON packages FOR ALL USING (true);
        CREATE POLICY "Service role full access settings" ON system_settings FOR ALL USING (true);
        CREATE POLICY "Service role full access heartbeats" ON heartbeat_logs FOR ALL USING (true);
        CREATE POLICY "Service role full access audits" ON audit_logs FOR ALL USING (true);
        CREATE POLICY "Service role full access admins" ON admins FOR ALL USING (true);
    END IF;
EXCEPTION WHEN OTHERS THEN
END $$;

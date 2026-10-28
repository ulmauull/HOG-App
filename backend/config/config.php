<?php
/**
 * HOME OF GAMERS (HOG) — System Configuration
 * 
 * Supports both:
 * 1. Supabase PostgreSQL (Managed Cloud Database & Storage)
 * 2. Traditional MySQL / MariaDB (Local or Shared Hosting)
 */

// Timezone configuration (Asia/Jakarta WIB)
date_default_timezone_set('Asia/Jakarta');

// Database driver selection: 'pgsql' (Supabase) or 'mysql'
define('DB_DRIVER', getenv('HOG_DB_DRIVER') ?: (getenv('SUPABASE_DB_HOST') || getenv('SUPABASE_URL') ? 'pgsql' : 'pgsql'));

// Supabase API & Storage Configurations
define('SUPABASE_URL', getenv('SUPABASE_URL') ?: 'https://hslleuuyfmaqpajjmwie.supabase.co');
define('SUPABASE_ANON_KEY', getenv('SUPABASE_ANON_KEY') ?: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzbGxldXV5Zm1hcXBhamptd2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMTU1NTcsImV4cCI6MjEwODc5MTU1N30.ykz1okldVO7ooViqTAdp9ZJY0WtrbyKc0E0I50S6Yd4');
define('SUPABASE_SERVICE_ROLE_KEY', getenv('SUPABASE_SERVICE_ROLE_KEY') ?: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzbGxldXV5Zm1hcXBhamptd2llIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzIxNTU1NywiZXhwIjoyMTA4NzkxNTU3fQ.8eA5rtz8ZUust_twA8MMyjSRnabdpnZEC2YFkkZLNxo');
define('SUPABASE_STORAGE_BUCKET', getenv('SUPABASE_STORAGE_BUCKET') ?: 'payment-proofs');

// Database connection credentials (Configurable via Environment Variables or .env)
define('DB_HOST', getenv('SUPABASE_DB_HOST') ?: (getenv('HOG_DB_HOST') ?: 'aws-0-ap-southeast-1.pooler.supabase.com'));
define('DB_PORT', getenv('SUPABASE_DB_PORT') ?: (getenv('HOG_DB_PORT') ?: (DB_DRIVER === 'pgsql' ? '6543' : '3306')));
define('DB_NAME', getenv('SUPABASE_DB_NAME') ?: (getenv('HOG_DB_NAME') ?: (DB_DRIVER === 'pgsql' ? 'postgres' : 'hog_db')));
define('DB_USER', getenv('SUPABASE_DB_USER') ?: (getenv('HOG_DB_USER') ?: (DB_DRIVER === 'pgsql' ? 'postgres' : 'root')));
define('DB_PASS', getenv('SUPABASE_DB_PASS') ?: (getenv('HOG_DB_PASS') ?: ''));

// App details
define('APP_NAME', 'Home Of Gamers (HOG)');
define('APP_VERSION', '1.0.0');
define('APP_ENV', getenv('HOG_ENV') ?: 'production'); // 'development' or 'production'
define('APP_SECRET', getenv('HOG_APP_SECRET') ?: 'HOG_SUPER_SECURE_SECRET_KEY_98273491823');

// File upload configuration (Local fallback & temporary staging for Supabase Storage)
define('ROOT_DIR', dirname(__DIR__));
define('UPLOAD_DIR', ROOT_DIR . DIRECTORY_SEPARATOR . 'uploads');
define('MAX_UPLOAD_BYTES', 5 * 1024 * 1024); // 5 MB
define('ALLOWED_PROOF_MIMES', ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']);

// Heartbeat & Operational Thresholds (Fallbacks, overridden by system_settings in DB)
define('DEFAULT_HEARTBEAT_INTERVAL_SEC', 15);
define('DEFAULT_OFFLINE_THRESHOLD_SEC', 60);
define('DEFAULT_GRACE_PERIOD_MIN', 45);

// Ensure upload directory exists
if (!is_dir(UPLOAD_DIR)) {
    @mkdir(UPLOAD_DIR, 0755, true);
}

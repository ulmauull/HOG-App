<?php
namespace Hog;

use PDO;
use PDOException;

require_once __DIR__ . '/../config/config.php';

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $isPgsql = (defined('DB_DRIVER') && DB_DRIVER === 'pgsql') || 
                       str_contains(DB_HOST, 'supabase.co') || 
                       str_contains(DB_HOST, 'supabase.com') ||
                       DB_PORT === '5432' || 
                       DB_PORT === '6543';

            if ($isPgsql) {
                // Supabase PostgreSQL Connection
                $dsn = sprintf(
                    'pgsql:host=%s;port=%s;dbname=%s;sslmode=require',
                    DB_HOST,
                    DB_PORT,
                    DB_NAME
                );

                $options = [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ];

                try {
                    self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
                    // Ensure timezone aligns with WIB (Asia/Jakarta)
                    self::$instance->exec("SET timezone = 'Asia/Jakarta'");
                } catch (PDOException $e) {
                    self::handleConnectionError($e, 'Supabase PostgreSQL');
                }
            } else {
                // MySQL / MariaDB Fallback Connection
                $dsn = sprintf(
                    'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
                    DB_HOST,
                    DB_PORT,
                    DB_NAME
                );

                $options = [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci, time_zone = '+07:00'"
                ];

                try {
                    self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
                } catch (PDOException $e) {
                    self::handleConnectionError($e, 'MySQL');
                }
            }
        }

        return self::$instance;
    }

    private static function handleConnectionError(PDOException $e, string $driverName): void {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => false,
            'error' => "Koneksi ke database {$driverName} gagal.",
            'hint' => 'Pastikan kredensial SUPABASE_DB_HOST, SUPABASE_DB_USER, dan SUPABASE_DB_PASS pada backend/config/config.php sudah terisi sesuai project Supabase Anda.',
            'message' => APP_ENV === 'development' ? $e->getMessage() : 'Gagal terhubung ke server database.'
        ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit;
    }
}

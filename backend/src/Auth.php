<?php
namespace Hog;

use PDO;

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Response.php';

class Auth {
    /**
     * Authenticate a Windows Agent request via PC Code and API Key
     */
    public static function validateAgent(string $pcCode, string $apiKey): ?array {
        if (empty($pcCode) || empty($apiKey)) {
            return null;
        }

        $db = Database::getConnection();
        $stmt = $db->prepare('
            SELECT p.id as pc_id, p.pc_code, p.room_type, p.is_enabled, p.default_duration_minutes,
                   a.id as agent_id, a.api_key_hash, a.agent_version, a.is_online, a.health_status
            FROM pcs p
            JOIN pc_agents a ON a.pc_id = p.id
            WHERE p.pc_code = :pc_code
            LIMIT 1
        ');
        $stmt->execute(['pc_code' => strtoupper(trim($pcCode))]);
        $row = $stmt->fetch();

        if (!$row) {
            return null;
        }

        if ((int)$row['is_enabled'] !== 1) {
            return ['disabled' => true, 'pc_code' => $row['pc_code']];
        }

        $inputHash = hash('sha256', trim($apiKey));
        if (!hash_equals($row['api_key_hash'], $inputHash)) {
            return null;
        }

        return $row;
    }

    /**
     * Extract and validate Agent from incoming HTTP request headers
     */
    public static function getAgentFromHeaders(): ?array {
        $headers = getallheaders();
        $pcCode = $headers['X-PC-Code'] ?? $headers['x-pc-code'] ?? $_SERVER['HTTP_X_PC_CODE'] ?? null;
        $apiKey = $headers['X-Agent-Key'] ?? $headers['x-agent-key'] ?? $_SERVER['HTTP_X_AGENT_KEY'] ?? null;

        // Also check Bearer token format: "Bearer PC_CODE:API_KEY"
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (!$pcCode && preg_match('/Bearer\s+([^:]+):(.+)/i', $authHeader, $matches)) {
            $pcCode = $matches[1];
            $apiKey = $matches[2];
        }

        if (!$pcCode || !$apiKey) {
            return null;
        }

        return self::validateAgent($pcCode, $apiKey);
    }

    /**
     * Start session for browser-based admin
     */
    public static function startSession(): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_name('HOG_ADMIN_SESS');
            ini_set('session.cookie_httponly', '1');
            ini_set('session.use_only_cookies', '1');
            if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
                ini_set('session.cookie_secure', '1');
            }
            session_start();
        }
    }

    public static function loginAdmin(array $admin): void {
        self::startSession();
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_username'] = $admin['username'];
        $_SESSION['admin_name'] = $admin['full_name'];
        $_SESSION['admin_role'] = $admin['role'];
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

        // Update last login in database
        $db = Database::getConnection();
        $stmt = $db->prepare('UPDATE admins SET last_login_at = NOW() WHERE id = :id');
        $stmt->execute(['id' => $admin['id']]);
    }

    public static function logoutAdmin(): void {
        self::startSession();
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'],
                $params['secure'],
                $params['httponly']
            );
        }
        session_destroy();
    }

    public static function getAuthenticatedAdmin(): ?array {
        self::startSession();
        if (!empty($_SESSION['admin_logged_in']) && !empty($_SESSION['admin_id'])) {
            return [
                'id' => (int)$_SESSION['admin_id'],
                'username' => $_SESSION['admin_username'],
                'full_name' => $_SESSION['admin_name'],
                'role' => $_SESSION['admin_role'],
            ];
        }
        return null;
    }

    public static function requireAdmin(): array {
        $admin = self::getAuthenticatedAdmin();
        if (!$admin) {
            Response::error('Unauthorized: Administrator login required', 401);
        }
        return $admin;
    }

    public static function getCsrfToken(): string {
        self::startSession();
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    public static function verifyCsrfToken(?string $token): bool {
        self::startSession();
        if (empty($token) || empty($_SESSION['csrf_token'])) {
            return false;
        }
        return hash_equals($_SESSION['csrf_token'], $token);
    }
}

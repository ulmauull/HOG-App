<?php
namespace Hog;

class Response {
    public static function cors(): void {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Agent-Key, X-PC-Code');
        
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }

    public static function json(array $data, int $statusCode = 200): void {
        self::cors();
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        
        // Always include server time for authoritative time syncing
        $now = new \DateTime('now', new \DateTimeZone('Asia/Jakarta'));
        $data['server_time'] = $now->format('Y-m-d H:i:s');
        $data['server_timestamp'] = $now->getTimestamp();

        echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    public static function error(string $message, int $statusCode = 400, $errors = null): void {
        $payload = [
            'success' => false,
            'error' => $message,
        ];
        if ($errors !== null) {
            $payload['details'] = $errors;
        }
        self::json($payload, $statusCode);
    }

    public static function getJsonInput(): array {
        $raw = file_get_contents('php://input');
        if (empty($raw)) {
            return $_POST ?: [];
        }
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }
}

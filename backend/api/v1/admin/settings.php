<?php
/**
 * REST API: Admin System Settings
 * GET, PUT /api/v1/admin/settings.php
 */
require_once __DIR__ . '/../../../src/Response.php';
require_once __DIR__ . '/../../../src/Auth.php';
require_once __DIR__ . '/../../../src/Database.php';
require_once __DIR__ . '/../../../src/AuditService.php';

use Hog\Response;
use Hog\Auth;
use Hog\Database;
use Hog\AuditService;

Response::cors();
$admin = Auth::requireAdmin();

$db = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->query('SELECT setting_key, setting_value, setting_type, description, updated_at FROM system_settings');
    $settings = $stmt->fetchAll();
    Response::json(['success' => true, 'settings' => $settings]);
} elseif ($method === 'PUT') {
    $input = Response::getJsonInput();
    $updates = $input['settings'] ?? [];

    if (!is_array($updates) || empty($updates)) {
        Response::error('settings object is required.', 400);
    }

    $stmt = $db->prepare('UPDATE system_settings SET setting_value = :val, updated_at = NOW() WHERE setting_key = :key');
    foreach ($updates as $key => $val) {
        $stmt->execute(['val' => (string)$val, 'key' => $key]);
    }

    AuditService::log('settings_updated', 'system_settings', null, null, $updates, 'admin', $admin['id']);

    Response::json(['success' => true, 'message' => 'Pengaturan sistem berhasil disimpan.']);
} else {
    Response::error('Method not allowed.', 405);
}

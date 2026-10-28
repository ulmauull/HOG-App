<?php
/**
 * REST API: Admin Audit Logs
 * GET /api/v1/admin/audit-logs.php
 */
require_once __DIR__ . '/../../../src/Response.php';
require_once __DIR__ . '/../../../src/Auth.php';
require_once __DIR__ . '/../../../src/Database.php';

use Hog\Response;
use Hog\Auth;
use Hog\Database;

Response::cors();
$admin = Auth::requireAdmin();

$db = Database::getConnection();
$limit = isset($_GET['limit']) ? min(200, max(1, (int)$_GET['limit'])) : 50;

$stmt = $db->prepare('
    SELECT a.*, adm.username as admin_username, adm.full_name as admin_full_name
    FROM audit_logs a
    LEFT JOIN admins adm ON adm.id = a.admin_id
    ORDER BY a.id DESC
    LIMIT :lim
');
$stmt->bindValue(':lim', $limit, \PDO::PARAM_INT);
$stmt->execute();
$logs = $stmt->fetchAll();

foreach ($logs as &$log) {
    $log['old_values'] = $log['old_values'] ? json_decode($log['old_values'], true) : null;
    $log['new_values'] = $log['new_values'] ? json_decode($log['new_values'], true) : null;
}

Response::json(['success' => true, 'audit_logs' => $logs]);

<?php
/**
 * REST API: Admin PC Mapping & Configuration
 * GET /api/v1/admin/pcs.php
 * PUT /api/v1/admin/pcs.php
 */
require_once __DIR__ . '/../../../src/Response.php';
require_once __DIR__ . '/../../../src/Auth.php';
require_once __DIR__ . '/../../../src/Database.php';
require_once __DIR__ . '/../../../src/SessionService.php';
require_once __DIR__ . '/../../../src/AuditService.php';

use Hog\Response;
use Hog\Auth;
use Hog\Database;
use Hog\SessionService;
use Hog\AuditService;

Response::cors();
$admin = Auth::requireAdmin();

$db = Database::getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Expire overdue sessions first
    SessionService::expireOverdueSessions();

    $stmt = $db->query('SELECT setting_value FROM system_settings WHERE setting_key = \'offline_threshold_seconds\' LIMIT 1');
    $offlineThresholdSec = (int)($stmt->fetchColumn() ?: DEFAULT_OFFLINE_THRESHOLD_SEC);

    $stmt = $db->query('
        SELECT 
            p.*,
            a.is_online as agent_is_online,
            a.agent_version,
            a.last_heartbeat_at,
            a.last_ip_address,
            a.health_status,
            a.system_uptime_seconds,
            TIMESTAMPDIFF(SECOND, a.last_heartbeat_at, NOW()) as seconds_since_heartbeat,
            s.id as active_session_id,
            s.session_code,
            s.start_time as session_start_time,
            s.scheduled_end_time,
            s.duration_minutes as session_duration_minutes,
            s.start_type as session_start_type,
            s.status as session_status,
            c.name as customer_name,
            c.phone as customer_phone
        FROM pcs p
        LEFT JOIN pc_agents a ON a.pc_id = p.id
        LEFT JOIN sessions s ON s.id = p.current_session_id AND s.status IN (\'active\', \'extended\') AND s.scheduled_end_time > NOW()
        LEFT JOIN customers c ON c.id = s.customer_id
        ORDER BY p.id ASC
    ');
    $list = $stmt->fetchAll();

    $today = date('Y-m-d');
    foreach ($list as &$pc) {
        $pc['id'] = (int)$pc['id'];
        $pc['is_enabled'] = (int)$pc['is_enabled'] === 1;
        $pc['default_duration_minutes'] = (int)$pc['default_duration_minutes'];

        $isOnline = (
            !empty($pc['last_heartbeat_at']) &&
            $pc['seconds_since_heartbeat'] !== null &&
            (int)$pc['seconds_since_heartbeat'] <= $offlineThresholdSec
        );
        $pc['is_connected'] = $isOnline;

        $hasSession = !empty($pc['active_session_id']);
        $pc['has_active_session'] = $hasSession;
        $pc['remaining_seconds'] = $hasSession ? SessionService::calculateRemainingSeconds($pc['scheduled_end_time']) : 0;

        // Check next upcoming reservation today
        $bStmt = $db->prepare('
            SELECT b.id, b.booking_code, b.start_time, b.end_time, c.name as customer_name
            FROM bookings b
            JOIN customers c ON c.id = b.customer_id
            WHERE b.pc_id = :pc_id AND b.booking_date = :today AND b.status = \'confirmed\' AND b.start_time > CURTIME()
            ORDER BY b.start_time ASC LIMIT 1
        ');
        $bStmt->execute(['pc_id' => $pc['id'], 'today' => $today]);
        $pc['upcoming_booking'] = $bStmt->fetch() ?: null;
    }

    Response::json(['success' => true, 'pcs' => $list]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = Response::getJsonInput();
    $pcId = (int)($input['pc_id'] ?? 0);

    if (!$pcId) {
        Response::error('pc_id is required.', 400);
    }

    $stmt = $db->prepare('SELECT * FROM pcs WHERE id = :id');
    $stmt->execute(['id' => $pcId]);
    $oldPc = $stmt->fetch();

    if (!$oldPc) {
        Response::error('PC not found.', 404);
    }

    $roomType = $input['room_type'] ?? $oldPc['room_type'];
    $isEnabled = isset($input['is_enabled']) ? ((int)$input['is_enabled'] ? 1 : 0) : (int)$oldPc['is_enabled'];
    $defaultDuration = isset($input['default_duration_minutes']) ? (int)$input['default_duration_minutes'] : (int)$oldPc['default_duration_minutes'];

    if (!in_array($roomType, ['smoking', 'non-smoking'])) {
        Response::error('room_type must be smoking or non-smoking.', 400);
    }

    $stmt = $db->prepare('
        UPDATE pcs
        SET room_type = :room, is_enabled = :enabled, default_duration_minutes = :duration, updated_at = NOW()
        WHERE id = :id
    ');
    $stmt->execute([
        'room' => $roomType,
        'enabled' => $isEnabled,
        'duration' => $defaultDuration,
        'id' => $pcId
    ]);

    AuditService::log('pc_config_updated', 'pc', (string)$pcId, [
        'room_type' => $oldPc['room_type'],
        'is_enabled' => $oldPc['is_enabled'],
        'default_duration_minutes' => $oldPc['default_duration_minutes']
    ], [
        'room_type' => $roomType,
        'is_enabled' => $isEnabled,
        'default_duration_minutes' => $defaultDuration
    ], 'admin', $admin['id']);

    Response::json([
        'success' => true,
        'message' => "Konfigurasi {$oldPc['pc_code']} berhasil diperbarui."
    ]);
} else {
    Response::error('Method not allowed.', 405);
}

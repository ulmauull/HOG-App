<?php
/**
 * REST API: Admin Session Management
 * GET, POST, PUT, DELETE /api/v1/admin/sessions.php
 */
require_once __DIR__ . '/../../../src/Response.php';
require_once __DIR__ . '/../../../src/Auth.php';
require_once __DIR__ . '/../../../src/Database.php';
require_once __DIR__ . '/../../../src/SessionService.php';
require_once __DIR__ . '/../../../src/BookingService.php';

use Hog\Response;
use Hog\Auth;
use Hog\Database;
use Hog\SessionService;
use Hog\BookingService;

Response::cors();
$admin = Auth::requireAdmin();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Session history or active sessions
    $db = Database::getConnection();
    $pcId = isset($_GET['pc_id']) ? (int)$_GET['pc_id'] : null;
    $limit = isset($_GET['limit']) ? min(100, max(1, (int)$_GET['limit'])) : 50;

    $sql = '
        SELECT s.*, p.pc_code, p.room_type, c.name as customer_name, c.phone as customer_phone
        FROM sessions s
        JOIN pcs p ON p.id = s.pc_id
        LEFT JOIN customers c ON c.id = s.customer_id
    ';
    $params = [];
    if ($pcId) {
        $sql .= ' WHERE s.pc_id = :pc_id';
        $params['pc_id'] = $pcId;
    }
    $sql .= ' ORDER BY s.id DESC LIMIT ' . $limit;

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $sessions = $stmt->fetchAll();

    foreach ($sessions as &$sess) {
        $sess['remaining_seconds'] = ($sess['status'] === 'active' || $sess['status'] === 'extended')
            ? SessionService::calculateRemainingSeconds($sess['scheduled_end_time'])
            : 0;
    }

    Response::json(['success' => true, 'sessions' => $sessions]);
} elseif ($method === 'POST') {
    // Start Walk-In or Manual session
    $input = Response::getJsonInput();
    $pcId = (int)($input['pc_id'] ?? 0);
    $duration = (int)($input['duration_minutes'] ?? 120);
    $custName = trim($input['customer_name'] ?? 'Walk-In Gamer');
    $custPhone = trim($input['customer_phone'] ?? '');
    $notes = trim($input['notes'] ?? 'Walk-in session by operator');

    if (!$pcId) {
        Response::error('pc_id is required.', 400);
    }

    // Check if conflicting reservation exists today within proposed duration
    $today = date('Y-m-d');
    $nowTime = date('H:i:s');
    $endDt = new \DateTime("{$today} {$nowTime}");
    $endDt->modify("+{$duration} minutes");
    $endTime = $endDt->format('H:i:s');

    if (BookingService::hasConflict($pcId, $today, $nowTime, $endTime)) {
        Response::error('Konflik: PC ini memiliki reservasi booking yang akan dimulai dalam rentang durasi tersebut.', 409);
    }

    $db = Database::getConnection();
    $customerId = null;
    if (!empty($custPhone)) {
        $stmt = $db->prepare('SELECT id FROM customers WHERE phone = :phone LIMIT 1');
        $stmt->execute(['phone' => $custPhone]);
        $c = $stmt->fetch();
        if ($c) {
            $customerId = (int)$c['id'];
        } else {
            $stmt = $db->prepare('INSERT INTO customers (name, phone, created_at) VALUES (:name, :phone, NOW())');
            $stmt->execute(['name' => $custName, 'phone' => $custPhone]);
            $customerId = (int)$db->lastInsertId();
        }
    }

    try {
        $session = SessionService::startManualSession(
            $pcId,
            $duration,
            'walk_in',
            $customerId,
            null,
            $notes,
            $admin['id']
        );
        Response::json([
            'success' => true,
            'message' => 'Sesi Walk-In berhasil dimulai.',
            'session' => $session
        ], 201);
    } catch (\Exception $e) {
        Response::error($e->getMessage(), 400);
    }
} elseif ($method === 'PUT') {
    // Extend Session
    $input = Response::getJsonInput();
    $pcId = (int)($input['pc_id'] ?? 0);
    $extraMinutes = (int)($input['extra_minutes'] ?? 0);

    if (!$pcId || $extraMinutes <= 0) {
        Response::error('pc_id and positive extra_minutes are required.', 400);
    }

    try {
        $session = SessionService::extendSession($pcId, $extraMinutes, $admin['id']);
        Response::json([
            'success' => true,
            'message' => "Sesi berhasil diperpanjang +{$extraMinutes} menit.",
            'session' => $session
        ]);
    } catch (\Exception $e) {
        Response::error($e->getMessage(), 400);
    }
} elseif ($method === 'DELETE') {
    // End session manually
    $input = Response::getJsonInput();
    $pcId = (int)($input['pc_id'] ?? ($_GET['pc_id'] ?? 0));
    $reason = trim($input['reason'] ?? ($_GET['reason'] ?? 'Dihentikan oleh operator'));

    if (!$pcId) {
        Response::error('pc_id is required.', 400);
    }

    try {
        SessionService::endSession($pcId, $reason, $admin['id']);
        Response::json([
            'success' => true,
            'message' => 'Sesi berhasil dihentikan secara manual (riwayat tetap tersimpan di database).'
        ]);
    } catch (\Exception $e) {
        Response::error($e->getMessage(), 400);
    }
} else {
    Response::error('Method not allowed.', 405);
}

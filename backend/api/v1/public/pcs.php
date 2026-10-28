<?php
/**
 * REST API: Public PC Availability and Live Telemetry
 * GET /api/v1/public/pcs.php
 * 
 * Supports both Supabase PostgreSQL and MySQL.
 */
require_once __DIR__ . '/../../../src/Response.php';
require_once __DIR__ . '/../../../src/Database.php';
require_once __DIR__ . '/../../../src/SessionService.php';
require_once __DIR__ . '/../../../src/BookingService.php';

use Hog\Response;
use Hog\Database;
use Hog\SessionService;
use Hog\BookingService;

Response::cors();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error('Method not allowed. Use GET.', 405);
}

// Automatically release overdue bookings before reporting live status
BookingService::releaseOverdueBookings();
SessionService::expireOverdueSessions();

$db = Database::getConnection();

// Fetch offline threshold from settings
$stmt = $db->query('SELECT setting_value FROM system_settings WHERE setting_key = \'offline_threshold_seconds\' LIMIT 1');
$offlineThresholdSec = (int)($stmt->fetchColumn() ?: DEFAULT_OFFLINE_THRESHOLD_SEC);

// Query all 12 PCs with their current active session
$stmt = $db->query('
    SELECT 
        p.*,
        COALESCE(p.last_heartbeat, a.last_heartbeat_at) as effective_last_heartbeat,
        s.id as active_session_id, 
        s.scheduled_start_time as session_start_time, 
        s.scheduled_end_time, 
        s.duration_minutes
    FROM pcs p
    LEFT JOIN pc_agents a ON a.pc_id = p.id
    LEFT JOIN sessions s ON s.id = p.current_session_id AND s.status IN (\'active\', \'extended\') AND s.scheduled_end_time > NOW()
    ORDER BY p.id ASC
');
$rawList = $stmt->fetchAll();

$today = date('Y-m-d');
$pcs = [];
$counts = [
    'total' => count($rawList),
    'available' => 0,
    'in_use' => 0,
    'reserved' => 0,
    'offline' => 0
];

foreach ($rawList as $r) {
    $pcId = (int)$r['id'];
    $isEnabled = (int)$r['is_enabled'] === 1;

    // Connectivity state calculated via PHP timestamp for cross-database compatibility
    $lastHb = $r['effective_last_heartbeat'] ?? null;
    $secondsSinceHeartbeat = !empty($lastHb) ? max(0, time() - strtotime($lastHb)) : 999999;
    $isActuallyOnline = (!empty($lastHb) && $secondsSinceHeartbeat <= $offlineThresholdSec);

    // Active session calculation
    $hasActiveSession = !empty($r['active_session_id']) && !empty($r['scheduled_end_time']);
    $remainingSeconds = $hasActiveSession ? SessionService::calculateRemainingSeconds($r['scheduled_end_time']) : 0;

    // Check if reserved today in upcoming slot
    $resStmt = $db->prepare('
        SELECT booking_code, start_time, end_time
        FROM bookings
        WHERE pc_id = :pc_id
          AND booking_date = :today
          AND status = \'confirmed\'
          AND start_time > CURRENT_TIME
        ORDER BY start_time ASC
        LIMIT 1
    ');
    $resStmt->execute(['pc_id' => $pcId, 'today' => $today]);
    $upcomingRes = $resStmt->fetch();

    // Determine operational public status
    if (!$isEnabled) {
        $status = 'offline';
        $statusLabel = 'Maintenance';
    } elseif (!$isActuallyOnline && !$hasActiveSession) {
        $status = 'offline';
        $statusLabel = 'Offline';
    } elseif ($hasActiveSession) {
        $status = 'in-use';
        $statusLabel = 'Digunakan';
    } elseif ($upcomingRes) {
        $status = 'reserved';
        $statusLabel = 'Dipesan';
    } else {
        $status = 'available';
        $statusLabel = 'Tersedia';
    }

    // Accumulate counts
    if (isset($counts[$status])) {
        $counts[$status]++;
    }

    $pcs[] = [
        'id' => $pcId,
        'pc_code' => $r['pc_code'],
        'room_type' => $r['room_type'],
        'specs' => [
            'gpu' => $r['specs_gpu'],
            'cpu' => $r['specs_cpu'] ?? 'i5 Gen 12',
            'display' => $r['specs_display'],
            'peripherals' => $r['specs_peripherals'],
            'cooling' => $r['cooling'] ?? ($r['room_type'] === 'smoking' ? 'FAN' : 'AC'),
            'smoking_policy' => $r['smoking_policy'] ?? ($r['room_type'] === 'smoking' ? 'YA' : 'NO')
        ],
        'is_enabled' => $isEnabled,
        'connection' => [
            'is_online' => $isActuallyOnline,
            'last_heartbeat' => $lastHb
        ],
        'status' => $status,
        'status_label' => $statusLabel,
        'session' => $hasActiveSession ? [
            'start_time' => $r['session_start_time'],
            'scheduled_end_time' => $r['scheduled_end_time'],
            'duration_minutes' => (int)$r['duration_minutes'],
            'remaining_seconds' => $remainingSeconds
        ] : null,
        'upcoming_reservation' => $upcomingRes ? [
            'start_time' => $upcomingRes['start_time'],
            'end_time' => $upcomingRes['end_time']
        ] : null
    ];
}

Response::json([
    'success' => true,
    'telemetry_server' => 'HOG-JKT01',
    'summary' => $counts,
    'meta' => [
        'network_speed' => 'SPEED 1 Gbps (Jika Ada Kendala Pakai 500 Mbps)',
        'free_download_policy' => 'BEBAS DOWNLOAD GAME YANG KAMU MAU TANPA REQUEST DARI OPERATOR',
        'whatsapp_booking' => '0878-7867-2111',
        'min_booking_hours' => 3
    ],
    'pcs' => $pcs
]);

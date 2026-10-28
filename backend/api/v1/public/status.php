<?php
/**
 * REST API: Lookup Public Booking Status
 * GET /api/v1/public/status.php?code=HOG-...
 */
require_once __DIR__ . '/../../../src/Response.php';
require_once __DIR__ . '/../../../src/Database.php';

use Hog\Response;
use Hog\Database;

Response::cors();

$code = trim($_GET['code'] ?? '');
if (empty($code)) {
    Response::error('Parameter code is required.', 400);
}

$db = Database::getConnection();
$stmt = $db->prepare('
    SELECT 
        b.id, b.booking_code, b.room_type, b.booking_date, b.start_time, b.end_time,
        b.duration_minutes, b.total_price, b.status as booking_status, b.grace_period_minutes,
        b.checked_in_at, b.created_at,
        p.pc_code as booked_pc,
        rep.pc_code as replacement_pc,
        pkg.name as package_name,
        pay.payment_method, pay.payment_status, pay.proof_image_path,
        c.name as customer_name
    FROM bookings b
    JOIN pcs p ON p.id = b.pc_id
    LEFT JOIN pcs rep ON rep.id = b.replacement_pc_id
    JOIN packages pkg ON pkg.id = b.package_id
    LEFT JOIN payments pay ON pay.booking_id = b.id
    JOIN customers c ON c.id = b.customer_id
    WHERE b.booking_code = :code
    LIMIT 1
');
$stmt->execute(['code' => $code]);
$row = $stmt->fetch();

if (!$row) {
    Response::error('Reservasi tidak ditemukan. Pastikan kode booking yang dimasukkan benar.', 404);
}

// Calculate countdown to start time if booking is today
$today = date('Y-m-d');
$secondsUntilStart = null;
if ($row['booking_date'] === $today) {
    $startUnix = strtotime("{$today} {$row['start_time']}");
    $secondsUntilStart = max(0, $startUnix - time());
}

Response::json([
    'success' => true,
    'booking' => [
        'code' => $row['booking_code'],
        'customer_name' => $row['customer_name'],
        'pc_code' => $row['replacement_pc'] ?: $row['booked_pc'],
        'original_pc' => $row['booked_pc'],
        'has_replacement' => !empty($row['replacement_pc']),
        'room_type' => $row['room_type'],
        'package_name' => $row['package_name'],
        'date' => $row['booking_date'],
        'start_time' => $row['start_time'],
        'end_time' => $row['end_time'],
        'duration_minutes' => (int)$row['duration_minutes'],
        'total_price' => (float)$row['total_price'],
        'booking_status' => $row['booking_status'],
        'grace_period_minutes' => (int)$row['grace_period_minutes'],
        'seconds_until_start' => $secondsUntilStart,
        'payment' => [
            'method' => $row['payment_method'],
            'status' => $row['payment_status'],
            'has_proof' => !empty($row['proof_image_path'])
        ]
    ]
]);

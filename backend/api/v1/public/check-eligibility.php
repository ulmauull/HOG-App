<?php
/**
 * REST API: Check Booking Eligibility & Conflicts
 * POST /api/v1/public/check-eligibility.php
 */
require_once __DIR__ . '/../../../src/Response.php';
require_once __DIR__ . '/../../../src/BookingService.php';
require_once __DIR__ . '/../../../src/Database.php';

use Hog\Response;
use Hog\BookingService;
use Hog\Database;

Response::cors();

$input = Response::getJsonInput();
$pcId = (int)($input['pc_id'] ?? 0);
$bookingDate = trim($input['booking_date'] ?? date('Y-m-d'));
$startTime = trim($input['start_time'] ?? '19:00:00');
$durationMinutes = (int)($input['duration_minutes'] ?? 240);

if (!$pcId) {
    Response::error('pc_id is required.', 400);
}

$startDt = new \DateTime("{$bookingDate} {$startTime}");
$endDt = clone $startDt;
$endDt->modify("+{$durationMinutes} minutes");
$endTime = $endDt->format('H:i:s');

$db = Database::getConnection();
$stmt = $db->prepare('SELECT id, pc_code, room_type, is_enabled FROM pcs WHERE id = :id');
$stmt->execute(['id' => $pcId]);
$pc = $stmt->fetch();

if (!$pc || (int)$pc['is_enabled'] !== 1) {
    Response::json([
        'eligible' => false,
        'reason' => 'PC dinonaktifkan atau dalam pemeliharaan.',
        'pc_code' => $pc ? $pc['pc_code'] : null
    ]);
}

$conflict = BookingService::hasConflict($pcId, $bookingDate, $startTime, $endTime);

Response::json([
    'eligible' => !$conflict,
    'conflict' => $conflict,
    'pc_code' => $pc['pc_code'],
    'room_type' => $pc['room_type'],
    'requested_window' => [
        'date' => $bookingDate,
        'start_time' => $startTime,
        'end_time' => $endTime,
        'duration_minutes' => $durationMinutes
    ],
    'reason' => $conflict ? 'Sudah ada reservasi aktif pada jam tersebut.' : 'Slot stasiun PC tersedia.'
]);

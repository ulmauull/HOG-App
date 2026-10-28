<?php
/**
 * REST API: Create Booking Request
 * POST /api/v1/public/book.php
 */
require_once __DIR__ . '/../../../src/Response.php';
require_once __DIR__ . '/../../../src/BookingService.php';

use Hog\Response;
use Hog\BookingService;

Response::cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed. Use POST.', 405);
}

$input = Response::getJsonInput();

try {
    $result = BookingService::createBooking($input);
    Response::json([
        'success' => true,
        'message' => 'Reservasi berhasil dibuat. Silakan lakukan pembayaran dan unggah bukti transfer.',
        'data' => $result
    ], 201);
} catch (\Exception $e) {
    Response::error($e->getMessage(), 400);
}

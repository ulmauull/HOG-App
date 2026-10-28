<?php
/**
 * REST API: Upload Payment Proof Image
 * POST /api/v1/public/upload-proof.php
 */
require_once __DIR__ . '/../../../src/Response.php';
require_once __DIR__ . '/../../../src/BookingService.php';

use Hog\Response;
use Hog\BookingService;

Response::cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed. Use POST.', 405);
}

$bookingCode = trim($_POST['booking_code'] ?? '');
if (empty($bookingCode)) {
    Response::error('booking_code is required in form-data.', 400);
}

if (empty($_FILES['proof_image'])) {
    Response::error('proof_image file is required.', 400);
}

try {
    $result = BookingService::attachPaymentProof($bookingCode, $_FILES['proof_image']);
    Response::json([
        'success' => true,
        'message' => 'Bukti pembayaran berhasil diunggah. Operator HOG akan memverifikasi dalam beberapa menit.',
        'data' => $result
    ]);
} catch (\Exception $e) {
    Response::error($e->getMessage(), 400);
}

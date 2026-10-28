<?php
/**
 * REST API: Admin Bookings Management
 * GET, PUT, POST /api/v1/admin/bookings.php
 */
require_once __DIR__ . '/../../../src/Response.php';
require_once __DIR__ . '/../../../src/Auth.php';
require_once __DIR__ . '/../../../src/Database.php';
require_once __DIR__ . '/../../../src/BookingService.php';

use Hog\Response;
use Hog\Auth;
use Hog\Database;
use Hog\BookingService;

Response::cors();
$admin = Auth::requireAdmin();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Release overdue bookings first
    BookingService::releaseOverdueBookings();

    $db = Database::getConnection();
    $status = $_GET['status'] ?? null;
    $roomType = $_GET['room_type'] ?? null;
    $date = $_GET['date'] ?? null;
    $search = trim($_GET['search'] ?? '');

    $sql = '
        SELECT 
            b.*,
            p.pc_code as original_pc_code,
            rep.pc_code as replacement_pc_code,
            c.name as customer_name,
            c.phone as customer_phone,
            c.email as customer_email,
            pkg.name as package_name,
            pay.id as payment_id,
            pay.payment_method,
            pay.payment_status,
            pay.proof_image_path,
            pay.rejection_reason,
            pay.verified_at
        FROM bookings b
        JOIN pcs p ON p.id = b.pc_id
        LEFT JOIN pcs rep ON rep.id = b.replacement_pc_id
        JOIN customers c ON c.id = b.customer_id
        JOIN packages pkg ON pkg.id = b.package_id
        LEFT JOIN payments pay ON pay.booking_id = b.id
        WHERE 1=1
    ';
    $params = [];

    if ($status) {
        $sql .= ' AND b.status = :status';
        $params['status'] = $status;
    }
    if ($roomType) {
        $sql .= ' AND b.room_type = :room';
        $params['room'] = $roomType;
    }
    if ($date) {
        $sql .= ' AND b.booking_date = :date';
        $params['date'] = $date;
    }
    if ($search) {
        $sql .= ' AND (b.booking_code LIKE :search OR c.name LIKE :search OR c.phone LIKE :search)';
        $params['search'] = "%{$search}%";
    }

    $sql .= ' ORDER BY b.booking_date DESC, b.start_time DESC LIMIT 100';

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $bookings = $stmt->fetchAll();

    $today = date('Y-m-d');
    $nowTime = date('H:i:s');
    foreach ($bookings as &$b) {
        $b['id'] = (int)$b['id'];
        $b['total_price'] = (float)$b['total_price'];
        
        // Late arrival detection
        $isLate = false;
        if ($b['booking_date'] === $today && $b['status'] === 'confirmed' && $nowTime > $b['start_time']) {
            $isLate = true;
        }
        $b['is_late'] = $isLate;
    }

    Response::json(['success' => true, 'bookings' => $bookings]);
} elseif ($method === 'PUT') {
    // Payment Verification Action (Approve / Reject)
    $input = Response::getJsonInput();
    $bookingId = (int)($input['booking_id'] ?? 0);
    $isApproved = !empty($input['is_approved']);
    $reason = trim($input['rejection_reason'] ?? '');

    if (!$bookingId) {
        Response::error('booking_id is required.', 400);
    }

    try {
        BookingService::verifyPayment($bookingId, $isApproved, $reason, $admin['id']);
        Response::json([
            'success' => true,
            'message' => $isApproved ? 'Pembayaran diverifikasi dan reservasi terkonfirmasi.' : 'Pembayaran ditolak dan booking dibatalkan.'
        ]);
    } catch (\Exception $e) {
        Response::error($e->getMessage(), 400);
    }
} elseif ($method === 'POST') {
    $input = Response::getJsonInput();
    $action = $input['action'] ?? '';
    $bookingId = (int)($input['booking_id'] ?? 0);

    if (!$bookingId) {
        Response::error('booking_id is required.', 400);
    }

    if ($action === 'checkin') {
        try {
            $result = BookingService::checkInCustomer($bookingId, $admin['id']);
            Response::json([
                'success' => true,
                'message' => 'Check-in berhasil! Sesi PC resmi diaktifkan.',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    } elseif ($action === 'find_replacement') {
        $cand = BookingService::findReplacementPc($bookingId);
        Response::json([
            'success' => true,
            'has_replacement' => $cand !== null,
            'replacement_pc' => $cand
        ]);
    } elseif ($action === 'assign_replacement') {
        $newPcId = (int)($input['replacement_pc_id'] ?? 0);
        if (!$newPcId) {
            Response::error('replacement_pc_id is required.', 400);
        }
        try {
            BookingService::assignReplacementPc($bookingId, $newPcId, $admin['id']);
            Response::json([
                'success' => true,
                'message' => 'PC pengganti pada ruangan yang sama berhasil dialokasikan.'
            ]);
        } catch (\Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    } else {
        Response::error('Invalid action.', 400);
    }
} else {
    Response::error('Method not allowed.', 405);
}

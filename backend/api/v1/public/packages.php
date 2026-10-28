<?php
/**
 * REST API: Public Packages List
 * GET /api/v1/public/packages.php
 */
require_once __DIR__ . '/../../../src/Response.php';
require_once __DIR__ . '/../../../src/Database.php';

use Hog\Response;
use Hog\Database;

Response::cors();

$db = Database::getConnection();
$stmt = $db->query('
    SELECT *
    FROM packages
    WHERE is_active = 1
    ORDER BY id ASC
');
$packages = $stmt->fetchAll();

foreach ($packages as &$pkg) {
    $pkg['id'] = (int)$pkg['id'];
    $pkg['price'] = (float)$pkg['price'];
    $pkg['duration_minutes'] = (int)$pkg['duration_minutes'];
    $pkg['bonus_minutes'] = isset($pkg['bonus_minutes']) ? (int)$pkg['bonus_minutes'] : 0;
    $pkg['price_formatted'] = 'Rp ' . number_format($pkg['price'], 0, ',', '.');
    $pkg['expired_rule'] = $pkg['expired_rule'] ?? ($pkg['perks'] ?? 'Exp Ketika Waktu Selesai');
}

Response::json([
    'success' => true,
    'packages' => $packages,
    'meta' => [
        'network_speed' => 'SPEED 1 Gbps (Jika Ada Kendala Pakai 500 Mbps)',
        'free_download_policy' => 'BEBAS DOWNLOAD GAME YANG KAMU MAU TANPA REQUEST DARI OPERATOR',
        'whatsapp_booking' => '0878-7867-2111',
        'min_booking_hours' => 3
    ]
]);

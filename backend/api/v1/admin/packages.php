<?php
/**
 * REST API: Admin Package Management
 * GET, POST, PUT /api/v1/admin/packages.php
 */
require_once __DIR__ . '/../../../src/Response.php';
require_once __DIR__ . '/../../../src/Auth.php';
require_once __DIR__ . '/../../../src/Database.php';
require_once __DIR__ . '/../../../src/AuditService.php';

use Hog\Response;
use Hog\Auth;
use Hog\Database;
use Hog\AuditService;

Response::cors();
$admin = Auth::requireAdmin();

$db = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->query('SELECT * FROM packages ORDER BY id ASC');
    Response::json(['success' => true, 'packages' => $stmt->fetchAll()]);
} elseif ($method === 'POST') {
    $input = Response::getJsonInput();
    $code = trim($input['package_code'] ?? '');
    $name = trim($input['name'] ?? '');
    $price = (float)($input['price'] ?? 0);
    $duration = (int)($input['duration_minutes'] ?? 60);
    $desc = trim($input['description'] ?? '');
    $perks = trim($input['perks'] ?? '');

    if (empty($code) || empty($name) || $price <= 0 || $duration <= 0) {
        Response::error('Code, name, valid price, and duration are required.', 400);
    }

    $stmt = $db->prepare('
        INSERT INTO packages (package_code, name, price, duration_minutes, description, perks, created_at)
        VALUES (:code, :name, :price, :duration, :desc, :perks, NOW())
    ');
    $stmt->execute([
        'code' => $code,
        'name' => $name,
        'price' => $price,
        'duration' => $duration,
        'desc' => $desc,
        'perks' => $perks
    ]);

    $newId = (int)$db->lastInsertId();
    AuditService::log('package_created', 'package', (string)$newId, null, $input, 'admin', $admin['id']);

    Response::json(['success' => true, 'message' => 'Paket berhasil ditambahkan.', 'id' => $newId], 201);
} elseif ($method === 'PUT') {
    $input = Response::getJsonInput();
    $id = (int)($input['id'] ?? 0);
    if (!$id) {
        Response::error('id is required.', 400);
    }

    $stmt = $db->prepare('SELECT * FROM packages WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $oldPkg = $stmt->fetch();
    if (!$oldPkg) {
        Response::error('Package not found.', 404);
    }

    $name = trim($input['name'] ?? $oldPkg['name']);
    $price = isset($input['price']) ? (float)$input['price'] : (float)$oldPkg['price'];
    $duration = isset($input['duration_minutes']) ? (int)$input['duration_minutes'] : (int)$oldPkg['duration_minutes'];
    $isActive = isset($input['is_active']) ? ((int)$input['is_active'] ? 1 : 0) : (int)$oldPkg['is_active'];
    $desc = trim($input['description'] ?? $oldPkg['description']);
    $perks = trim($input['perks'] ?? $oldPkg['perks']);

    $stmt = $db->prepare('
        UPDATE packages
        SET name = :name, price = :price, duration_minutes = :duration,
            is_active = :active, description = :desc, perks = :perks, updated_at = NOW()
        WHERE id = :id
    ');
    $stmt->execute([
        'name' => $name,
        'price' => $price,
        'duration' => $duration,
        'active' => $isActive,
        'desc' => $desc,
        'perks' => $perks,
        'id' => $id
    ]);

    AuditService::log('package_updated', 'package', (string)$id, $oldPkg, $input, 'admin', $admin['id']);

    Response::json(['success' => true, 'message' => 'Paket berhasil diperbarui.']);
} else {
    Response::error('Method not allowed.', 405);
}

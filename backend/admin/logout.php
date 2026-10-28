<?php
require_once __DIR__ . '/../src/Auth.php';
require_once __DIR__ . '/../src/AuditService.php';

use Hog\Auth;
use Hog\AuditService;

$admin = Auth::getAuthenticatedAdmin();
if ($admin) {
    AuditService::log('admin_logout', 'admin', (string)$admin['id'], null, null, 'admin', $admin['id']);
}
Auth::logoutAdmin();

header('Location: login.php');
exit;

<?php
/**
 * REST API: Agent Authentication
 * POST /api/v1/agent/auth.php
 */
require_once __DIR__ . '/../../../src/Response.php';
require_once __DIR__ . '/../../../src/Auth.php';
require_once __DIR__ . '/../../../src/SessionService.php';

use Hog\Response;
use Hog\Auth;
use Hog\SessionService;

Response::cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed. Use POST.', 405);
}

$input = Response::getJsonInput();
$pcCode = trim($input['pc_code'] ?? '');
$apiKey = trim($input['api_key'] ?? '');
$agentVersion = trim($input['agent_version'] ?? '1.0.0');

if (empty($pcCode) || empty($apiKey)) {
    Response::error('pc_code and api_key are required.', 400);
}

$agent = Auth::validateAgent($pcCode, $apiKey);

if (!$agent) {
    Response::error('Invalid PC credentials.', 401);
}

if (!empty($agent['disabled'])) {
    Response::error("PC {$agent['pc_code']} is disabled by administrator.", 403);
}

// Fetch active session if any exists
$activeSession = SessionService::getActiveSession((int)$agent['pc_id']);

Response::json([
    'success' => true,
    'message' => 'Agent authenticated successfully.',
    'pc' => [
        'id' => (int)$agent['pc_id'],
        'pc_code' => $agent['pc_code'],
        'room_type' => $agent['room_type'],
        'default_duration_minutes' => (int)$agent['default_duration_minutes']
    ],
    'has_active_session' => $activeSession !== null,
    'session' => $activeSession
]);

<?php
/**
 * REST API: Agent Session Management (Idempotent & Restart-Safe)
 * GET  /api/v1/agent/session.php -> Get current session state
 * POST /api/v1/agent/session.php -> Start or resume session on startup
 */
require_once __DIR__ . '/../../../src/Response.php';
require_once __DIR__ . '/../../../src/Auth.php';
require_once __DIR__ . '/../../../src/SessionService.php';

use Hog\Response;
use Hog\Auth;
use Hog\SessionService;

Response::cors();

$agent = Auth::getAgentFromHeaders();
if (!$agent) {
    Response::error('Unauthorized Agent request.', 401);
}

$pcId = (int)$agent['pc_id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $session = SessionService::getActiveSession($pcId);
    Response::json([
        'success' => true,
        'has_active_session' => $session !== null,
        'session' => $session
    ]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = Response::getJsonInput();
    $requestedMinutes = !empty($input['duration_minutes']) ? (int)$input['duration_minutes'] : null;

    try {
        $result = SessionService::handleAgentStartup($pcId, $requestedMinutes);
        Response::json([
            'success' => true,
            'resumed' => $result['resumed'],
            'is_new' => $result['is_new'],
            'message' => $result['message'],
            'session' => $result['session']
        ]);
    } catch (\Exception $e) {
        Response::error($e->getMessage(), 400);
    }
} else {
    Response::error('Method not allowed.', 405);
}

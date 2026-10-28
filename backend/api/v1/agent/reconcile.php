<?php
/**
 * REST API: Agent State Reconciliation
 * POST /api/v1/agent/reconcile.php
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

$agent = Auth::getAgentFromHeaders();
if (!$agent) {
    Response::error('Unauthorized Agent request.', 401);
}

$pcId = (int)$agent['pc_id'];
$input = Response::getJsonInput();
$clientSessionId = !empty($input['session_id']) ? (int)$input['session_id'] : null;

// Retrieve authoritative backend state
$serverSession = SessionService::getActiveSession($pcId);

$inSync = false;
if ($serverSession && $clientSessionId && (int)$serverSession['id'] === $clientSessionId) {
    $inSync = true;
}

Response::json([
    'success' => true,
    'in_sync' => $inSync,
    'has_active_session' => $serverSession !== null,
    'session' => $serverSession,
    'message' => $inSync ? 'Agent state synchronized with backend.' : 'Authoritative state reconciled.'
]);

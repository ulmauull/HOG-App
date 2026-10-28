<?php
/**
 * REST API: Agent Heartbeat & Telemetry
 * POST /api/v1/agent/heartbeat.php
 */
require_once __DIR__ . '/../../../src/Response.php';
require_once __DIR__ . '/../../../src/Auth.php';
require_once __DIR__ . '/../../../src/Database.php';
require_once __DIR__ . '/../../../src/SessionService.php';

use Hog\Response;
use Hog\Auth;
use Hog\Database;
use Hog\SessionService;

Response::cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed. Use POST.', 405);
}

$agent = Auth::getAgentFromHeaders();
if (!$agent) {
    Response::error('Unauthorized Agent request. Check X-PC-Code and X-Agent-Key headers.', 401);
}

$input = Response::getJsonInput();
$pcId = (int)$agent['pc_id'];
$sessionId = !empty($input['session_id']) ? (int)$input['session_id'] : null;
$agentVersion = trim($input['agent_version'] ?? $agent['agent_version']);
$clientTime = trim($input['client_timestamp'] ?? date('Y-m-d H:i:s'));
$cpuLoad = isset($input['cpu_load']) ? (float)$input['cpu_load'] : null;
$ramUsage = isset($input['ram_usage_mb']) ? (int)$input['ram_usage_mb'] : null;
$pingMs = isset($input['ping_ms']) ? (int)$input['ping_ms'] : null;
$healthStatus = trim($input['health_status'] ?? 'ok');
$uptimeSeconds = isset($input['system_uptime_seconds']) ? (int)$input['system_uptime_seconds'] : 0;
$ipAddress = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

$db = Database::getConnection();

// Update agent connectivity in database
$stmt = $db->prepare('
    UPDATE pc_agents
    SET is_online = 1,
        last_heartbeat_at = NOW(),
        last_ip_address = :ip,
        health_status = :health,
        system_uptime_seconds = :uptime,
        agent_version = :version,
        updated_at = NOW()
    WHERE pc_id = :pc_id
');
$stmt->execute([
    'ip' => $ipAddress,
    'health' => $healthStatus,
    'uptime' => $uptimeSeconds,
    'version' => $agentVersion,
    'pc_id' => $pcId
]);

// Insert into heartbeat_logs for telemetry history (throttle or latest)
$stmt = $db->prepare('
    INSERT INTO heartbeat_logs (
        pc_id, session_id, agent_version, client_timestamp, server_timestamp,
        cpu_load_percent, ram_usage_mb, ping_ms, health_status, ip_address
    ) VALUES (
        :pc_id, :session_id, :version, :client_time, NOW(),
        :cpu, :ram, :ping, :health, :ip
    )
');
$stmt->execute([
    'pc_id' => $pcId,
    'session_id' => $sessionId,
    'version' => $agentVersion,
    'client_time' => $clientTime,
    'cpu' => $cpuLoad,
    'ram' => $ramUsage,
    'ping' => $pingMs,
    'health' => $healthStatus,
    'ip' => $ipAddress
]);

// Retrieve authoritative current session
$activeSession = SessionService::getActiveSession($pcId);

Response::json([
    'success' => true,
    'ack' => true,
    'pc_code' => $agent['pc_code'],
    'has_active_session' => $activeSession !== null,
    'session' => $activeSession,
    'server_time' => date('Y-m-d H:i:s'),
    'remaining_seconds' => $activeSession ? $activeSession['remaining_seconds'] : 0
]);

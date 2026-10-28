<?php
namespace Hog;

use PDO;
use DateTime;
use DateTimeZone;

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/AuditService.php';

class SessionService {
    /**
     * Get the active session for a PC, if any
     */
    public static function getActiveSession(int $pcId): ?array {
        $db = Database::getConnection();

        // Expire overdue sessions first
        self::expireOverdueSessions($pcId);

        $stmt = $db->prepare('
            SELECT s.*, p.pc_code, p.room_type,
                   c.name as customer_name, c.phone as customer_phone
            FROM sessions s
            JOIN pcs p ON p.id = s.pc_id
            LEFT JOIN customers c ON c.id = s.customer_id
            WHERE s.pc_id = :pc_id
              AND s.status IN (\'active\', \'extended\')
              AND s.scheduled_end_time > NOW()
            ORDER BY s.id DESC
            LIMIT 1
        ');
        $stmt->execute(['pc_id' => $pcId]);
        $session = $stmt->fetch();

        if ($session) {
            $session['remaining_seconds'] = self::calculateRemainingSeconds($session['scheduled_end_time']);
            return $session;
        }

        return null;
    }

    /**
     * Authoritative calculation: remaining_seconds = max(0, end_timestamp - server_timestamp)
     */
    public static function calculateRemainingSeconds(string $scheduledEndTime): int {
        $endTime = strtotime($scheduledEndTime);
        $currentTime = time();
        return max(0, $endTime - $currentTime);
    }

    /**
     * Create or resume a session for an agent startup (Idempotent & Restart-safe)
     */
    public static function handleAgentStartup(int $pcId, ?int $requestedDurationMinutes = null): array {
        $db = Database::getConnection();

        // 1. RESTART RECOVERY: Check if an active session already exists
        $existingSession = self::getActiveSession($pcId);
        if ($existingSession) {
            return [
                'resumed' => true,
                'is_new' => false,
                'session' => $existingSession,
                'message' => 'Active session resumed after startup/restart.'
            ];
        }

        // 2. Fetch PC details
        $stmt = $db->prepare('SELECT id, pc_code, room_type, is_enabled, default_duration_minutes FROM pcs WHERE id = :id');
        $stmt->execute(['id' => $pcId]);
        $pc = $stmt->fetch();

        if (!$pc || (int)$pc['is_enabled'] !== 1) {
            throw new \Exception('PC is disabled or not found.');
        }

        // 3. Determine applicable duration (operator-configured per PC or fallback)
        $duration = $requestedDurationMinutes ?: (int)$pc['default_duration_minutes'];
        if ($duration <= 0) {
            $duration = 120; // 2 hours default fallback
        }

        // 4. Create exactly one session (Idempotent creation)
        $sessionCode = 'SESS-' . date('Ymd-His') . '-' . $pc['pc_code'];
        
        $now = new DateTime('now', new DateTimeZone('Asia/Jakarta'));
        $startTime = $now->format('Y-m-d H:i:s');
        $endDateTime = clone $now;
        $endDateTime->modify("+{$duration} minutes");
        $scheduledEndTime = $endDateTime->format('Y-m-d H:i:s');

        $stmt = $db->prepare('
            INSERT INTO sessions (
                session_code, pc_id, start_time, scheduled_end_time, duration_minutes, status, start_type, created_at
            ) VALUES (
                :session_code, :pc_id, :start_time, :scheduled_end_time, :duration, \'active\', \'agent_startup\', NOW()
            )
        ');
        $stmt->execute([
            'session_code' => $sessionCode,
            'pc_id' => $pcId,
            'start_time' => $startTime,
            'scheduled_end_time' => $scheduledEndTime,
            'duration' => $duration
        ]);

        $sessionId = (int)$db->lastInsertId();

        // Update PC current_session_id
        $db->prepare('UPDATE pcs SET current_session_id = :sess_id WHERE id = :id')
           ->execute(['sess_id' => $sessionId, 'id' => $pcId]);

        AuditService::log('session_created', 'session', (string)$sessionId, null, [
            'pc_code' => $pc['pc_code'],
            'start_type' => 'agent_startup',
            'duration_minutes' => $duration,
            'scheduled_end_time' => $scheduledEndTime
        ], 'agent');

        $sessionData = self::getActiveSession($pcId);

        return [
            'resumed' => false,
            'is_new' => true,
            'session' => $sessionData,
            'message' => 'New session created successfully.'
        ];
    }

    /**
     * Start a session manually (Admin / Walk-in)
     */
    public static function startManualSession(
        int $pcId,
        int $durationMinutes,
        string $startType = 'admin_manual',
        ?int $customerId = null,
        ?int $bookingId = null,
        ?string $notes = null,
        ?int $adminId = null
    ): array {
        $db = Database::getConnection();

        // Check if there is already an active session
        $existing = self::getActiveSession($pcId);
        if ($existing) {
            throw new \Exception('PC already has an active session.');
        }

        $stmt = $db->prepare('SELECT id, pc_code, is_enabled FROM pcs WHERE id = :id');
        $stmt->execute(['id' => $pcId]);
        $pc = $stmt->fetch();

        if (!$pc || (int)$pc['is_enabled'] !== 1) {
            throw new \Exception('PC is disabled or not found.');
        }

        $sessionCode = 'SESS-' . date('Ymd-His') . '-' . $pc['pc_code'];
        $now = new DateTime('now', new DateTimeZone('Asia/Jakarta'));
        $startTime = $now->format('Y-m-d H:i:s');
        $endDateTime = clone $now;
        $endDateTime->modify("+{$durationMinutes} minutes");
        $scheduledEndTime = $endDateTime->format('Y-m-d H:i:s');

        $stmt = $db->prepare('
            INSERT INTO sessions (
                session_code, pc_id, customer_id, booking_id, start_time, scheduled_end_time,
                duration_minutes, status, start_type, notes, created_at
            ) VALUES (
                :session_code, :pc_id, :customer_id, :booking_id, :start_time, :scheduled_end_time,
                :duration, \'active\', :start_type, :notes, NOW()
            )
        ');
        $stmt->execute([
            'session_code' => $sessionCode,
            'pc_id' => $pcId,
            'customer_id' => $customerId,
            'booking_id' => $bookingId,
            'start_time' => $startTime,
            'scheduled_end_time' => $scheduledEndTime,
            'duration' => $durationMinutes,
            'start_type' => $startType,
            'notes' => $notes
        ]);

        $sessionId = (int)$db->lastInsertId();

        $db->prepare('UPDATE pcs SET current_session_id = :sess_id WHERE id = :id')
           ->execute(['sess_id' => $sessionId, 'id' => $pcId]);

        AuditService::log('session_manual_start', 'session', (string)$sessionId, null, [
            'pc_code' => $pc['pc_code'],
            'start_type' => $startType,
            'duration' => $durationMinutes,
            'customer_id' => $customerId
        ], 'admin', $adminId);

        return self::getActiveSession($pcId);
    }

    /**
     * Extend an active session
     */
    public static function extendSession(int $pcId, int $extraMinutes, ?int $adminId = null): array {
        if ($extraMinutes <= 0) {
            throw new \Exception('Extra minutes must be greater than zero.');
        }

        $session = self::getActiveSession($pcId);
        if (!$session) {
            throw new \Exception('No active session found for this PC to extend.');
        }

        $db = Database::getConnection();

        $currentEnd = new DateTime($session['scheduled_end_time'], new DateTimeZone('Asia/Jakarta'));
        $currentEnd->modify("+{$extraMinutes} minutes");
        $newEndTime = $currentEnd->format('Y-m-d H:i:s');
        $newDuration = (int)$session['duration_minutes'] + $extraMinutes;

        $stmt = $db->prepare('
            UPDATE sessions
            SET scheduled_end_time = :new_end_time,
                duration_minutes = :new_duration,
                status = \'extended\',
                updated_at = NOW()
            WHERE id = :id
        ');
        $stmt->execute([
            'new_end_time' => $newEndTime,
            'new_duration' => $newDuration,
            'id' => $session['id']
        ]);

        AuditService::log('session_extended', 'session', (string)$session['id'], [
            'old_end_time' => $session['scheduled_end_time'],
            'old_duration' => $session['duration_minutes']
        ], [
            'new_end_time' => $newEndTime,
            'added_minutes' => $extraMinutes,
            'new_duration' => $newDuration
        ], 'admin', $adminId);

        return self::getActiveSession($pcId);
    }

    /**
     * End session manually (operator control)
     */
    public static function endSession(int $pcId, ?string $reason = null, ?int $adminId = null): void {
        $session = self::getActiveSession($pcId);
        if (!$session) {
            return;
        }

        $db = Database::getConnection();
        $now = date('Y-m-d H:i:s');

        $stmt = $db->prepare('
            UPDATE sessions
            SET status = \'ended_manual\',
                actual_end_time = :now,
                notes = CONCAT(COALESCE(notes, \'\'), :reason),
                updated_at = NOW()
            WHERE id = :id
        ');
        $stmt->execute([
            'now' => $now,
            'reason' => $reason ? " [Ended manually: {$reason}]" : " [Ended manually by admin]",
            'id' => $session['id']
        ]);

        // Clear current session from PC
        $db->prepare('UPDATE pcs SET current_session_id = NULL WHERE id = :id')
           ->execute(['id' => $pcId]);

        AuditService::log('session_ended_manual', 'session', (string)$session['id'], [
            'scheduled_end_time' => $session['scheduled_end_time'],
        ], [
            'actual_end_time' => $now,
            'reason' => $reason
        ], 'admin', $adminId);
    }

    /**
     * Expire sessions that reached scheduled_end_time
     */
    public static function expireOverdueSessions(?int $pcId = null): int {
        $db = Database::getConnection();
        $sql = '
            UPDATE sessions
            SET status = \'expired\',
                actual_end_time = scheduled_end_time,
                updated_at = NOW()
            WHERE status IN (\'active\', \'extended\')
              AND scheduled_end_time <= NOW()
        ';
        if ($pcId !== null) {
            $sql .= ' AND pc_id = ' . (int)$pcId;
        }

        $count = $db->exec($sql);

        // Clear pcs.current_session_id for expired ones
        $db->exec('
            UPDATE pcs p
            LEFT JOIN sessions s ON s.id = p.current_session_id
            SET p.current_session_id = NULL
            WHERE p.current_session_id IS NOT NULL
              AND (s.id IS NULL OR s.status IN (\'expired\', \'ended_manual\'))
        ');

        return $count;
    }
}

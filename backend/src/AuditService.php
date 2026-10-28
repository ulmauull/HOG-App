<?php
namespace Hog;

use PDO;

require_once __DIR__ . '/Database.php';

class AuditService {
    public static function log(
        string $action,
        string $entityType,
        ?string $entityId = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        string $actorType = 'admin',
        ?int $adminId = null
    ): void {
        try {
            $db = Database::getConnection();
            $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

            $stmt = $db->prepare('
                INSERT INTO audit_logs (
                    admin_id, actor_type, action, entity_type, entity_id, old_values, new_values, ip_address, created_at
                ) VALUES (
                    :admin_id, :actor_type, :action, :entity_type, :entity_id, :old_values, :new_values, :ip_address, NOW()
                )
            ');

            $stmt->execute([
                'admin_id' => $adminId,
                'actor_type' => $actorType,
                'action' => $action,
                'entity_type' => $entityType,
                'entity_id' => $entityId,
                'old_values' => $oldValues ? json_encode($oldValues, JSON_UNESCAPED_SLASHES) : null,
                'new_values' => $newValues ? json_encode($newValues, JSON_UNESCAPED_SLASHES) : null,
                'ip_address' => $ip,
            ]);
        } catch (\Exception $e) {
            // Fail silently so audit failures do not break critical operations, but log to error_log
            error_log('Audit logging failed: ' . $e->getMessage());
        }
    }
}

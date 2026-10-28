<?php
$pageTitle = 'Audit Trail &amp; Log';
require_once __DIR__ . '/header.php';
require_once __DIR__ . '/../src/Database.php';

use Hog\Database;

$db = Database::getConnection();
$stmt = $db->query("
    SELECT a.*, adm.username as admin_username, adm.full_name as admin_full_name
    FROM audit_logs a
    LEFT JOIN admins adm ON adm.id = a.admin_id
    ORDER BY a.id DESC LIMIT 100
");
$logs = $stmt->fetchAll();
?>

<div class="flex flex-col gap-6">
  <div>
    <h1 class="text-2xl font-bold text-white tracking-tight">Audit Trail &amp; Riwayat Aktivitas</h1>
    <p class="text-sm text-gray-400">Pencatatan resmi setiap tindakan operator, perubahan konfigurasi, dan event sistem.</p>
  </div>

  <div class="bg-surface-card rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs text-gray-300">
        <thead class="uppercase bg-surface-base text-gray-400 border-b border-gray-800">
          <tr>
            <th class="px-4 py-3">Waktu (WIB)</th>
            <th class="px-4 py-3">Aktor</th>
            <th class="px-4 py-3">Tindakan</th>
            <th class="px-4 py-3">Entitas</th>
            <th class="px-4 py-3">Data Perubahan</th>
            <th class="px-4 py-3">IP Address</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800 font-mono">
          <?php if (empty($logs)): ?>
            <tr>
              <td colspan="6" class="px-4 py-8 text-center text-gray-500 italic font-sans">
                Belum ada catatan aktivitas audit.
              </td>
            </tr>
          <?php else: ?>
            <?php foreach ($logs as $l): ?>
              <tr class="hover:bg-surface-elevated/40">
                <td class="px-4 py-2.5 text-gray-400 whitespace-nowrap"><?= htmlspecialchars($l['created_at']) ?></td>
                <td class="px-4 py-2.5">
                  <span class="font-bold text-white"><?= htmlspecialchars($l['admin_username'] ?: $l['actor_type']) ?></span>
                  <span class="text-[10px] text-gray-500 block"><?= ucfirst($l['actor_type']) ?></span>
                </td>
                <td class="px-4 py-2.5 font-bold text-primary-container"><?= htmlspecialchars($l['action']) ?></td>
                <td class="px-4 py-2.5 text-gray-300">
                  <?= htmlspecialchars($l['entity_type']) ?> #<?= htmlspecialchars($l['entity_id'] ?: '-') ?>
                </td>
                <td class="px-4 py-2.5 text-gray-400 max-w-xs truncate" title="<?= htmlspecialchars($l['new_values'] ?: '') ?>">
                  <?= htmlspecialchars(substr($l['new_values'] ?: '-', 0, 80)) ?>
                </td>
                <td class="px-4 py-2.5 text-gray-500 whitespace-nowrap"><?= htmlspecialchars($l['ip_address']) ?></td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>
</div>

<?php require_once __DIR__ . '/footer.php'; ?>

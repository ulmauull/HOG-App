<?php
$pageTitle = 'Pengaturan Operasional';
require_once __DIR__ . '/header.php';
require_once __DIR__ . '/../src/Database.php';

use Hog\Database;

$db = Database::getConnection();
$stmt = $db->query('SELECT * FROM system_settings ORDER BY setting_key ASC');
$settings = $stmt->fetchAll();
?>

<div class="flex flex-col gap-6 max-w-4xl">
  <div>
    <h1 class="text-2xl font-bold text-white tracking-tight">Pengaturan &amp; Kebijakan Operasional HOG</h1>
    <p class="text-sm text-gray-400">Konfigurasi interval heartbeat agent, toleransi keterlambatan (grace period), dan parameter sistem.</p>
  </div>

  <div class="bg-surface-card rounded-2xl p-6 border border-gray-800 shadow-xl">
    <form id="settingsForm" class="flex flex-col gap-5">
      <?php foreach ($settings as $s): ?>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-800/80">
          <div class="max-w-md">
            <label class="font-mono text-sm font-bold text-primary-container block"><?= htmlspecialchars($s['setting_key']) ?></label>
            <span class="text-xs text-gray-400"><?= htmlspecialchars($s['description']) ?></span>
          </div>
          <div class="w-full sm:w-64">
            <input type="text" name="<?= htmlspecialchars($s['setting_key']) ?>" value="<?= htmlspecialchars($s['setting_value']) ?>"
              class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium text-sm focus:border-primary-container">
          </div>
        </div>
      <?php endforeach; ?>

      <div class="flex justify-end pt-3">
        <button type="submit" id="btnSave" class="px-6 py-2.5 rounded-lg bg-primary-container text-on-primary-fixed text-sm font-bold hover:shadow-[0_0_20px_rgba(0,255,102,0.4)] transition-all">
          Simpan Pengaturan
        </button>
      </div>
    </form>
  </div>
</div>

<script>
document.getElementById('settingsForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const settings = {};
  formData.forEach((val, key) => { settings[key] = val; });

  try {
    const res = await fetch('../api/v1/admin/settings.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings })
    });
    const data = await res.json();
    if (data.success) {
      alert(data.message);
      window.location.reload();
    } else {
      alert('Gagal: ' + data.error);
    }
  } catch (err) {
    alert('Koneksi error.');
  }
});
</script>

<?php require_once __DIR__ . '/footer.php'; ?>

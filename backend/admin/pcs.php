<?php
$pageTitle = 'PC Mapping (12 Rig)';
require_once __DIR__ . '/header.php';
require_once __DIR__ . '/../src/Database.php';
require_once __DIR__ . '/../src/SessionService.php';

use Hog\Database;
use Hog\SessionService;

SessionService::expireOverdueSessions();
$db = Database::getConnection();

// Offline threshold
$stmt = $db->query("SELECT setting_value FROM system_settings WHERE setting_key = 'offline_threshold_seconds' LIMIT 1");
$offlineSec = (int)($stmt->fetchColumn() ?: DEFAULT_OFFLINE_THRESHOLD_SEC);

// Fetch all 12 PCs
$stmt = $db->query("
    SELECT 
        p.*,
        COALESCE(p.last_heartbeat, a.last_heartbeat_at) as effective_last_heartbeat,
        a.agent_version,
        s.id as active_session_id,
        s.session_code,
        s.scheduled_start_time as session_start_time,
        s.scheduled_end_time,
        s.duration_minutes as session_duration_minutes,
        s.start_type as session_start_type,
        s.status as session_status,
        c.name as customer_name,
        c.phone as customer_phone
    FROM pcs p
    LEFT JOIN pc_agents a ON a.pc_id = p.id
    LEFT JOIN sessions s ON s.id = p.current_session_id AND s.status IN ('active', 'extended') AND s.scheduled_end_time > NOW()
    LEFT JOIN bookings b ON b.id = s.booking_id
    LEFT JOIN customers c ON c.id = b.customer_id
    ORDER BY p.id ASC
");
$pcs = $stmt->fetchAll();
?>

<div class="flex flex-col gap-8">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-white tracking-tight">PC Mapping &amp; Session Control (12 Rig)</h1>
      <p class="text-sm text-gray-400">Kontrol real-time stasiun gaming, perpanjangan billing, dan konfigurasi hardware.</p>
    </div>
    <div class="flex items-center gap-3">
      <button onclick="window.location.reload()" class="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-elevated text-gray-200 text-sm font-semibold transition-colors flex items-center gap-1.5 border border-gray-700">
        <span class="material-symbols-outlined text-[18px]">refresh</span>
        <span>Refresh State</span>
      </button>
    </div>
  </div>

  <!-- 12 PC Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    <?php foreach ($pcs as $pc): 
      $lastHb = $pc['effective_last_heartbeat'] ?? null;
      $hbDiff = !empty($lastHb) ? max(0, time() - strtotime($lastHb)) : null;
      $isOnline = (!empty($lastHb) && $hbDiff !== null && $hbDiff <= $offlineSec);
      $hasSession = !empty($pc['scheduled_end_time']);
      $remSec = $hasSession ? SessionService::calculateRemainingSeconds($pc['scheduled_end_time']) : 0;
      $isEnabled = (int)$pc['is_enabled'] === 1;

      $cardBorder = 'border-gray-800';
      $statusBadge = 'bg-status-available/10 text-status-available border-status-available/30';
      $statusText = 'Tersedia';

      if (!$isEnabled) {
          $cardBorder = 'border-gray-800 opacity-60';
          $statusBadge = 'bg-gray-800 text-gray-400 border-gray-700';
          $statusText = 'Dinonaktifkan';
      } elseif ($hasSession) {
          $cardBorder = 'border-status-in-use/40 shadow-[0_0_20px_rgba(120,229,236,0.1)]';
          $statusBadge = 'bg-status-in-use/10 text-status-in-use border-status-in-use/30';
          $statusText = 'Digunakan';
      } elseif (!$isOnline) {
          $statusBadge = 'bg-gray-800 text-gray-400 border-gray-700';
          $statusText = 'Offline';
      }

      $coolingTag = ($pc['cooling'] ?? ($pc['room_type'] === 'smoking' ? 'FAN' : 'AC')) === 'AC'
        ? '<span class="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">AC</span>'
        : '<span class="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">FAN</span>';

      $smokingPolicy = $pc['smoking_policy'] ?? ($pc['room_type'] === 'smoking' ? 'YA' : 'NO');
    ?>
      <div class="bg-surface-card rounded-2xl p-5 border <?= $cardBorder ?> flex flex-col justify-between gap-4 transition-all">
        <!-- Top Info -->
        <div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="font-display font-bold text-xl text-white"><?= htmlspecialchars($pc['pc_code']) ?></span>
              <?= $coolingTag ?>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded <?= $smokingPolicy === 'YA' ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40' : ($smokingPolicy === 'FLEXIBLE' ? 'bg-blue-950/60 text-blue-300 border border-blue-500/40' : 'bg-gray-800 text-gray-400') ?>">
                Rokok: <?= $smokingPolicy ?>
              </span>
            </div>

            <!-- Heartbeat Connectivity Pulse -->
            <div class="flex items-center gap-1.5" title="<?= $isOnline ? 'Agent Connected (' . $hbDiff . 's ago)' : 'Agent Offline' ?>">
              <span class="w-2.5 h-2.5 rounded-full <?= $isOnline ? 'bg-status-available animate-pulse' : 'bg-status-offline' ?>"></span>
              <span class="text-[11px] font-semibold text-gray-400"><?= $isOnline ? 'Online' : 'Offline' ?></span>
            </div>
          </div>

          <!-- Specs Summary -->
          <div class="mt-2 text-xs text-gray-400 space-y-0.5">
            <div><span class="text-gray-500">GPU:</span> <strong class="text-amber-400 font-bold"><?= htmlspecialchars($pc['specs_gpu']) ?></strong></div>
            <div><span class="text-gray-500">CPU:</span> <span class="text-gray-200"><?= htmlspecialchars($pc['specs_cpu'] ?? 'i5 Gen 12') ?></span></div>
            <div><span class="text-gray-500">Monitor:</span> <span class="text-cyan-400 font-mono font-bold"><?= htmlspecialchars($pc['specs_display']) ?></span></div>
          </div>
        </div>

        <!-- Session Status & Countdown Area -->
        <div class="p-3.5 rounded-xl bg-surface-base border border-gray-800 flex flex-col gap-1.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full border <?= $statusBadge ?>">
              <?= $statusText ?>
            </span>
            <button onclick="editPc(<?= htmlspecialchars(json_encode($pc)) ?>)" class="text-gray-500 hover:text-primary-container p-1" title="Pengaturan PC">
              <span class="material-symbols-outlined text-[18px]">settings</span>
            </button>
          </div>

          <?php if ($hasSession): ?>
            <div class="mt-1">
              <div class="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Sisa Waktu Sesi:</div>
              <div class="text-2xl font-bold font-mono text-status-in-use tracking-tight countdown-timer" data-seconds="<?= $remSec ?>">
                <?= sprintf('%02d:%02d:%02d', ($remSec / 3600), ($remSec % 3600) / 60, $remSec % 60) ?>
              </div>
              <div class="text-xs text-gray-400 truncate mt-0.5">
                Pemain: <strong class="text-white"><?= htmlspecialchars($pc['customer_name'] ?: 'Guest Gamer') ?></strong>
              </div>
              <div class="text-[11px] text-gray-500">
                Berakhir: <?= date('H:i', strtotime($pc['scheduled_end_time'])) ?> WIB
              </div>
            </div>
          <?php else: ?>
            <div class="mt-2 text-xs text-gray-500 italic">
              Default Durasi: <?= $pc['default_duration_minutes'] ?> Menit
            </div>
          <?php endif; ?>
        </div>

        <!-- Operator Action Buttons -->
        <div class="flex items-center gap-2 pt-1 border-t border-gray-800/80">
          <?php if ($hasSession): ?>
            <button onclick="extendSession(<?= $pc['id'] ?>, 30)" class="flex-1 py-1.5 rounded-lg bg-surface-container hover:bg-surface-elevated text-xs font-semibold text-gray-200 transition-colors border border-gray-700 text-center">
              +30m
            </button>
            <button onclick="extendSession(<?= $pc['id'] ?>, 60)" class="flex-1 py-1.5 rounded-lg bg-surface-container hover:bg-surface-elevated text-xs font-semibold text-gray-200 transition-colors border border-gray-700 text-center">
              +60m
            </button>
            <button onclick="endSession(<?= $pc['id'] ?>)" class="p-1.5 rounded-lg bg-red-950/70 hover:bg-red-900 text-red-300 transition-colors border border-red-800" title="Hentikan Sesi Manual">
              <span class="material-symbols-outlined text-[18px]">stop_circle</span>
            </button>
          <?php else: ?>
            <button onclick="quickStart(<?= $pc['id'] ?>, <?= $pc['default_duration_minutes'] ?>)" class="w-full py-2 rounded-lg bg-primary-container text-on-primary-fixed text-xs font-bold hover:shadow-[0_0_15px_rgba(0,255,102,0.3)] transition-all flex items-center justify-center gap-1">
              <span class="material-symbols-outlined text-[16px]">play_arrow</span>
              <span>Mulai Sesi (<?= $pc['default_duration_minutes'] ?>m)</span>
            </button>
          <?php endif; ?>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
</div>

<!-- Edit PC Config Modal -->
<div id="editPcModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4">
  <div class="w-full max-w-md bg-surface-card border border-gray-800 rounded-2xl p-6 shadow-2xl relative">
    <div class="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
      <h3 class="text-base font-bold text-white" id="editModalTitle">Konfigurasi PC</h3>
      <button onclick="closeEditModal()" class="text-gray-400 hover:text-white">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>

    <form id="editPcForm" class="flex flex-col gap-4">
      <input type="hidden" id="editPcId">

      <div>
        <label class="block text-xs font-semibold text-gray-400 uppercase mb-1">Ruangan</label>
        <select id="editRoomType" class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium">
          <option value="smoking">Smoking Room</option>
          <option value="non-smoking">Non-Smoking VIP Room</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-400 uppercase mb-1">Default Durasi Sesi (Menit)</label>
        <input type="number" id="editDefaultDuration" min="15" step="15" required class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium">
      </div>

      <div>
        <label class="flex items-center gap-2 cursor-pointer mt-1">
          <input type="checkbox" id="editIsEnabled" class="w-4 h-4 rounded bg-surface-base border-gray-700 text-primary-container">
          <span class="text-sm font-semibold text-gray-200">PC Diaktifkan (Siap Operasional)</span>
        </label>
      </div>

      <div class="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
        <button type="button" onclick="closeEditModal()" class="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-sm font-semibold">
          Batal
        </button>
        <button type="submit" class="px-5 py-2 rounded-lg bg-primary-container text-on-primary-fixed text-sm font-bold">
          Simpan Perubahan
        </button>
      </div>
    </form>
  </div>
</div>

<script>
// Local Countdown Decrementer
setInterval(() => {
  document.querySelectorAll('.countdown-timer').forEach(el => {
    let sec = parseInt(el.dataset.seconds, 10);
    if (sec > 0) {
      sec--;
      el.dataset.seconds = sec;
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = sec % 60;
      el.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
  });
}, 1000);

async function quickStart(pcId, duration) {
  if (!confirm(`Mulai sesi manual untuk PC ini dengan durasi ${duration} menit?`)) return;
  try {
    const res = await fetch('../api/v1/admin/sessions.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pc_id: pcId, duration_minutes: duration })
    });
    const data = await res.json();
    if (data.success) {
      window.location.reload();
    } else {
      alert('Gagal: ' + data.error);
    }
  } catch (err) {
    alert('Koneksi error.');
  }
}

async function extendSession(pcId, minutes) {
  try {
    const res = await fetch('../api/v1/admin/sessions.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pc_id: pcId, extra_minutes: minutes })
    });
    const data = await res.json();
    if (data.success) {
      window.location.reload();
    } else {
      alert('Gagal: ' + data.error);
    }
  } catch (err) {
    alert('Koneksi error.');
  }
}

async function endSession(pcId) {
  if (!confirm('Hentikan sesi PC ini sekarang? Riwayat sesi akan tetap tersimpan di database.')) return;
  try {
    const res = await fetch('../api/v1/admin/sessions.php', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pc_id: pcId })
    });
    const data = await res.json();
    if (data.success) {
      window.location.reload();
    } else {
      alert('Gagal: ' + data.error);
    }
  } catch (err) {
    alert('Koneksi error.');
  }
}

function editPc(pc) {
  document.getElementById('editModalTitle').textContent = `Konfigurasi ${pc.pc_code}`;
  document.getElementById('editPcId').value = pc.id;
  document.getElementById('editRoomType').value = pc.room_type;
  document.getElementById('editDefaultDuration').value = pc.default_duration_minutes;
  document.getElementById('editIsEnabled').checked = parseInt(pc.is_enabled) === 1;

  document.getElementById('editPcModal').classList.remove('hidden');
  document.getElementById('editPcModal').classList.add('flex');
}

function closeEditModal() {
  document.getElementById('editPcModal').classList.add('hidden');
  document.getElementById('editPcModal').classList.remove('flex');
}

document.getElementById('editPcForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('editPcId').value;
  const room = document.getElementById('editRoomType').value;
  const duration = document.getElementById('editDefaultDuration').value;
  const enabled = document.getElementById('editIsEnabled').checked;

  try {
    const res = await fetch('../api/v1/admin/pcs.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pc_id: parseInt(id),
        room_type: room,
        default_duration_minutes: parseInt(duration),
        is_enabled: enabled ? 1 : 0
      })
    });
    const data = await res.json();
    if (data.success) {
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

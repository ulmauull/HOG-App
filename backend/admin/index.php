<?php
$pageTitle = 'Overview Dashboard';
require_once __DIR__ . '/header.php';
require_once __DIR__ . '/../src/Database.php';
require_once __DIR__ . '/../src/SessionService.php';
require_once __DIR__ . '/../src/BookingService.php';

use Hog\Database;
use Hog\SessionService;
use Hog\BookingService;

BookingService::releaseOverdueBookings();
SessionService::expireOverdueSessions();

$db = Database::getConnection();

// Offline threshold
$stmt = $db->query('SELECT setting_value FROM system_settings WHERE setting_key = \'offline_threshold_seconds\' LIMIT 1');
$offlineSec = (int)($stmt->fetchColumn() ?: DEFAULT_OFFLINE_THRESHOLD_SEC);

// Query stats
$totalPcs = (int)$db->query('SELECT COUNT(*) FROM pcs')->fetchColumn();

$stmt = $db->query("
    SELECT COUNT(*) FROM pcs p
    LEFT JOIN pc_agents a ON a.pc_id = p.id
    WHERE p.is_enabled = 1
      AND (a.last_heartbeat_at IS NULL OR TIMESTAMPDIFF(SECOND, a.last_heartbeat_at, NOW()) > {$offlineSec})
      AND p.current_session_id IS NULL
");
$offlineCount = (int)$stmt->fetchColumn();

$activeSessionsCount = (int)$db->query("SELECT COUNT(*) FROM sessions WHERE status IN ('active', 'extended') AND scheduled_end_time > NOW()")->fetchColumn();

$today = date('Y-m-d');
$reservedCount = (int)$db->query("SELECT COUNT(*) FROM bookings WHERE booking_date = '{$today}' AND status = 'confirmed' AND start_time > CURTIME()")->fetchColumn();

$pendingPaymentsCount = (int)$db->query("SELECT COUNT(*) FROM bookings WHERE status = 'pending_payment'")->fetchColumn();

$availableCount = max(0, $totalPcs - $activeSessionsCount - $reservedCount - $offlineCount);

// Fetch Pending Payments for quick review
$stmt = $db->query("
    SELECT b.*, c.name as customer_name, c.phone as customer_phone, p.pc_code, pay.payment_method, pay.proof_image_path
    FROM bookings b
    JOIN customers c ON c.id = b.customer_id
    JOIN pcs p ON p.id = b.pc_id
    LEFT JOIN payments pay ON pay.booking_id = b.id
    WHERE b.status = 'pending_payment'
    ORDER BY b.id DESC LIMIT 5
");
$pendingBookings = $stmt->fetchAll();

// Fetch 12 PCs snapshot
$stmt = $db->query("
    SELECT p.*, a.is_online, a.last_heartbeat_at, TIMESTAMPDIFF(SECOND, a.last_heartbeat_at, NOW()) as hb_diff,
           s.scheduled_end_time, s.status as session_status
    FROM pcs p
    LEFT JOIN pc_agents a ON a.pc_id = p.id
    LEFT JOIN sessions s ON s.id = p.current_session_id AND s.status IN ('active', 'extended') AND s.scheduled_end_time > NOW()
    ORDER BY p.id ASC
");
$allPcs = $stmt->fetchAll();
?>

<div class="flex flex-col gap-8">
  <!-- Top Bar -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-white tracking-tight">Monitoring Operasional Real-Time</h1>
      <p class="text-sm text-gray-400">Ringkasan status 12 PC gaming rig, sesi aktif, dan verifikasi kasir.</p>
    </div>
    <div class="flex items-center gap-3">
      <button onclick="openWalkinModal()" class="px-4 py-2 rounded-lg bg-primary-container text-on-primary-fixed font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,102,0.4)] transition-all flex items-center gap-1.5 cursor-pointer">
        <span class="material-symbols-outlined text-[18px]">person_add</span>
        <span>Tambah Walk-In</span>
      </button>
      <a href="pcs.php" class="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-elevated text-gray-200 text-sm font-semibold transition-colors flex items-center gap-1.5 border border-gray-700">
        <span class="material-symbols-outlined text-[18px]">grid_view</span>
        <span>PC Mapping 12 Rig</span>
      </a>
    </div>
  </div>

  <!-- Bento Stats Cards -->
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
    <div class="p-4 rounded-xl bg-surface-card border border-gray-800 flex flex-col justify-between">
      <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total PC</span>
      <span class="text-2xl font-bold text-white font-display mt-2"><?= $totalPcs ?> Rig</span>
      <span class="text-[11px] text-gray-500 mt-1">12 Unit Terdaftar</span>
    </div>

    <div class="p-4 rounded-xl bg-surface-card border border-emerald-950/80 bg-emerald-950/10 flex flex-col justify-between">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Tersedia</span>
        <span class="w-2 h-2 rounded-full bg-status-available animate-pulse"></span>
      </div>
      <span class="text-2xl font-bold text-status-available font-display mt-2"><?= $availableCount ?> PC</span>
      <span class="text-[11px] text-emerald-500/80 mt-1">Siap Digunakan</span>
    </div>

    <div class="p-4 rounded-xl bg-surface-card border border-cyan-950/80 bg-cyan-950/10 flex flex-col justify-between">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Sesi Aktif</span>
        <span class="w-2 h-2 rounded-full bg-status-in-use"></span>
      </div>
      <span class="text-2xl font-bold text-status-in-use font-display mt-2"><?= $activeSessionsCount ?> PC</span>
      <span class="text-[11px] text-cyan-500/80 mt-1">Sedang Berlangsung</span>
    </div>

    <div class="p-4 rounded-xl bg-surface-card border border-purple-950/80 bg-purple-950/10 flex flex-col justify-between">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-purple-400 uppercase tracking-wider">Dipesan</span>
        <span class="w-2 h-2 rounded-full bg-status-reserved"></span>
      </div>
      <span class="text-2xl font-bold text-status-reserved font-display mt-2"><?= $reservedCount ?> PC</span>
      <span class="text-[11px] text-purple-500/80 mt-1">Reservasi Hari Ini</span>
    </div>

    <div class="p-4 rounded-xl bg-surface-card border border-gray-800 flex flex-col justify-between">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Offline</span>
        <span class="w-2 h-2 rounded-full bg-status-offline"></span>
      </div>
      <span class="text-2xl font-bold text-gray-400 font-display mt-2"><?= $offlineCount ?> PC</span>
      <span class="text-[11px] text-gray-500 mt-1">Heartbeat Stale</span>
    </div>

    <div class="p-4 rounded-xl bg-surface-card border border-amber-950/80 bg-amber-950/10 flex flex-col justify-between">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-amber-400 uppercase tracking-wider">Verifikasi</span>
        <span class="material-symbols-outlined text-amber-400 text-sm">hourglass_top</span>
      </div>
      <span class="text-2xl font-bold text-amber-400 font-display mt-2"><?= $pendingPaymentsCount ?></span>
      <span class="text-[11px] text-amber-500/80 mt-1">Menunggu Kasir</span>
    </div>
  </div>

  <!-- Real-Time PC Status Grid Snapshot -->
  <div class="bg-surface-card rounded-2xl p-6 border border-gray-800">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-primary-container text-xl">desktop_windows</span>
        <h2 class="text-lg font-bold text-white">Status Live 12 Gaming Rig</h2>
      </div>
      <span class="text-xs text-gray-400">Update setiap 10 detik otomatis</span>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      <?php foreach ($allPcs as $pc): 
        $isOnline = (!empty($pc['last_heartbeat_at']) && $pc['hb_diff'] !== null && (int)$pc['hb_diff'] <= $offlineSec);
        $hasSession = !empty($pc['scheduled_end_time']);
        $rem = $hasSession ? SessionService::calculateRemainingSeconds($pc['scheduled_end_time']) : 0;
        
        $badgeClass = 'bg-status-available text-status-available';
        $statusText = 'Tersedia';
        if ((int)$pc['is_enabled'] !== 1) {
            $badgeClass = 'bg-status-offline text-status-offline';
            $statusText = 'Disabled';
        } elseif (!$isOnline && !$hasSession) {
            $badgeClass = 'bg-status-offline text-status-offline';
            $statusText = 'Offline';
        } elseif ($hasSession) {
            $badgeClass = 'bg-status-in-use text-status-in-use';
            $statusText = 'Digunakan';
        }
      ?>
        <div class="p-3.5 rounded-xl bg-surface-base border border-gray-800 flex flex-col justify-between gap-2.5">
          <div class="flex items-center justify-between">
            <span class="font-bold text-white font-display text-base"><?= htmlspecialchars($pc['pc_code']) ?></span>
            <span class="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
              <?= $pc['room_type'] === 'smoking' ? 'Smk' : 'Non' ?>
            </span>
          </div>

          <div class="flex flex-col">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full <?= $badgeClass ?> <?= $statusText === 'Tersedia' ? 'animate-pulse' : '' ?>"></span>
              <span class="text-xs font-semibold <?= $badgeClass ?>"><?= $statusText ?></span>
            </div>
            <?php if ($hasSession): ?>
              <span class="text-[11px] font-mono text-status-in-use font-bold mt-1">
                <?= sprintf('%02d:%02d:%02d', ($rem / 3600), ($rem % 3600) / 60, $rem % 60) ?>
              </span>
            <?php else: ?>
              <span class="text-[11px] text-gray-500 mt-1"><?= htmlspecialchars(substr($pc['specs_gpu'], 0, 15)) ?></span>
            <?php endif; ?>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>

  <!-- Pending Payments Queue -->
  <div class="bg-surface-card rounded-2xl p-6 border border-gray-800">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-amber-400 text-xl">pending_actions</span>
        <h2 class="text-lg font-bold text-white">Antrean Pembayaran Menunggu Konfirmasi</h2>
      </div>
      <a href="bookings.php?status=pending_payment" class="text-xs text-primary-container hover:underline font-semibold">
        Lihat Semua
      </a>
    </div>

    <?php if (empty($pendingBookings)): ?>
      <div class="py-8 text-center text-sm text-gray-500">
        <span class="material-symbols-outlined text-3xl mb-1 block">check_circle</span>
        Tidak ada pembayaran yang menunggu verifikasi saat ini.
      </div>
    <?php else: ?>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-gray-300">
          <thead class="text-xs uppercase bg-surface-base text-gray-400 border-b border-gray-800">
            <tr>
              <th class="px-4 py-3">Kode Booking</th>
              <th class="px-4 py-3">Customer</th>
              <th class="px-4 py-3">PC / Ruangan</th>
              <th class="px-4 py-3">Jadwal Sesi</th>
              <th class="px-4 py-3">Total Tagihan</th>
              <th class="px-4 py-3">Bukti</th>
              <th class="px-4 py-3 text-right">Aksi Kasir</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <?php foreach ($pendingBookings as $b): ?>
              <tr class="hover:bg-surface-elevated/50 transition-colors">
                <td class="px-4 py-3 font-mono font-bold text-white"><?= htmlspecialchars($b['booking_code']) ?></td>
                <td class="px-4 py-3">
                  <div class="font-medium text-white"><?= htmlspecialchars($b['customer_name']) ?></div>
                  <div class="text-xs text-gray-500"><?= htmlspecialchars($b['customer_phone']) ?></div>
                </td>
                <td class="px-4 py-3">
                  <span class="font-bold text-primary-container"><?= htmlspecialchars($b['pc_code']) ?></span>
                  <span class="text-xs text-gray-400 block"><?= ucfirst($b['room_type']) ?></span>
                </td>
                <td class="px-4 py-3 text-xs">
                  <div><?= htmlspecialchars($b['booking_date']) ?></div>
                  <div class="text-gray-400"><?= htmlspecialchars($b['start_time']) ?> - <?= htmlspecialchars($b['end_time']) ?></div>
                </td>
                <td class="px-4 py-3 font-bold text-white">
                  Rp <?= number_format($b['total_price'], 0, ',', '.') ?>
                </td>
                <td class="px-4 py-3">
                  <?php if (!empty($b['proof_image_path'])): ?>
                    <a href="../<?= htmlspecialchars($b['proof_image_path']) ?>" target="_blank" class="inline-flex items-center gap-1 text-xs text-secondary hover:underline">
                      <span class="material-symbols-outlined text-[16px]">image</span> Lihat Foto
                    </a>
                  <?php else: ?>
                    <span class="text-xs text-gray-500 italic">Belum unggah</span>
                  <?php endif; ?>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="inline-flex items-center gap-2">
                    <button onclick="approvePayment(<?= $b['id'] ?>)" class="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors">
                      Setujui
                    </button>
                    <button onclick="rejectPayment(<?= $b['id'] ?>)" class="px-2.5 py-1 rounded bg-red-800 hover:bg-red-700 text-white text-xs font-semibold transition-colors">
                      Tolak
                    </button>
                  </div>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    <?php endif; ?>
  </div>
</div>

<!-- Walk-in Modal -->
<div id="walkinModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4">
  <div class="w-full max-w-lg bg-surface-card border border-gray-800 rounded-2xl p-6 shadow-2xl relative">
    <div class="flex items-center justify-between pb-4 border-b border-gray-800 mb-5">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-primary-container text-2xl">person_add</span>
        <h3 class="text-lg font-bold text-white">Mulai Sesi Walk-In (Langsung Main)</h3>
      </div>
      <button onclick="closeWalkinModal()" class="text-gray-400 hover:text-white">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>

    <form id="walkinForm" class="flex flex-col gap-4">
      <div>
        <label class="block text-xs font-semibold text-gray-400 uppercase mb-1">Pilih PC Rig</label>
        <select id="walkinPcId" required class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium focus:border-primary-container">
          <?php foreach ($allPcs as $p): ?>
            <?php if ((int)$p['is_enabled'] === 1 && empty($p['scheduled_end_time'])): ?>
              <option value="<?= $p['id'] ?>"><?= $p['pc_code'] ?> (<?= ucfirst($p['room_type']) ?> - <?= $p['specs_gpu'] ?>)</option>
            <?php endif; ?>
          <?php endforeach; ?>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase mb-1">Nama Customer</label>
          <input type="text" id="walkinCustName" placeholder="Contoh: Budi Gaming" required class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium focus:border-primary-container">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase mb-1">No WhatsApp (Opsional)</label>
          <input type="tel" id="walkinCustPhone" placeholder="08123456789" class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium focus:border-primary-container">
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-400 uppercase mb-1">Durasi Bermain</label>
        <select id="walkinDuration" class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium focus:border-primary-container">
          <option value="60">1 Jam (Rp 8.000)</option>
          <option value="120" selected>2 Jam (Rp 16.000)</option>
          <option value="180">3 Jam (Rp 24.000)</option>
          <option value="240">4 Jam - Paket Sore (Rp 35.000)</option>
          <option value="480">8 Jam - Paket Begadang (Rp 50.000)</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-400 uppercase mb-1">Catatan Operator</label>
        <input type="text" id="walkinNotes" placeholder="Bayar Tunai di kasir" class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium focus:border-primary-container">
      </div>

      <div class="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
        <button type="button" onclick="closeWalkinModal()" class="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold">
          Batal
        </button>
        <button type="submit" class="px-5 py-2 rounded-lg bg-primary-container text-on-primary-fixed text-sm font-bold hover:shadow-[0_0_20px_rgba(0,255,102,0.4)]">
          Aktifkan Sesi Sekarang
        </button>
      </div>
    </form>
  </div>
</div>

<script>
function openWalkinModal() {
  document.getElementById('walkinModal').classList.remove('hidden');
  document.getElementById('walkinModal').classList.add('flex');
}
function closeWalkinModal() {
  document.getElementById('walkinModal').classList.add('hidden');
  document.getElementById('walkinModal').classList.remove('flex');
}

document.getElementById('walkinForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const pcId = document.getElementById('walkinPcId').value;
  const custName = document.getElementById('walkinCustName').value;
  const custPhone = document.getElementById('walkinCustPhone').value;
  const duration = document.getElementById('walkinDuration').value;
  const notes = document.getElementById('walkinNotes').value;

  try {
    const res = await fetch('../api/v1/admin/sessions.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pc_id: parseInt(pcId),
        customer_name: custName,
        customer_phone: custPhone,
        duration_minutes: parseInt(duration),
        notes: notes
      })
    });
    const data = await res.json();
    if (data.success) {
      alert('Sesi walk-in berhasil diaktifkan!');
      window.location.reload();
    } else {
      alert('Gagal: ' + data.error);
    }
  } catch (err) {
    alert('Terjadi kesalahan koneksi ke backend.');
  }
});

async function approvePayment(id) {
  if (!confirm('Setujui pembayaran dan konfirmasi reservasi booking ini?')) return;
  try {
    const res = await fetch('../api/v1/admin/bookings.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: id, is_approved: true })
    });
    const data = await res.json();
    if (data.success) {
      alert(data.message);
      window.location.reload();
    } else {
      alert('Gagal: ' + data.error);
    }
  } catch (err) {
    alert('Error menghubungkan ke server.');
  }
}

async function rejectPayment(id) {
  const reason = prompt('Masukkan alasan penolakan pembayaran:');
  if (reason === null) return;
  try {
    const res = await fetch('../api/v1/admin/bookings.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: id, is_approved: false, rejection_reason: reason })
    });
    const data = await res.json();
    if (data.success) {
      alert(data.message);
      window.location.reload();
    } else {
      alert('Gagal: ' + data.error);
    }
  } catch (err) {
    alert('Error menghubungkan ke server.');
  }
}
</script>

<?php require_once __DIR__ . '/footer.php'; ?>

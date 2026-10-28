<?php
$pageTitle = 'Reservasi &amp; Kasir';
require_once __DIR__ . '/header.php';
require_once __DIR__ . '/../src/Database.php';
require_once __DIR__ . '/../src/BookingService.php';

use Hog\Database;
use Hog\BookingService;

BookingService::releaseOverdueBookings();

$db = Database::getConnection();

$statusFilter = $_GET['status'] ?? '';
$roomFilter = $_GET['room'] ?? '';
$dateFilter = $_GET['date'] ?? '';
$search = trim($_GET['search'] ?? '');

$sql = "
    SELECT 
        b.*,
        p.pc_code as orig_pc_code,
        rep.pc_code as rep_pc_code,
        c.name as cust_name,
        c.phone as cust_phone,
        pkg.name as pkg_name,
        pay.payment_method,
        pay.payment_status,
        pay.proof_image_path,
        pay.rejection_reason
    FROM bookings b
    JOIN pcs p ON p.id = b.pc_id
    LEFT JOIN pcs rep ON rep.id = b.replacement_pc_id
    JOIN customers c ON c.id = b.customer_id
    JOIN packages pkg ON pkg.id = b.package_id
    LEFT JOIN payments pay ON pay.booking_id = b.id
    WHERE 1=1
";
$params = [];

if ($statusFilter) {
    $sql .= " AND b.status = :status";
    $params['status'] = $statusFilter;
}
if ($roomFilter) {
    $sql .= " AND b.room_type = :room";
    $params['room'] = $roomFilter;
}
if ($dateFilter) {
    $sql .= " AND b.booking_date = :date";
    $params['date'] = $dateFilter;
}
if ($search) {
    $sql .= " AND (b.booking_code LIKE :search OR c.name LIKE :search OR c.phone LIKE :search)";
    $params['search'] = "%{$search}%";
}

$sql .= " ORDER BY b.booking_date DESC, b.start_time DESC LIMIT 100";

$stmt = $db->prepare($sql);
$stmt->execute($params);
$bookings = $stmt->fetchAll();

$today = date('Y-m-d');
$nowTime = date('H:i:s');
?>

<div class="flex flex-col gap-6">
  <!-- Top Bar & Filters -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-white tracking-tight">Manajemen Reservasi &amp; Kasir</h1>
      <p class="text-sm text-gray-400">Verifikasi bukti transfer, check-in kedatangan, dan alokasi PC pengganti.</p>
    </div>
  </div>

  <!-- Filter Card -->
  <div class="bg-surface-card p-4 rounded-xl border border-gray-800">
    <form method="GET" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      <div>
        <label class="block text-[11px] font-semibold text-gray-400 uppercase mb-1">Status Booking</label>
        <select name="status" class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-sm text-gray-200">
          <option value="">Semua Status</option>
          <option value="pending_payment" <?= $statusFilter === 'pending_payment' ? 'selected' : '' ?>>Menunggu Verifikasi</option>
          <option value="confirmed" <?= $statusFilter === 'confirmed' ? 'selected' : '' ?>>Terkonfirmasi (Locked)</option>
          <option value="checked_in" <?= $statusFilter === 'checked_in' ? 'selected' : '' ?>>Sudah Check-In</option>
          <option value="expired" <?= $statusFilter === 'expired' ? 'selected' : '' ?>>Expired (Telat)</option>
          <option value="cancelled" <?= $statusFilter === 'cancelled' ? 'selected' : '' ?>>Dibatalkan / Ditolak</option>
        </select>
      </div>

      <div>
        <label class="block text-[11px] font-semibold text-gray-400 uppercase mb-1">Ruangan</label>
        <select name="room" class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-sm text-gray-200">
          <option value="">Semua Ruangan</option>
          <option value="smoking" <?= $roomFilter === 'smoking' ? 'selected' : '' ?>>Smoking Room</option>
          <option value="non-smoking" <?= $roomFilter === 'non-smoking' ? 'selected' : '' ?>>Non-Smoking VIP</option>
        </select>
      </div>

      <div>
        <label class="block text-[11px] font-semibold text-gray-400 uppercase mb-1">Tanggal</label>
        <input type="date" name="date" value="<?= htmlspecialchars($dateFilter) ?>" class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-sm text-gray-200">
      </div>

      <div>
        <label class="block text-[11px] font-semibold text-gray-400 uppercase mb-1">Cari Kode / Nama</label>
        <input type="text" name="search" value="<?= htmlspecialchars($search) ?>" placeholder="HOG-..." class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-sm text-gray-200">
      </div>

      <div class="flex items-end gap-2">
        <button type="submit" class="flex-1 py-2 rounded-lg bg-surface-container hover:bg-surface-elevated text-white font-semibold text-sm transition-colors border border-gray-700">
          Terapkan Filter
        </button>
        <a href="bookings.php" class="px-3 py-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white text-sm" title="Reset">
          <span class="material-symbols-outlined text-[18px]">restart_alt</span>
        </a>
      </div>
    </form>
  </div>

  <!-- Bookings Table -->
  <div class="bg-surface-card rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm text-gray-300">
        <thead class="text-xs uppercase bg-surface-base text-gray-400 border-b border-gray-800">
          <tr>
            <th class="px-4 py-3.5">Kode &amp; Tanggal</th>
            <th class="px-4 py-3.5">Pemain</th>
            <th class="px-4 py-3.5">PC Target</th>
            <th class="px-4 py-3.5">Paket &amp; Jam</th>
            <th class="px-4 py-3.5">Status &amp; Pembayaran</th>
            <th class="px-4 py-3.5 text-right">Tindakan Kasir</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800">
          <?php if (empty($bookings)): ?>
            <tr>
              <td colspan="6" class="px-4 py-8 text-center text-gray-500 italic">
                Tidak ada data reservasi yang cocok dengan kriteria pencarian.
              </td>
            </tr>
          <?php else: ?>
            <?php foreach ($bookings as $b): 
              $isLate = ($b['booking_date'] === $today && $b['status'] === 'confirmed' && $nowTime > $b['start_time']);
              $assignedPc = $b['rep_pc_code'] ?: $b['orig_pc_code'];
            ?>
              <tr class="hover:bg-surface-elevated/40 transition-colors">
                <!-- Code -->
                <td class="px-4 py-3.5">
                  <div class="font-mono font-bold text-white"><?= htmlspecialchars($b['booking_code']) ?></div>
                  <div class="text-xs text-gray-400"><?= htmlspecialchars($b['booking_date']) ?></div>
                  <?php if (!empty($b['rep_pc_code'])): ?>
                    <span class="text-[10px] text-primary-container bg-primary-container/10 px-1.5 py-0.5 rounded font-bold">
                      PC Diganti
                    </span>
                  <?php endif; ?>
                </td>

                <!-- Customer -->
                <td class="px-4 py-3.5">
                  <div class="font-medium text-white"><?= htmlspecialchars($b['cust_name']) ?></div>
                  <div class="text-xs text-gray-400"><?= htmlspecialchars($b['cust_phone']) ?></div>
                </td>

                <!-- PC & Room -->
                <td class="px-4 py-3.5">
                  <div class="font-bold text-primary-container text-base"><?= htmlspecialchars($assignedPc) ?></div>
                  <span class="text-xs text-gray-400"><?= ucfirst($b['room_type']) ?></span>
                </td>

                <!-- Package & Time -->
                <td class="px-4 py-3.5 text-xs">
                  <div class="font-semibold text-gray-200"><?= htmlspecialchars($b['pkg_name']) ?></div>
                  <div class="text-gray-400"><?= substr($b['start_time'], 0, 5) ?> - <?= substr($b['end_time'], 0, 5) ?> WIB</div>
                  <div class="text-gray-500">Rp <?= number_format($b['total_price'], 0, ',', '.') ?></div>
                </td>

                <!-- Status & Payment -->
                <td class="px-4 py-3.5">
                  <div class="flex flex-col gap-1">
                    <span class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full w-max
                      <?php
                        switch ($b['status']) {
                          case 'confirmed': echo 'bg-status-available/10 text-status-available border border-status-available/30'; break;
                          case 'checked_in': echo 'bg-status-in-use/10 text-status-in-use border border-status-in-use/30'; break;
                          case 'pending_payment': echo 'bg-amber-950/60 text-amber-300 border border-amber-800/40'; break;
                          case 'expired': echo 'bg-red-950/60 text-red-300 border border-red-800/40'; break;
                          default: echo 'bg-gray-800 text-gray-400'; break;
                        }
                      ?>
                    ">
                      <?= ucfirst(str_replace('_', ' ', $b['status'])) ?>
                    </span>

                    <span class="text-xs text-gray-400">
                      Metode: <strong class="text-gray-300 uppercase"><?= htmlspecialchars($b['payment_method']) ?></strong>
                    </span>

                    <?php if (!empty($b['proof_image_path'])): 
                      $proofUrl = str_starts_with($b['proof_image_path'], 'http') ? $b['proof_image_path'] : '../' . $b['proof_image_path'];
                    ?>
                      <button onclick="viewProof('<?= htmlspecialchars($proofUrl) ?>')" class="text-xs text-secondary hover:underline flex items-center gap-1 text-left cursor-pointer">
                        <span class="material-symbols-outlined text-[14px]">image</span> Bukti Bayar
                      </button>
                    <?php endif; ?>

                    <?php if ($isLate): ?>
                      <span class="text-[10px] text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded font-bold w-max">
                        Terlambat (Grace Period Aktif)
                      </span>
                    <?php endif; ?>
                  </div>
                </td>

                <!-- Actions -->
                <td class="px-4 py-3.5 text-right">
                  <div class="inline-flex items-center gap-1.5 flex-wrap justify-end">
                    <?php if ($b['status'] === 'pending_payment'): ?>
                      <button onclick="verifyPayment(<?= $b['id'] ?>, true)" class="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors">
                        Approve
                      </button>
                      <button onclick="verifyPayment(<?= $b['id'] ?>, false)" class="px-3 py-1 rounded-lg bg-red-800 hover:bg-red-700 text-white text-xs font-semibold transition-colors">
                        Reject
                      </button>
                    <?php elseif ($b['status'] === 'confirmed'): ?>
                      <button onclick="checkIn(<?= $b['id'] ?>)" class="px-3 py-1 rounded-lg bg-primary-container text-on-primary-fixed text-xs font-bold hover:shadow-[0_0_15px_rgba(0,255,102,0.3)] transition-all">
                        Check-in &amp; Main
                      </button>
                      <button onclick="findReplacement(<?= $b['id'] ?>, '<?= $b['room_type'] ?>')" class="px-2 py-1 rounded bg-surface-container hover:bg-surface-elevated text-secondary text-xs font-semibold border border-gray-700" title="Cari PC Pengganti jika rig ini bentrok / rusak">
                        Ganti PC
                      </button>
                    <?php endif; ?>
                  </div>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- Proof Image Modal -->
<div id="proofModal" class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md hidden items-center justify-center p-4">
  <div class="max-w-2xl w-full bg-surface-card rounded-2xl p-6 border border-gray-800 flex flex-col gap-4 relative">
    <div class="flex items-center justify-between">
      <h3 class="font-bold text-white text-base">Pratinjau Bukti Transfer Pembayaran</h3>
      <button onclick="closeProofModal()" class="text-gray-400 hover:text-white">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <div class="max-h-[70vh] overflow-auto flex items-center justify-center bg-surface-base p-2 rounded-xl">
      <img id="proofImg" src="" alt="Bukti Transfer" class="max-w-full h-auto object-contain rounded-lg">
    </div>
    <div class="flex justify-end">
      <button onclick="closeProofModal()" class="px-4 py-2 rounded-lg bg-gray-800 text-gray-200 text-sm font-semibold">
        Tutup
      </button>
    </div>
  </div>
</div>

<script>
function viewProof(url) {
  document.getElementById('proofImg').src = url;
  document.getElementById('proofModal').classList.remove('hidden');
  document.getElementById('proofModal').classList.add('flex');
}
function closeProofModal() {
  document.getElementById('proofModal').classList.add('hidden');
  document.getElementById('proofModal').classList.remove('flex');
}

async function verifyPayment(id, approved) {
  let reason = '';
  if (!approved) {
    reason = prompt('Masukkan alasan penolakan pembayaran:');
    if (reason === null) return;
  } else {
    if (!confirm('Verifikasi bukti transfer dan kunci reservasi untuk booking ini?')) return;
  }

  try {
    const res = await fetch('../api/v1/admin/bookings.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: id, is_approved: approved, rejection_reason: reason })
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
}

async function checkIn(id) {
  if (!confirm('Check-in customer sekarang dan mulai sesi countdown pada PC?')) return;
  try {
    const res = await fetch('../api/v1/admin/bookings.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'checkin', booking_id: id })
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
}

async function findReplacement(bookingId, roomType) {
  try {
    const res = await fetch('../api/v1/admin/bookings.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'find_replacement', booking_id: bookingId })
    });
    const data = await res.json();
    if (data.has_replacement) {
      const p = data.replacement_pc;
      if (confirm(`Ditemukan PC pengganti yang tersedia di ruangan ${roomType.toUpperCase()}: ${p.pc_code} (${p.specs_gpu}). Alokasikan sekarang?`)) {
        assignReplacement(bookingId, p.id);
      }
    } else {
      alert(`Tidak ada PC pengganti yang tersedia di ruangan ${roomType.toUpperCase()} untuk jam reservasi tersebut.`);
    }
  } catch (err) {
    alert('Koneksi error.');
  }
}

async function assignReplacement(bookingId, pcId) {
  try {
    const res = await fetch('../api/v1/admin/bookings.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'assign_replacement', booking_id: bookingId, replacement_pc_id: pcId })
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
}
</script>

<?php require_once __DIR__ . '/footer.php'; ?>

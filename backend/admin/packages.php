<?php
$pageTitle = 'Paket Billing';
require_once __DIR__ . '/header.php';
require_once __DIR__ . '/../src/Database.php';

use Hog\Database;

$db = Database::getConnection();
$stmt = $db->query('SELECT * FROM packages ORDER BY id ASC');
$packages = $stmt->fetchAll();
?>

<div class="flex flex-col gap-6">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-white tracking-tight">Daftar Paket Billing &amp; Harga</h1>
      <p class="text-sm text-gray-400">Atur skema tarif paket warm-up pagi, squad siang, dan maraton begadang.</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
    <?php foreach ($packages as $pkg): ?>
      <div class="bg-surface-card rounded-2xl p-5 border border-gray-800 flex flex-col justify-between gap-4">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs uppercase font-bold text-primary-container px-2 py-0.5 rounded bg-primary-container/10">
              <?= htmlspecialchars($pkg['package_code']) ?>
            </span>
            <span class="text-xs text-gray-400"><?= $pkg['duration_minutes'] ?> Menit</span>
          </div>
          <h3 class="font-bold text-lg text-white font-display"><?= htmlspecialchars($pkg['name']) ?></h3>
          <div class="text-2xl font-bold text-white font-display mt-2">
            Rp <?= number_format($pkg['price'], 0, ',', '.') ?>
          </div>
          <p class="text-xs text-gray-400 mt-2"><?= htmlspecialchars($pkg['description']) ?></p>

          <div class="mt-4 pt-3 border-t border-gray-800 text-xs text-gray-400">
            <strong class="text-gray-300">Perks:</strong> <?= htmlspecialchars($pkg['perks']) ?>
          </div>
        </div>

        <button onclick="editPackage(<?= htmlspecialchars(json_encode($pkg)) ?>)" class="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-elevated text-xs font-semibold text-gray-200 transition-colors border border-gray-700">
          Ubah Tarif &amp; Durasi
        </button>
      </div>
    <?php endforeach; ?>
  </div>
</div>

<!-- Edit Package Modal -->
<div id="pkgModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4">
  <div class="w-full max-w-md bg-surface-card border border-gray-800 rounded-2xl p-6 shadow-2xl relative">
    <div class="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
      <h3 class="text-base font-bold text-white" id="pkgModalTitle">Edit Paket</h3>
      <button onclick="closePkgModal()" class="text-gray-400 hover:text-white">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>

    <form id="pkgForm" class="flex flex-col gap-4">
      <input type="hidden" id="pkgId">

      <div>
        <label class="block text-xs font-semibold text-gray-400 uppercase mb-1">Nama Paket</label>
        <input type="text" id="pkgName" required class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium">
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase mb-1">Harga (Rp)</label>
          <input type="number" id="pkgPrice" step="1000" required class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase mb-1">Durasi (Menit)</label>
          <input type="number" id="pkgDuration" step="15" required class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium">
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-400 uppercase mb-1">Perks / Fasilitas Tambahan</label>
        <input type="text" id="pkgPerks" class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium">
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-400 uppercase mb-1">Deskripsi</label>
        <textarea id="pkgDesc" rows="2" class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium text-xs"></textarea>
      </div>

      <div class="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
        <button type="button" onclick="closePkgModal()" class="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-sm font-semibold">
          Batal
        </button>
        <button type="submit" class="px-5 py-2 rounded-lg bg-primary-container text-on-primary-fixed text-sm font-bold">
          Simpan Paket
        </button>
      </div>
    </form>
  </div>
</div>

<script>
function editPackage(pkg) {
  document.getElementById('pkgModalTitle').textContent = `Edit ${pkg.name}`;
  document.getElementById('pkgId').value = pkg.id;
  document.getElementById('pkgName').value = pkg.name;
  document.getElementById('pkgPrice').value = pkg.price;
  document.getElementById('pkgDuration').value = pkg.duration_minutes;
  document.getElementById('pkgPerks').value = pkg.perks || '';
  document.getElementById('pkgDesc').value = pkg.description || '';

  document.getElementById('pkgModal').classList.remove('hidden');
  document.getElementById('pkgModal').classList.add('flex');
}

function closePkgModal() {
  document.getElementById('pkgModal').classList.add('hidden');
  document.getElementById('pkgModal').classList.remove('flex');
}

document.getElementById('pkgForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('pkgId').value;
  const name = document.getElementById('pkgName').value;
  const price = document.getElementById('pkgPrice').value;
  const duration = document.getElementById('pkgDuration').value;
  const perks = document.getElementById('pkgPerks').value;
  const desc = document.getElementById('pkgDesc').value;

  try {
    const res = await fetch('../api/v1/admin/packages.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: parseInt(id),
        name: name,
        price: parseFloat(price),
        duration_minutes: parseInt(duration),
        perks: perks,
        description: desc
      })
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

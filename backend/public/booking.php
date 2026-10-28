<?php
require_once __DIR__ . '/../config/config.php';
?>
<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Booking &amp; Reservasi PC — Home Of Gamers (HOG)</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "surface-base": "#0B0E14",
            "surface-card": "#12161F",
            "surface-elevated": "#1A202C",
            "surface-container": "#1D2026",
            "surface-container-high": "#272A31",
            "surface-container-lowest": "#0B0E14",
            "primary": "#EDFFE8",
            "primary-container": "#00FF66",
            "on-primary-fixed": "#002107",
            "secondary": "#69D7DE",
            "status-available": "#00FF66",
            "status-in-use": "#78E5EC",
            "status-reserved": "#B993FF",
            "status-offline": "#4A5568"
          }
        }
      }
    };
  </script>
  <style>
    body { font-family: 'Geist', sans-serif; }
    h1, h2, h3, .font-display { font-family: 'Space Grotesk', sans-serif; }
    ::-webkit-scrollbar { display: none; }
  </style>
</head>
<body class="bg-surface-base text-gray-200 min-h-screen flex flex-col">
  <!-- TOP ANNOUNCEMENT BANNER -->
  <div class="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black py-2 px-4 font-bold text-xs sm:text-sm text-center shadow-md flex items-center justify-center flex-wrap gap-2 sm:gap-4">
    <span class="bg-black text-amber-400 px-2 py-0.5 rounded text-[11px] font-mono tracking-wider uppercase font-black">
      SPEED 1 Gbps
    </span>
    <span>⚡ BEBAS DOWNLOAD GAME YANG KAMU MAU TANPA REQUEST DARI OPERATOR!</span>
    <span class="hidden md:inline text-black/80">• Booking Minimal 3 Jam (WA: 0878-7867-2111)</span>
  </div>

  <!-- Header -->
  <header class="sticky top-0 left-0 w-full z-40 bg-surface-container-lowest/90 backdrop-blur-md border-b border-gray-800">
    <div class="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <a href="index.php" class="flex items-center gap-2 group">
        <div class="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-fixed font-bold shadow-[0_0_15px_rgba(0,255,102,0.4)]">
          <span class="material-symbols-outlined text-[20px]">sports_esports</span>
        </div>
        <span class="font-display font-bold text-lg text-white uppercase tracking-wider group-hover:text-primary-container transition-colors">
          Home Of Gamers
        </span>
      </a>

      <nav class="hidden lg:flex items-center gap-2">
        <a href="index.php" class="px-3.5 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">Beranda</a>
        <a href="booking.php" class="px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-surface-container-high text-primary-container">Booking PC</a>
        <a href="booking-status.php" class="px-3.5 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">Status Booking</a>
      </nav>

      <a href="index.php" class="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-elevated text-xs font-semibold text-gray-300 border border-gray-700">
        Kembali ke Beranda
      </a>
    </div>
  </header>

  <main class="w-full pt-28 pb-16 px-4 sm:px-6 lg:px-8 flex-1">
    <div class="max-w-7xl mx-auto flex flex-col gap-8">
      <div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary-container text-xs font-semibold mb-2">
          <span class="w-2 h-2 rounded-full bg-status-available animate-pulse"></span>
          Live Telemetry Sync • Server HOG-JKT01
        </div>
        <h1 class="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">Pilih PC, Atur Waktu, Mulai Gaming.</h1>
        <p class="text-sm text-gray-400 mt-2">Cek ketersediaan 12 PC gaming HOG secara real-time dan amankan stasiun gaming Anda sebelum datang.</p>
      </div>

      <!-- Filter Controls -->
      <div class="p-4 rounded-xl bg-surface-card border border-gray-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        <div>
          <label class="block uppercase font-bold text-gray-400 mb-1">Ruangan</label>
          <select id="filterRoom" onchange="renderStations()" class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium">
            <option value="all">Semua Ruangan (12 PC)</option>
            <option value="smoking">Smoking Zone (PC-01 - PC-06)</option>
            <option value="non-smoking">VIP Non-Smoking (PC-07 - PC-12)</option>
          </select>
        </div>

        <div>
          <label class="block uppercase font-bold text-gray-400 mb-1">Tanggal</label>
          <input type="date" id="bookingDate" value="<?= date('Y-m-d') ?>" onchange="updateSummary()" class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium">
        </div>

        <div>
          <label class="block uppercase font-bold text-gray-400 mb-1">Jam Mulai</label>
          <select id="startTime" onchange="updateSummary()" class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium">
            <option value="15:00:00">15:00 WIB</option>
            <option value="17:00:00">17:00 WIB</option>
            <option value="19:00:00" selected>19:00 WIB</option>
            <option value="21:00:00">21:00 WIB</option>
            <option value="23:00:00">23:00 WIB (Begadang)</option>
          </select>
        </div>

        <div class="sm:col-span-2">
          <label class="block uppercase font-bold text-gray-400 mb-1">Pilih Paket Billing</label>
          <select id="selectPackage" onchange="updateSummary()" class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium">
            <!-- Dynamically populated from API -->
          </select>
        </div>
      </div>

      <!-- Split Layout: Stations Grid (Left) + Sticky Booking Summary (Right) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div class="lg:col-span-8 flex flex-col gap-6" id="stationsContainer">
          <div class="py-12 text-center text-gray-500">Memuat stasiun PC gaming...</div>
        </div>

        <!-- Sticky Summary Desktop Panel -->
        <div class="lg:col-span-4 sticky top-28 bg-surface-card rounded-2xl p-6 border border-gray-800 shadow-2xl flex flex-col gap-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-800">
            <h3 class="font-bold text-base text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-primary-container text-xl">receipt_long</span>
              Ringkasan Reservasi
            </h3>
            <span class="w-2.5 h-2.5 rounded-full bg-status-available animate-ping"></span>
          </div>

          <div class="p-4 rounded-xl bg-surface-base border border-gray-800 flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <span class="text-xs uppercase font-bold text-gray-400">PC Terpilih</span>
              <span id="sumPcCode" class="text-xs font-bold text-primary-container px-2 py-0.5 rounded bg-primary-container/10">PC-01</span>
            </div>
            <div id="sumRoomType" class="text-white font-bold text-sm">Smoking Room</div>
            <div id="sumSpecs" class="text-xs text-gray-400">RTX 4070 Ti 12GB • 240Hz</div>
          </div>

          <div class="text-xs text-gray-400 space-y-2">
            <div class="flex items-center justify-between">
              <span>Tanggal Sesi:</span>
              <strong class="text-gray-200" id="sumDate">-</strong>
            </div>
            <div class="flex items-center justify-between">
              <span>Jam Main:</span>
              <strong class="text-gray-200" id="sumTime">-</strong>
            </div>
            <div class="flex items-center justify-between">
              <span>Paket:</span>
              <strong class="text-gray-200" id="sumPkg">-</strong>
            </div>
          </div>

          <div class="pt-3 border-t border-gray-800 flex items-center justify-between">
            <span class="text-xs font-bold text-gray-400">Total Biaya:</span>
            <span class="text-xl font-bold text-primary-container font-display" id="sumPrice">Rp 0</span>
          </div>

          <label class="flex items-start gap-2 text-xs text-gray-400 cursor-pointer">
            <input type="checkbox" id="agreeCheckbox" checked class="mt-0.5 rounded bg-surface-base border-gray-700 text-primary-container">
            <span>Saya setuju hadir tepat waktu max toleransi keterlambatan 45 menit.</span>
          </label>

          <button onclick="openBookingModal()" class="w-full py-3 rounded-lg bg-primary-container text-on-primary-fixed text-sm font-bold hover:shadow-[0_0_20px_rgba(0,255,102,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer">
            <span>Lanjutkan Pembayaran</span>
            <span class="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  </main>

  <!-- Checkout Modal -->
  <div id="checkoutModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="w-full max-w-lg bg-surface-card border border-gray-800 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
        <h3 class="font-bold text-lg text-white">Konfirmasi &amp; Pembayaran Booking</h3>
        <button onclick="closeBookingModal()" class="text-gray-400 hover:text-white">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <form id="bookingForm" class="flex flex-col gap-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Nama Lengkap *</label>
            <input type="text" id="custName" required placeholder="Rizki Gamer" class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium text-sm">
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-1">No WhatsApp *</label>
            <input type="tel" id="custPhone" required placeholder="081234567890" class="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium text-sm">
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Pilih Metode Pembayaran</label>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <label class="p-3 rounded-lg bg-surface-base border border-primary-container text-white font-medium flex items-center gap-2 cursor-pointer">
              <input type="radio" name="payMethod" value="qris" checked class="text-primary-container">
              <span>QRIS Instant</span>
            </label>
            <label class="p-3 rounded-lg bg-surface-base border border-gray-700 text-gray-300 font-medium flex items-center gap-2 cursor-pointer">
              <input type="radio" name="payMethod" value="bca_va" class="text-primary-container">
              <span>BCA VA</span>
            </label>
            <label class="p-3 rounded-lg bg-surface-base border border-gray-700 text-gray-300 font-medium flex items-center gap-2 cursor-pointer">
              <input type="radio" name="payMethod" value="mandiri_va" class="text-primary-container">
              <span>Mandiri VA</span>
            </label>
            <label class="p-3 rounded-lg bg-surface-base border border-gray-700 text-gray-300 font-medium flex items-center gap-2 cursor-pointer">
              <input type="radio" name="payMethod" value="cash" class="text-primary-container">
              <span>Cash di Kasir</span>
            </label>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
          <button type="button" onclick="closeBookingModal()" class="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-sm font-semibold">
            Batal
          </button>
          <button type="submit" id="btnSubmitBooking" class="px-5 py-2 rounded-lg bg-primary-container text-on-primary-fixed text-sm font-bold hover:shadow-[0_0_20px_rgba(0,255,102,0.4)]">
            Kunci Reservasi Sekarang
          </button>
        </div>
      </form>
    </div>
  </div>

  <script>
    let pcsData = [];
    let packagesData = [];
    let selectedPc = null;

    async function init() {
      try {
        const [pcsRes, pkgRes] = await Promise.all([
          fetch('../api/v1/public/pcs.php'),
          fetch('../api/v1/public/packages.php')
        ]);
        const pcsJson = await pcsRes.json();
        const pkgJson = await pkgRes.json();

        pcsData = pcsJson.pcs || [];
        packagesData = pkgJson.packages || [];

        // Populate Packages dropdown with bonus and expired rules
        const pkgSelect = document.getElementById('selectPackage');
        pkgSelect.innerHTML = '';
        packagesData.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p.id;
          const bonusText = p.bonus_minutes > 0 ? ` + Bonus ${p.bonus_minutes}m` : '';
          const expText = p.expired_rule ? ` [${p.expired_rule}]` : '';
          opt.textContent = `${p.name} (${p.duration_minutes / 60} Jam${bonusText}) — ${p.price_formatted}${expText}`;
          pkgSelect.appendChild(opt);
        });

        if (pcsData.length > 0) {
          selectedPc = pcsData[0];
        }

        renderStations();
        updateSummary();
      } catch (err) {
        console.error('Init error:', err);
      }
    }

    function renderStations() {
      const roomVal = document.getElementById('filterRoom').value;
      const container = document.getElementById('stationsContainer');
      container.innerHTML = '';

      const filtered = pcsData.filter(p => roomVal === 'all' || p.room_type === roomVal);

      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4';

      filtered.forEach(pc => {
        const isSelected = selectedPc && selectedPc.id === pc.id;
        const card = document.createElement('div');
        card.className = `p-4 rounded-xl bg-surface-card border transition-all cursor-pointer ${isSelected ? 'border-primary-container ring-1 ring-primary-container shadow-[0_0_15px_rgba(0,255,102,0.2)]' : 'border-gray-800 hover:bg-surface-elevated'}`;

        let statusClass = 'text-status-available bg-status-available/10';
        if (pc.status === 'in-use') statusClass = 'text-status-in-use bg-status-in-use/10';
        else if (pc.status === 'reserved') statusClass = 'text-status-reserved bg-status-reserved/10';
        else if (pc.status === 'offline') statusClass = 'text-gray-400 bg-gray-800';

        card.onclick = () => {
          selectedPc = pc;
          renderStations();
          updateSummary();
        };

        const coolingTag = pc.specs.cooling === 'AC' 
          ? `<span class="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">AC</span>` 
          : `<span class="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">FAN</span>`;

        const smokingTag = pc.specs.smoking_policy === 'YA' 
          ? `<span class="text-[10px] font-semibold text-gray-400 bg-surface-container px-1.5 py-0.5 rounded">Smoking</span>` 
          : (pc.specs.smoking_policy === 'FLEXIBLE' 
              ? `<span class="text-[10px] font-bold text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-500/40">Flexible</span>` 
              : `<span class="text-[10px] font-semibold text-gray-400 bg-surface-container px-1.5 py-0.5 rounded">Non-Smoking</span>`);

        card.innerHTML = `
          <div class="flex items-center justify-between">
            <span class="font-display font-bold text-lg text-white">${pc.pc_code}</span>
            <div class="flex items-center gap-1.5">
              ${coolingTag}
              ${smokingTag}
              <span class="text-xs px-2 py-0.5 rounded-full font-semibold ${statusClass}">${pc.status_label}</span>
            </div>
          </div>
          <div class="my-3 text-xs text-gray-400 space-y-1">
            <div><strong class="text-gray-300">GPU:</strong> <span class="text-amber-400 font-bold">${pc.specs.gpu}</span></div>
            <div><strong class="text-gray-300">CPU:</strong> <span class="text-gray-200">${pc.specs.cpu || 'i5 Gen 12'}</span></div>
            <div><strong class="text-gray-300">Monitor:</strong> <span class="text-cyan-400 font-mono font-bold">${pc.specs.display}</span></div>
          </div>
          <button type="button" class="w-full py-1.5 rounded-lg text-xs font-bold transition-all ${isSelected ? 'bg-primary-container text-on-primary-fixed shadow-md' : 'bg-surface-container text-gray-300'}">
            ${isSelected ? 'Rig Dipilih' : 'Pilih PC Ini'}
          </button>
        `;

        grid.appendChild(card);
      });

      container.appendChild(grid);
    }

    function updateSummary() {
      if (!selectedPc) return;
      document.getElementById('sumPcCode').textContent = selectedPc.pc_code;
      document.getElementById('sumRoomType').textContent = selectedPc.room_type === 'smoking' ? 'Smoking Room' : 'Non-Smoking VIP';
      document.getElementById('sumSpecs').textContent = selectedPc.specs.gpu + ' • ' + selectedPc.specs.display;
      document.getElementById('sumDate').textContent = document.getElementById('bookingDate').value;
      document.getElementById('sumTime').textContent = document.getElementById('startTime').value.substring(0, 5) + ' WIB';

      const pkgId = parseInt(document.getElementById('selectPackage').value);
      const pkg = packagesData.find(p => p.id === pkgId);
      if (pkg) {
        document.getElementById('sumPkg').textContent = pkg.name;
        document.getElementById('sumPrice').textContent = pkg.price_formatted;
      }
    }

    function openBookingModal() {
      if (!document.getElementById('agreeCheckbox').checked) {
        alert('Silakan setujui syarat batas toleransi keterlambatan terlebih dahulu.');
        return;
      }
      document.getElementById('checkoutModal').classList.remove('hidden');
      document.getElementById('checkoutModal').classList.add('flex');
    }

    function closeBookingModal() {
      document.getElementById('checkoutModal').classList.add('hidden');
      document.getElementById('checkoutModal').classList.remove('flex');
    }

    document.getElementById('bookingForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btnSubmitBooking');
      btn.disabled = true;
      btn.textContent = 'Memproses Reservasi...';

      const payload = {
        pc_id: selectedPc.id,
        package_id: parseInt(document.getElementById('selectPackage').value),
        customer_name: document.getElementById('custName').value,
        customer_phone: document.getElementById('custPhone').value,
        booking_date: document.getElementById('bookingDate').value,
        start_time: document.getElementById('startTime').value,
        payment_method: document.querySelector('input[name="payMethod"]:checked').value
      };

      try {
        const res = await fetch('../api/v1/public/book.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          window.location.href = `booking-status.php?code=${data.data.booking_code}`;
        } else {
          alert('Pemesanan gagal: ' + data.error);
        }
      } catch (err) {
        alert('Gagal menghubungi server.');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Kunci Reservasi Sekarang';
      }
    });

    init();
  </script>
</body>
</html>

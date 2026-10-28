<?php
/**
 * HOG - Public Booking Status & Payment Proof Upload
 * Displays real-time ticket status, countdown, and payment verification state.
 */
$code = htmlspecialchars($_GET['code'] ?? '');
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Status Reservasi PC - Home Of Gamers (HOG)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Rajdhani:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #08090C;
      color: #E2E8F0;
    }
    .font-gaming {
      font-family: 'Rajdhani', sans-serif;
    }
    .glow-gold {
      box-shadow: 0 0 25px rgba(245, 158, 11, 0.25);
    }
    .glow-green {
      box-shadow: 0 0 25px rgba(16, 185, 129, 0.25);
    }
    .glow-cyan {
      box-shadow: 0 0 25px rgba(6, 182, 212, 0.25);
    }
  </style>
</head>
<body class="min-h-screen bg-[#08090C] text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black">

  <!-- Navigation Bar -->
  <header class="border-b border-white/5 bg-[#0D0F12]/80 backdrop-blur-md sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <a href="index.php" class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-gaming font-extrabold text-black text-xl shadow-lg shadow-amber-500/20">
          HOG
        </div>
        <div>
          <span class="font-gaming font-extrabold text-xl tracking-wider text-white">HOME OF GAMERS</span>
          <span class="block text-[10px] text-amber-400 font-semibold uppercase tracking-widest -mt-1">Billing & PC Reservation</span>
        </div>
      </a>
      <div class="flex items-center gap-3">
        <a href="booking.php" class="text-sm font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-amber-500/40 transition">
          <i class="fa-solid fa-plus text-amber-400 mr-1.5"></i>Pesan PC Baru
        </a>
        <a href="index.php" class="text-sm font-semibold text-slate-400 hover:text-white px-3 py-1.5 transition">
          Beranda
        </a>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">

    <!-- Search Code Section -->
    <div class="bg-[#121418] border border-white/5 rounded-2xl p-4 mb-6 shadow-xl">
      <form id="searchForm" class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <i class="fa-solid fa-ticket absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
          <input 
            type="text" 
            id="inputCode" 
            placeholder="Masukkan Kode Booking (Contoh: HOG-20261029-ABCD)" 
            value="<?= $code ?>"
            class="w-full bg-[#0A0B0E] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition font-mono uppercase"
            required
          >
        </div>
        <button type="submit" class="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition flex items-center justify-center gap-2">
          <i class="fa-solid fa-magnifying-glass"></i> Cek Status
        </button>
      </form>
    </div>

    <!-- Loading State -->
    <div id="loadingState" class="hidden py-16 text-center">
      <div class="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-slate-400 text-sm">Mengambil status reservasi dari server HOG...</p>
    </div>

    <!-- Error State -->
    <div id="errorState" class="hidden bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-center mb-6">
      <div class="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3 text-xl">
        <i class="fa-solid fa-circle-exclamation"></i>
      </div>
      <h3 class="font-bold text-white mb-1" id="errorTitle">Reservasi Tidak Ditemukan</h3>
      <p class="text-sm text-slate-400 mb-4" id="errorMessage">Pastikan kode reservasi yang dimasukkan sudah sesuai dengan tiket Anda.</p>
      <a href="booking.php" class="inline-block bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-lg transition">
        Buat Reservasi Baru
      </a>
    </div>

    <!-- Content Card -->
    <div id="bookingCard" class="hidden space-y-6">

      <!-- Status Banner -->
      <div id="statusBanner" class="p-6 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div id="statusIconBox" class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl">
            <i id="statusIcon" class="fa-solid fa-check"></i>
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Status Reservasi</span>
              <span id="livePill" class="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span> AUTO REFRESH
              </span>
            </div>
            <h2 id="statusTitle" class="text-xl md:text-2xl font-gaming font-extrabold tracking-wide">MENUNGGU VERIFIKASI</h2>
            <p id="statusSubtitle" class="text-xs text-slate-400 mt-0.5">PC dikunci sementara menunggu konfirmasi pembayaran.</p>
          </div>
        </div>
        <div class="text-left md:text-right">
          <span class="text-xs text-slate-400 block mb-1">Kode Booking</span>
          <div class="flex items-center gap-2">
            <span id="displayBookingCode" class="font-mono font-extrabold text-lg text-white bg-black/40 px-3 py-1 rounded-lg border border-white/10">HOG-XXXX</span>
            <button onclick="copyBookingCode()" class="text-slate-400 hover:text-amber-400 p-2 rounded-lg bg-white/5 border border-white/10 transition" title="Salin Kode">
              <i class="fa-solid fa-copy"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Replacement Notice if PC was reassigned -->
      <div id="replacementAlert" class="hidden bg-cyan-950/40 border border-cyan-500/30 rounded-2xl p-4 text-cyan-200 text-sm flex items-start gap-3">
        <i class="fa-solid fa-circle-info text-cyan-400 text-lg mt-0.5"></i>
        <div>
          <span class="font-bold block text-white">Pergantian PC Resmi</span>
          <span id="replacementText">Operator HOG telah mengalihkan pesanan Anda ke PC pengganti di ruangan yang sama.</span>
        </div>
      </div>

      <!-- Booking Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <!-- PC Card -->
        <div class="bg-[#121418] border border-white/5 rounded-2xl p-5">
          <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Unit Komputer</div>
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-gaming text-2xl font-bold">
              <span id="pcCode">PC-01</span>
            </div>
            <div>
              <div class="font-gaming font-bold text-lg text-white" id="pcName">PC-01 RIG</div>
              <span id="roomTypeBadge" class="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/10">Non-Smoking</span>
            </div>
          </div>
        </div>

        <!-- Schedule Card -->
        <div class="bg-[#121418] border border-white/5 rounded-2xl p-5">
          <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Waktu Sesi</div>
          <div class="font-gaming font-bold text-lg text-white flex items-center gap-2">
            <i class="fa-regular fa-clock text-amber-400 text-sm"></i>
            <span id="scheduleTime">14:00 - 18:00</span>
          </div>
          <div class="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <i class="fa-regular fa-calendar text-slate-500"></i>
            <span id="scheduleDate">29 Okt 2026</span>
            <span class="text-slate-600">•</span>
            <span id="durationHours">4 Jam</span>
          </div>
        </div>

        <!-- Package & Price Card -->
        <div class="bg-[#121418] border border-white/5 rounded-2xl p-5">
          <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Paket & Biaya</div>
          <div class="font-gaming font-bold text-lg text-amber-400" id="packageName">Paket Siang</div>
          <div class="text-xs text-slate-300 font-semibold mt-1">
            Total: <span class="text-white font-mono text-sm" id="totalPrice">Rp 40.000</span>
          </div>
        </div>

      </div>

      <!-- Payment & Verification Area -->
      <div class="bg-[#121418] border border-white/5 rounded-2xl p-6 shadow-xl">
        <h3 class="font-gaming font-bold text-lg text-white mb-4 flex items-center gap-2">
          <i class="fa-solid fa-receipt text-amber-400"></i> Informasi Pembayaran & Bukti Transfer
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          <!-- Payment Info -->
          <div class="space-y-4">
            <div class="bg-[#0A0B0E] border border-white/5 rounded-xl p-4 space-y-2">
              <div class="flex justify-between text-xs text-slate-400">
                <span>Metode Pembayaran:</span>
                <span id="payMethod" class="font-semibold text-white uppercase">QRIS</span>
              </div>
              <div class="flex justify-between text-xs text-slate-400">
                <span>Status Pembayaran:</span>
                <span id="payStatus" class="font-bold text-amber-400">Pending</span>
              </div>
              <div class="flex justify-between text-xs text-slate-400">
                <span>Atas Nama Pemesan:</span>
                <span id="custName" class="font-semibold text-white">-</span>
              </div>
            </div>

            <!-- Transfer Instructions -->
            <div id="transferInstruction" class="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs space-y-2 text-slate-300">
              <div class="font-bold text-amber-400 flex items-center gap-1.5">
                <i class="fa-solid fa-building-columns"></i> Rekening Resmi HOG
              </div>
              <p>BCA: <strong class="text-white font-mono">873-098-1234</strong> a.n Home Of Gamers</p>
              <p>Mandiri: <strong class="text-white font-mono">137-00-9876543-1</strong> a.n Home Of Gamers</p>
              <p class="text-[11px] text-slate-400">Mohon sertakan Kode Booking pada berita transfer untuk mempercepat verifikasi otomatis.</p>
            </div>

            <!-- Grace Period Notice -->
            <div class="p-4 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300">
              <div class="font-bold text-white mb-1 flex items-center gap-1.5">
                <i class="fa-solid fa-triangle-exclamation text-amber-400"></i> Batas Toleransi Keterlambatan
              </div>
              <p class="text-[11px] text-slate-400 leading-relaxed">
                Toleransi keterlambatan kedatangan adalah <strong class="text-amber-400" id="graceMinutes">45 menit</strong> setelah jam mulai. Jika melewati batas toleransi tanpa check-in di kasir, sistem HOG berhak melepaskan reservasi.
              </p>
            </div>
          </div>

          <!-- Upload Form / Uploaded Status -->
          <div class="bg-[#0A0B0E] border border-white/5 rounded-xl p-5">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Upload Struk / Bukti Transfer</h4>

            <!-- Already uploaded alert -->
            <div id="proofAlreadyUploaded" class="hidden p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs mb-4 flex items-center gap-3">
              <i class="fa-solid fa-circle-check text-emerald-400 text-lg"></i>
              <div>
                <span class="font-bold block">Bukti Pembayaran Tersimpan</span>
                <span>Operator HOG sedang memeriksa keaslian mutasi rekening.</span>
              </div>
            </div>

            <!-- Form -->
            <form id="uploadProofForm" class="space-y-4">
              <div class="border-2 border-dashed border-white/10 hover:border-amber-500/50 rounded-xl p-6 text-center cursor-pointer transition relative group" id="dropArea">
                <input type="file" id="proofFile" name="proof_image" accept="image/jpeg,image/png,image/webp" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" required>
                <div id="uploadPrompt" class="space-y-2">
                  <div class="w-10 h-10 rounded-full bg-white/5 group-hover:bg-amber-500/20 text-slate-400 group-hover:text-amber-400 flex items-center justify-center mx-auto transition">
                    <i class="fa-solid fa-cloud-arrow-up text-lg"></i>
                  </div>
                  <div class="text-xs font-semibold text-slate-300">Pilih file gambar struk / screenshot</div>
                  <div class="text-[10px] text-slate-500">Maks. 5 MB (JPG, PNG, WEBP)</div>
                </div>
                <div id="previewContainer" class="hidden">
                  <img id="imagePreview" src="" alt="Preview" class="max-h-40 rounded-lg mx-auto shadow-md mb-2">
                  <span id="fileName" class="text-xs text-amber-400 font-mono block"></span>
                </div>
              </div>

              <button 
                type="submit" 
                id="btnUploadProof" 
                class="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-gaming font-extrabold text-sm py-3 rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <i class="fa-solid fa-upload"></i> Unggah Bukti Pembayaran
              </button>
            </form>
          </div>

        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <a href="booking.php" class="flex-1 bg-[#121418] hover:bg-white/5 border border-white/10 text-white font-semibold text-sm py-3 rounded-xl text-center transition">
          Pesan PC Tambahan
        </a>
        <a href="index.php" class="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-sm py-3 rounded-xl text-center transition">
          Kembali ke Beranda
        </a>
      </div>

    </div>

  </main>

  <!-- Footer -->
  <footer class="border-t border-white/5 bg-[#0D0F12] py-6 text-center text-xs text-slate-500">
    <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p>&copy; 2026 Home Of Gamers (HOG). All rights reserved.</p>
      <div class="flex items-center gap-4 text-slate-400">
        <span>Sistem Operasional HOG Independen dari Cyberindo Billing</span>
      </div>
    </div>
  </footer>

  <script>
    let currentCode = '<?= $code ?>';
    let pollInterval = null;

    // Search handler
    document.getElementById('searchForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const code = document.getElementById('inputCode').value.trim();
      if (!code) return;
      currentCode = code;
      const newUrl = `${window.location.pathname}?code=${encodeURIComponent(code)}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
      fetchBookingStatus();
    });

    // File preview
    const proofInput = document.getElementById('proofFile');
    proofInput.addEventListener('change', () => {
      const file = proofInput.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('Ukuran file maksimal 5 MB.');
          proofInput.value = '';
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          document.getElementById('uploadPrompt').classList.add('hidden');
          document.getElementById('previewContainer').classList.remove('hidden');
          document.getElementById('imagePreview').src = e.target.result;
          document.getElementById('fileName').textContent = file.name;
        };
        reader.readAsDataURL(file);
      }
    });

    // Upload handler
    document.getElementById('uploadProofForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!proofInput.files || !proofInput.files[0]) {
        alert('Silakan pilih berkas bukti pembayaran terlebih dahulu.');
        return;
      }

      const btn = document.getElementById('btnUploadProof');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Mengunggah...';

      const formData = new FormData();
      formData.append('booking_code', currentCode);
      formData.append('proof_image', proofInput.files[0]);

      try {
        const res = await fetch('../api/v1/public/upload-proof.php', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          alert('Bukti pembayaran berhasil diunggah! Operator HOG akan memverifikasi.');
          fetchBookingStatus();
        } else {
          alert('Gagal: ' + (data.error || 'Terjadi kesalahan'));
        }
      } catch (err) {
        alert('Gagal mengunggah ke server.');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-upload"></i> Unggah Bukti Pembayaran';
      }
    });

    // Copy booking code
    function copyBookingCode() {
      if (!currentCode) return;
      navigator.clipboard.writeText(currentCode).then(() => {
        alert('Kode booking disalin ke clipboard: ' + currentCode);
      });
    }

    // Fetch booking status
    async function fetchBookingStatus() {
      if (!currentCode) return;

      document.getElementById('loadingState').classList.remove('hidden');
      document.getElementById('errorState').classList.add('hidden');

      try {
        const res = await fetch(`../api/v1/public/status.php?code=${encodeURIComponent(currentCode)}`);
        const json = await res.json();

        document.getElementById('loadingState').classList.add('hidden');

        if (!json.success || !json.booking) {
          document.getElementById('bookingCard').classList.add('hidden');
          document.getElementById('errorState').classList.remove('hidden');
          document.getElementById('errorMessage').textContent = json.error || 'Reservasi tidak ditemukan.';
          return;
        }

        renderBooking(json.booking);
      } catch (err) {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('errorState').classList.remove('hidden');
        document.getElementById('errorMessage').textContent = 'Koneksi ke server HOG terputus.';
      }
    }

    function renderBooking(b) {
      document.getElementById('bookingCard').classList.remove('hidden');
      document.getElementById('displayBookingCode').textContent = b.code;
      document.getElementById('pcCode').textContent = b.pc_code;
      document.getElementById('pcName').textContent = b.pc_code + ' RIG';
      document.getElementById('roomTypeBadge').textContent = b.room_type === 'smoking' ? 'Smoking Room' : 'Non-Smoking Room';
      document.getElementById('scheduleTime').textContent = `${b.start_time.substring(0, 5)} - ${b.end_time.substring(0, 5)}`;
      document.getElementById('scheduleDate').textContent = b.date;
      document.getElementById('durationHours').textContent = Math.round(b.duration_minutes / 60) + ' Jam';
      document.getElementById('packageName').textContent = b.package_name;
      document.getElementById('totalPrice').textContent = 'Rp ' + Number(b.total_price).toLocaleString('id-ID');
      document.getElementById('custName').textContent = b.customer_name;
      document.getElementById('payMethod').textContent = b.payment.method || 'CASH / QRIS';
      document.getElementById('payStatus').textContent = b.payment.status ? b.payment.status.toUpperCase() : 'PENDING';
      document.getElementById('graceMinutes').textContent = b.grace_period_minutes + ' menit';

      // Replacement notice
      const repAlert = document.getElementById('replacementAlert');
      if (b.has_replacement) {
        repAlert.classList.remove('hidden');
        document.getElementById('replacementText').textContent = 
          `Unit awal (${b.original_pc}) telah digantikan dengan unit ${b.pc_code} pada ruangan yang sama (${b.room_type === 'smoking' ? 'Smoking' : 'Non-Smoking'}).`;
      } else {
        repAlert.classList.add('hidden');
      }

      // Proof already uploaded banner
      const proofAlert = document.getElementById('proofAlreadyUploaded');
      if (b.payment.has_proof) {
        proofAlert.classList.remove('hidden');
        document.getElementById('btnUploadProof').innerHTML = '<i class="fa-solid fa-rotate"></i> Perbarui Bukti Pembayaran';
      } else {
        proofAlert.classList.add('hidden');
        document.getElementById('btnUploadProof').innerHTML = '<i class="fa-solid fa-upload"></i> Unggah Bukti Pembayaran';
      }

      // Banner style based on status
      const banner = document.getElementById('statusBanner');
      const iconBox = document.getElementById('statusIconBox');
      const icon = document.getElementById('statusIcon');
      const title = document.getElementById('statusTitle');
      const subtitle = document.getElementById('statusSubtitle');

      banner.className = 'p-6 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ';

      switch (b.booking_status) {
        case 'confirmed':
          banner.className += 'bg-emerald-950/30 border-emerald-500/30 glow-green';
          iconBox.className = 'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-emerald-500/20 text-emerald-400';
          icon.className = 'fa-solid fa-shield-halved';
          title.textContent = 'TERKONFIRMASI - PC SIAP DIGUNAKAN';
          title.className = 'text-xl md:text-2xl font-gaming font-extrabold tracking-wide text-emerald-400';
          subtitle.textContent = 'Pembayaran terverifikasi. Komputer Anda telah dikunci eksklusif.';
          break;

        case 'active':
          banner.className += 'bg-cyan-950/30 border-cyan-500/30 glow-cyan';
          iconBox.className = 'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-cyan-500/20 text-cyan-400';
          icon.className = 'fa-solid fa-gamepad';
          title.textContent = 'SESI GAMING SEDANG BERJALAN';
          title.className = 'text-xl md:text-2xl font-gaming font-extrabold tracking-wide text-cyan-400';
          subtitle.textContent = 'Pelanggan telah check-in di kasir dan sesi sedang aktif.';
          break;

        case 'completed':
          banner.className += 'bg-blue-950/30 border-blue-500/30';
          iconBox.className = 'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-blue-500/20 text-blue-400';
          icon.className = 'fa-solid fa-circle-check';
          title.textContent = 'SESI BERMAIN TELAH SELESAI';
          title.className = 'text-xl md:text-2xl font-gaming font-extrabold tracking-wide text-blue-400';
          subtitle.textContent = 'Terima kasih telah bermain di Home Of Gamers.';
          break;

        case 'expired':
          banner.className += 'bg-rose-950/30 border-rose-500/30';
          iconBox.className = 'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-rose-500/20 text-rose-400';
          icon.className = 'fa-solid fa-clock-rotate-left';
          title.textContent = 'RESERVASI KADALUWARSA';
          title.className = 'text-xl md:text-2xl font-gaming font-extrabold tracking-wide text-rose-400';
          subtitle.textContent = `Batas toleransi kedatangan (${b.grace_period_minutes} menit) terlampaui tanpa check-in. Unit telah dilepaskan.`;
          break;

        case 'cancelled':
          banner.className += 'bg-red-950/30 border-red-500/30';
          iconBox.className = 'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-red-500/20 text-red-400';
          icon.className = 'fa-solid fa-ban';
          title.textContent = 'RESERVASI DIBATALKAN';
          title.className = 'text-xl md:text-2xl font-gaming font-extrabold tracking-wide text-red-400';
          subtitle.textContent = 'Reservasi ini telah dibatalkan oleh operator atau sistem.';
          break;

        case 'pending':
        default:
          banner.className += 'bg-amber-950/30 border-amber-500/30 glow-gold';
          iconBox.className = 'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-amber-500/20 text-amber-400';
          icon.className = 'fa-solid fa-hourglass-half animate-pulse';
          title.textContent = 'MENUNGGU VERIFIKASI PEMBAYARAN';
          title.className = 'text-xl md:text-2xl font-gaming font-extrabold tracking-wide text-amber-400';
          subtitle.textContent = 'Segera selesaikan pembayaran dan unggah bukti transfer sebelum batas toleransi.';
          break;
      }
    }

    // Initialize & polling
    if (currentCode) {
      fetchBookingStatus();
      pollInterval = setInterval(fetchBookingStatus, 10000); // 10s auto-refresh
    }
  </script>
</body>
</html>

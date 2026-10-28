<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Home Of Gamers (HOG) — Internet Gaming Cafe &amp; Esports Lounge Indonesia</title>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Rajdhani:wght@600;700;800&family=Space+Grotesk:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            "surface-base": "#0B0C10",
            "surface-card": "#13151B",
            "surface-container": "#1B1E26",
            "surface-elevated": "#232733",
            "primary-container": "#00FF66",
            "on-primary-fixed": "#002B0D",
            "secondary": "#FFB703",
            "status-available": "#00FF66",
            "status-in-use": "#00D4FF",
            "status-reserved": "#D946EF",
            "status-offline": "#6B7280"
          }
        }
      }
    };
  </script>
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    h1, h2, h3, .font-display { font-family: 'Rajdhani', sans-serif; }
    .font-gaming { font-family: 'Space Grotesk', sans-serif; }
  </style>
</head>
<body class="bg-surface-base text-gray-200 min-h-screen flex flex-col selection:bg-primary-container selection:text-black">

  <!-- TOP ANNOUNCEMENT BANNER (BEBAS DOWNLOAD & SPEED 1 GBPS) -->
  <div class="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black py-2 px-4 font-bold text-xs sm:text-sm text-center shadow-md relative z-50 flex items-center justify-center flex-wrap gap-2 sm:gap-4">
    <span class="bg-black text-amber-400 px-2 py-0.5 rounded text-[11px] font-mono tracking-wider uppercase font-black">
      SPEED 1 Gbps
    </span>
    <span>⚡ BEBAS DOWNLOAD GAME YANG KAMU MAU TANPA REQUEST DARI OPERATOR!</span>
    <span class="hidden md:inline text-black/70">• Jika Ada Kendala Pakai 500 Mbps</span>
  </div>

  <!-- Header -->
  <header class="sticky top-0 left-0 w-full z-40 bg-[#0D0F14]/90 backdrop-blur-md border-b border-gray-800">
    <div class="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <a href="index.php" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-display font-extrabold text-black text-xl shadow-lg shadow-amber-500/20">
          HOG
        </div>
        <div>
          <span class="font-display font-extrabold text-xl tracking-wider text-white group-hover:text-amber-400 transition-colors">
            HOME OF GAMERS
          </span>
          <span class="block text-[10px] text-amber-400 font-semibold tracking-widest uppercase -mt-1">Esports Lounge &amp; Billing</span>
        </div>
      </a>

      <nav class="hidden lg:flex items-center gap-1 text-sm font-semibold">
        <a href="index.php" class="px-3.5 py-1.5 rounded-lg text-amber-400 bg-white/5">Beranda</a>
        <a href="#paket-harga" class="px-3.5 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition">Price List &amp; Paket</a>
        <a href="#spesifikasi-pc" class="px-3.5 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition">Specs 12 Rig PC</a>
        <a href="booking.php" class="px-3.5 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition">Booking Rig</a>
        <a href="booking-status.php" class="px-3.5 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition">Status Tiket</a>
      </nav>

      <div class="flex items-center gap-3">
        <a href="https://wa.me/6287878672111?text=Halo%20HOG%2C%20mau%20tanya%20booking%20PC..." target="_blank" class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-600/30 transition">
          <i class="fa-brands fa-whatsapp text-sm"></i> 0878-7867-2111
        </a>
        <a href="booking.php" class="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-bold hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20">
          Booking PC
        </a>
        <a href="../admin/login.php" class="px-2.5 py-2 rounded-lg bg-surface-container text-gray-400 hover:text-white text-xs font-semibold" title="Login Admin Portal">
          <i class="fa-solid fa-lock"></i>
        </a>
      </div>
    </div>
  </header>

  <main class="w-full flex-1">
    
    <!-- Hero Section -->
    <section class="relative w-full pt-16 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#101218] via-surface-base to-surface-base">
      <div class="max-w-7xl mx-auto flex flex-col gap-10 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-7 flex flex-col gap-6">
            
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                24 JAM NON-STOP
              </span>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                🚀 SPEED 1 Gbps DEDICATED
              </span>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold">
                🔥 RAPID TRIGGER KEYBOARD
              </span>
            </div>

            <div>
              <h1 class="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-wide uppercase leading-tight">
                HOME OF GAMERS<br>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">
                  ARENA GAMING NO. 1
                </span>
              </h1>
              <p class="text-gray-300 text-base max-w-xl mt-3 leading-relaxed">
                Nikmati kenyamanan gaming kompetitif di 12 PC Gaming High-End dengan monitor hingga <strong>390Hz</strong>, keyboard <strong>Magnetic Rapid Trigger</strong>, koneksi <strong>1 Gbps</strong>, dan bebas download game apa pun tanpa antre minta ke operator!
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-3 pt-2">
              <a href="booking.php" class="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold font-display text-base tracking-wider transition-all shadow-xl shadow-amber-500/25 flex items-center gap-2">
                <span class="material-symbols-outlined text-xl">sports_esports</span>
                <span>BOOKING SEKARANG</span>
              </a>
              <a href="#paket-harga" class="px-5 py-3.5 rounded-xl bg-surface-container hover:bg-surface-elevated text-white font-semibold text-sm transition-colors border border-gray-700">
                Lihat Price List
              </a>
              <a href="https://wa.me/6287878672111?text=Halo%20HOG%2C%20mau%20booking%20PC%20minimal%203%20jam" target="_blank" class="px-4 py-3.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-sm font-bold transition flex items-center gap-2">
                <i class="fa-brands fa-whatsapp text-lg"></i> WA: 0878-7867-2111
              </a>
            </div>

            <div class="text-xs text-slate-400 flex items-center gap-2">
              <i class="fa-solid fa-circle-info text-amber-400"></i>
              <span>Booking PC Minimal 3 Jam melalui WhatsApp atau Formulir Website</span>
            </div>
          </div>

          <!-- Hero Telemetry Snapshot Card -->
          <div class="lg:col-span-5">
            <div class="p-6 rounded-2xl bg-surface-card border border-gray-800 shadow-2xl relative overflow-hidden">
              <div class="absolute -right-16 -top-16 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div class="flex items-center justify-between pb-4 border-b border-gray-800">
                <div>
                  <h3 class="font-display font-bold text-lg text-white tracking-wide">STATUS RIG LIVE</h3>
                  <p class="text-xs text-gray-400">Sinkronisasi Real-Time 12 Rig PC</p>
                </div>
                <span class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-primary-container/10 text-primary-container border border-primary-container/20">
                  <span class="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span> ONLINE
                </span>
              </div>

              <div class="grid grid-cols-2 gap-3 my-4">
                <div class="p-3 rounded-xl bg-surface-container border border-gray-800">
                  <span class="text-[10px] text-gray-400 uppercase font-semibold">Tersedia Saat Ini</span>
                  <div class="text-2xl font-display font-extrabold text-status-available" id="statAvailable">-- PC</div>
                </div>
                <div class="p-3 rounded-xl bg-surface-container border border-gray-800">
                  <span class="text-[10px] text-gray-400 uppercase font-semibold">Sedang Digunakan</span>
                  <div class="text-2xl font-display font-extrabold text-status-in-use" id="statInUse">-- PC</div>
                </div>
              </div>

              <!-- Free Download Guarantee Box -->
              <div class="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 text-xs">
                <div class="font-bold text-amber-400 flex items-center gap-2 mb-1">
                  <i class="fa-solid fa-cloud-arrow-down text-sm"></i> BEBAS DOWNLOAD GAME
                </div>
                <p class="text-gray-300 text-[11px] leading-relaxed">
                  Ingin main game yang belum terinstall? Download langsung sepuasnya dengan bandwidth dedicated <strong>1 Gbps</strong> tanpa perlu izin kasir!
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- LIVE 12 PC GRID -->
    <section class="w-full py-10 px-4 sm:px-6 lg:px-8 bg-surface-base border-t border-b border-gray-900">
      <div class="max-w-7xl mx-auto flex flex-col gap-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span class="text-xs uppercase font-semibold text-amber-400 tracking-wider">Live Availability</span>
            <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-white uppercase tracking-wider">STATUS 12 RIG PC GAMING</h2>
          </div>
          <div class="flex items-center gap-3 text-xs">
            <span class="flex items-center gap-1.5 text-gray-300"><span class="w-2.5 h-2.5 rounded-full bg-status-available"></span> Tersedia</span>
            <span class="flex items-center gap-1.5 text-gray-300"><span class="w-2.5 h-2.5 rounded-full bg-status-in-use"></span> Sedang Main</span>
            <span class="flex items-center gap-1.5 text-gray-300"><span class="w-2.5 h-2.5 rounded-full bg-status-reserved"></span> Dipesan</span>
            <span class="flex items-center gap-1.5 text-gray-300"><span class="w-2.5 h-2.5 rounded-full bg-gray-500"></span> Offline</span>
          </div>
        </div>

        <div id="livePcGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div class="col-span-full py-8 text-center text-gray-500">Memuat telemetri stasiun PC...</div>
        </div>
      </div>
    </section>

    <!-- OFFICIAL PRICE LIST SECTION -->
    <section id="paket-harga" class="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#0F1116]">
      <div class="max-w-7xl mx-auto flex flex-col gap-8">
        
        <div class="text-center max-w-2xl mx-auto">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
            SPEED 1 Gbps • Tanpa Request Operator
          </div>
          <h2 class="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-wider uppercase">
            DAFTAR HARGA &amp; PAKET (PRICE LIST)
          </h2>
          <p class="text-sm text-gray-400 mt-2">
            Pilihan paket regular dan promo terbaik dengan tarif transparan sesuai poster resmi HOG.
          </p>
        </div>

        <!-- Price List Table -->
        <div class="w-full overflow-x-auto rounded-2xl border border-gray-800 bg-surface-card shadow-xl">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr class="border-b border-gray-800 bg-[#161820] text-gray-400 text-xs uppercase tracking-wider font-bold">
                <th class="px-5 py-4">PAKET</th>
                <th class="px-5 py-4">WAKTU</th>
                <th class="px-5 py-4">BONUS</th>
                <th class="px-5 py-4">HARGA</th>
                <th class="px-5 py-4">MASA BERLAKU (EXPIRED)</th>
                <th class="px-5 py-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800/60 font-medium">
              
              <!-- 1. 30 Menit Regular -->
              <tr class="hover:bg-white/5 transition">
                <td class="px-5 py-3.5 font-bold text-white">30 Menit Regular</td>
                <td class="px-5 py-3.5 text-gray-300 font-mono">30 Menit</td>
                <td class="px-5 py-3.5 text-gray-500">-</td>
                <td class="px-5 py-3.5 text-amber-400 font-mono font-bold">Rp 5.000</td>
                <td class="px-5 py-3.5 text-gray-400 text-xs">3 Bulan</td>
                <td class="px-5 py-3.5 text-right"><a href="booking.php" class="px-3 py-1 rounded bg-white/10 hover:bg-amber-500 hover:text-black text-xs font-bold transition">Pilih</a></td>
              </tr>

              <!-- 2. 1 Jam Regular -->
              <tr class="hover:bg-white/5 transition">
                <td class="px-5 py-3.5 font-bold text-white">1 Jam Regular</td>
                <td class="px-5 py-3.5 text-gray-300 font-mono">1 Jam</td>
                <td class="px-5 py-3.5 text-gray-500">-</td>
                <td class="px-5 py-3.5 text-amber-400 font-mono font-bold">Rp 10.000</td>
                <td class="px-5 py-3.5 text-gray-400 text-xs">3 Bulan</td>
                <td class="px-5 py-3.5 text-right"><a href="booking.php" class="px-3 py-1 rounded bg-white/10 hover:bg-amber-500 hover:text-black text-xs font-bold transition">Pilih</a></td>
              </tr>

              <!-- 3. 2 Jam Regular -->
              <tr class="hover:bg-white/5 transition">
                <td class="px-5 py-3.5 font-bold text-white">2 Jam Regular</td>
                <td class="px-5 py-3.5 text-gray-300 font-mono">2 Jam</td>
                <td class="px-5 py-3.5 text-gray-500">-</td>
                <td class="px-5 py-3.5 text-amber-400 font-mono font-bold">Rp 20.000</td>
                <td class="px-5 py-3.5 text-gray-400 text-xs">3 Bulan</td>
                <td class="px-5 py-3.5 text-right"><a href="booking.php" class="px-3 py-1 rounded bg-white/10 hover:bg-amber-500 hover:text-black text-xs font-bold transition">Pilih</a></td>
              </tr>

              <!-- 4. 3 Jam Regular (+ Bonus 30m) -->
              <tr class="hover:bg-white/5 transition bg-emerald-950/10">
                <td class="px-5 py-3.5 font-bold text-white flex items-center gap-2">
                  <span>3 Jam Regular</span>
                  <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">BONUS</span>
                </td>
                <td class="px-5 py-3.5 text-gray-300 font-mono">3 Jam</td>
                <td class="px-5 py-3.5 text-emerald-400 font-bold font-mono">30 Menit</td>
                <td class="px-5 py-3.5 text-amber-400 font-mono font-bold">Rp 30.000</td>
                <td class="px-5 py-3.5 text-gray-400 text-xs">3 Bulan</td>
                <td class="px-5 py-3.5 text-right"><a href="booking.php" class="px-3 py-1 rounded bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition">Booking</a></td>
              </tr>

              <!-- 5. 4 Jam Regular (+ Bonus 40m) -->
              <tr class="hover:bg-white/5 transition bg-emerald-950/10">
                <td class="px-5 py-3.5 font-bold text-white flex items-center gap-2">
                  <span>4 Jam Regular</span>
                  <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">BONUS</span>
                </td>
                <td class="px-5 py-3.5 text-gray-300 font-mono">4 Jam</td>
                <td class="px-5 py-3.5 text-emerald-400 font-bold font-mono">40 Menit</td>
                <td class="px-5 py-3.5 text-amber-400 font-mono font-bold">Rp 40.000</td>
                <td class="px-5 py-3.5 text-gray-400 text-xs">3 Bulan</td>
                <td class="px-5 py-3.5 text-right"><a href="booking.php" class="px-3 py-1 rounded bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition">Booking</a></td>
              </tr>

              <!-- 6. 5 Jam Regular (+ Bonus 50m) -->
              <tr class="hover:bg-white/5 transition bg-emerald-950/10">
                <td class="px-5 py-3.5 font-bold text-white flex items-center gap-2">
                  <span>5 Jam Regular</span>
                  <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">BONUS</span>
                </td>
                <td class="px-5 py-3.5 text-gray-300 font-mono">5 Jam</td>
                <td class="px-5 py-3.5 text-emerald-400 font-bold font-mono">50 Menit</td>
                <td class="px-5 py-3.5 text-amber-400 font-mono font-bold">Rp 50.000</td>
                <td class="px-5 py-3.5 text-gray-400 text-xs">3 Bulan</td>
                <td class="px-5 py-3.5 text-right"><a href="booking.php" class="px-3 py-1 rounded bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition">Booking</a></td>
              </tr>

              <!-- 7. Paket Mabar 2 PC -->
              <tr class="hover:bg-white/5 transition">
                <td class="px-5 py-3.5 font-bold text-white">Paket Mabar 2 PC</td>
                <td class="px-5 py-3.5 text-gray-300 font-mono">5 Jam Masing" PC</td>
                <td class="px-5 py-3.5 text-gray-500">-</td>
                <td class="px-5 py-3.5 text-amber-400 font-mono font-bold">Rp 70.000</td>
                <td class="px-5 py-3.5 text-gray-400 text-xs">Exp Ketika Waktu Selesai</td>
                <td class="px-5 py-3.5 text-right"><a href="booking.php" class="px-3 py-1 rounded bg-white/10 hover:bg-amber-500 hover:text-black text-xs font-bold transition">Pilih</a></td>
              </tr>

              <!-- 8. Paket 12 Jam -->
              <tr class="hover:bg-white/5 transition">
                <td class="px-5 py-3.5 font-bold text-white">Paket 12 Jam</td>
                <td class="px-5 py-3.5 text-gray-300 font-mono">12 Jam</td>
                <td class="px-5 py-3.5 text-gray-500">-</td>
                <td class="px-5 py-3.5 text-amber-400 font-mono font-bold">Rp 90.000</td>
                <td class="px-5 py-3.5 text-gray-400 text-xs">Exp Ketika Waktu Selesai</td>
                <td class="px-5 py-3.5 text-right"><a href="booking.php" class="px-3 py-1 rounded bg-white/10 hover:bg-amber-500 hover:text-black text-xs font-bold transition">Pilih</a></td>
              </tr>

              <!-- 9. Paket 24 Jam -->
              <tr class="hover:bg-white/5 transition">
                <td class="px-5 py-3.5 font-bold text-white">Paket 24 Jam</td>
                <td class="px-5 py-3.5 text-gray-300 font-mono">24 Jam</td>
                <td class="px-5 py-3.5 text-gray-500">-</td>
                <td class="px-5 py-3.5 text-amber-400 font-mono font-bold">Rp 150.000</td>
                <td class="px-5 py-3.5 text-gray-400 text-xs">Exp Ketika Waktu Selesai</td>
                <td class="px-5 py-3.5 text-right"><a href="booking.php" class="px-3 py-1 rounded bg-white/10 hover:bg-amber-500 hover:text-black text-xs font-bold transition">Pilih</a></td>
              </tr>

              <!-- 10. Paket Pagi* (Highlighted Yellow) -->
              <tr class="bg-yellow-500/10 hover:bg-yellow-500/20 border-l-4 border-yellow-400 transition">
                <td class="px-5 py-3.5 font-extrabold text-yellow-400">Paket Pagi*</td>
                <td class="px-5 py-3.5 text-white font-mono font-bold">6 Jam</td>
                <td class="px-5 py-3.5 text-gray-400">-</td>
                <td class="px-5 py-3.5 text-yellow-400 font-mono font-extrabold text-base">Rp 40.000</td>
                <td class="px-5 py-3.5 text-yellow-200 text-xs font-semibold">Exp Ketika Waktu Selesai</td>
                <td class="px-5 py-3.5 text-right"><a href="booking.php" class="px-3 py-1 rounded bg-yellow-400 text-black text-xs font-extrabold hover:bg-yellow-300 transition">Booking</a></td>
              </tr>

              <!-- 11. Paket Siang** (Highlighted Magenta) -->
              <tr class="bg-pink-500/10 hover:bg-pink-500/20 border-l-4 border-pink-500 transition">
                <td class="px-5 py-3.5 font-extrabold text-pink-400">Paket Siang**</td>
                <td class="px-5 py-3.5 text-white font-mono font-bold">6 Jam</td>
                <td class="px-5 py-3.5 text-gray-400">-</td>
                <td class="px-5 py-3.5 text-pink-400 font-mono font-extrabold text-base">Rp 40.000</td>
                <td class="px-5 py-3.5 text-pink-200 text-xs font-semibold">Exp Ketika Waktu Selesai</td>
                <td class="px-5 py-3.5 text-right"><a href="booking.php" class="px-3 py-1 rounded bg-pink-500 text-white text-xs font-extrabold hover:bg-pink-400 transition">Booking</a></td>
              </tr>

              <!-- 12. Paket Malam*** (Highlighted Orange) -->
              <tr class="bg-orange-500/10 hover:bg-orange-500/20 border-l-4 border-orange-500 transition">
                <td class="px-5 py-3.5 font-extrabold text-orange-400">Paket Malam***</td>
                <td class="px-5 py-3.5 text-white font-mono font-bold">9 Jam</td>
                <td class="px-5 py-3.5 text-gray-400">-</td>
                <td class="px-5 py-3.5 text-orange-400 font-mono font-extrabold text-base">Rp 50.000</td>
                <td class="px-5 py-3.5 text-orange-200 text-xs font-semibold">Exp Ketika Waktu Selesai</td>
                <td class="px-5 py-3.5 text-right"><a href="booking.php" class="px-3 py-1 rounded bg-orange-500 text-black text-xs font-extrabold hover:bg-orange-400 transition">Booking</a></td>
              </tr>

              <!-- 13. War Tiket -->
              <tr class="hover:bg-white/5 transition bg-cyan-950/20 border-l-4 border-cyan-400">
                <td class="px-5 py-3.5 font-extrabold text-cyan-400">War Tiket</td>
                <td class="px-5 py-3.5 text-white font-mono font-bold">5 Jam</td>
                <td class="px-5 py-3.5 text-cyan-300 font-mono text-xs">Speed 1 Gbps</td>
                <td class="px-5 py-3.5 text-cyan-400 font-mono font-extrabold text-base">Rp 45.000</td>
                <td class="px-5 py-3.5 text-gray-400 text-xs">Exp Ketika Waktu Selesai</td>
                <td class="px-5 py-3.5 text-right"><a href="booking.php" class="px-3 py-1 rounded bg-cyan-400 text-black text-xs font-extrabold hover:bg-cyan-300 transition">Booking</a></td>
              </tr>

            </tbody>
          </table>
        </div>

        <!-- Footnotes Box (Ketentuan Paket & Kontak WhatsApp) -->
        <div class="p-5 rounded-2xl bg-[#14161E] border border-gray-800 text-xs text-gray-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="space-y-1.5">
            <p><strong class="text-yellow-400">*Paket Pagi :</strong> Datang diantara <strong>Jam 5 sampai Jam 10</strong> dapat waktu 6 Jam.</p>
            <p><strong class="text-pink-400">**Paket Siang :</strong> Datang diantara <strong>Jam 11 sampai Jam 3</strong> dapat waktu 6 Jam.</p>
            <p><strong class="text-orange-400">***Paket Malam :</strong> Datang diantara <strong>Jam 8 malam sampai Jam 2 pagi</strong> dapat waktu 9 Jam.</p>
          </div>
          <div class="bg-emerald-950/40 border border-emerald-500/40 p-3.5 rounded-xl text-center sm:text-left">
            <span class="text-gray-400 block text-[11px] mb-0.5 font-semibold">Syarat Reservasi:</span>
            <span class="text-white font-bold block">Booking PC Minimal 3 Jam</span>
            <a href="https://wa.me/6287878672111" target="_blank" class="text-emerald-400 font-mono font-extrabold hover:underline block mt-0.5 text-sm">
              <i class="fa-brands fa-whatsapp"></i> WhatsApp: 0878-7867-2111
            </a>
          </div>
        </div>

      </div>
    </section>

    <!-- SPESIFIKASI 12 RIG PC GAMING SECTION -->
    <section id="spesifikasi-pc" class="w-full py-16 px-4 sm:px-6 lg:px-8 bg-surface-base">
      <div class="max-w-7xl mx-auto flex flex-col gap-8">
        
        <div>
          <span class="text-xs uppercase font-semibold text-amber-400 tracking-wider">Turnamen Ready Esports Hardware</span>
          <h2 class="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-wider uppercase mt-1">
            SPESIFIKASI RIG PC (1 s/d 12)
          </h2>
          <p class="text-sm text-gray-400 mt-1">
            Data spesifikasi nyata sesuai poster operasional Home Of Gamers.
          </p>
        </div>

        <!-- 12 PC Specs Table -->
        <div class="w-full overflow-x-auto rounded-2xl border border-gray-800 bg-surface-card shadow-xl">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr class="border-b border-gray-800 bg-[#161820] text-gray-400 text-xs uppercase tracking-wider font-bold">
                <th class="px-5 py-4">PC</th>
                <th class="px-5 py-4">GPU (VGA)</th>
                <th class="px-5 py-4">PROSESOR</th>
                <th class="px-5 py-4">MONITOR</th>
                <th class="px-5 py-4">ROKOK</th>
                <th class="px-5 py-4">FAN / AC</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800/60 font-medium">
              <!-- PC 1 -->
              <tr class="hover:bg-white/5 transition">
                <td class="px-5 py-3 font-display font-bold text-white text-base">PC 01</td>
                <td class="px-5 py-3 text-amber-400 font-bold">RTX 4060 Ti</td>
                <td class="px-5 py-3 text-gray-200">i7 Gen 14</td>
                <td class="px-5 py-3 text-cyan-400 font-mono font-bold">360 (OC 390) Hz</td>
                <td class="px-5 py-3"><span class="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400">YA</span></td>
                <td class="px-5 py-3 text-gray-400 font-bold">FAN</td>
              </tr>
              <!-- PC 2 -->
              <tr class="hover:bg-white/5 transition">
                <td class="px-5 py-3 font-display font-bold text-white text-base">PC 02</td>
                <td class="px-5 py-3 text-amber-400 font-bold">RTX 4060 Ti</td>
                <td class="px-5 py-3 text-gray-200">i5 Gen 12</td>
                <td class="px-5 py-3 text-cyan-400 font-mono font-bold">300 Hz</td>
                <td class="px-5 py-3"><span class="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400">YA</span></td>
                <td class="px-5 py-3 text-gray-400 font-bold">FAN</td>
              </tr>
              <!-- PC 3 -->
              <tr class="hover:bg-white/5 transition">
                <td class="px-5 py-3 font-display font-bold text-white text-base">PC 03</td>
                <td class="px-5 py-3 text-rose-400 font-bold">RX 6600</td>
                <td class="px-5 py-3 text-gray-200">i5 Gen 12</td>
                <td class="px-5 py-3 text-cyan-400 font-mono font-bold">240 (OC 270) Hz</td>
                <td class="px-5 py-3"><span class="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400">YA</span></td>
                <td class="px-5 py-3 text-gray-400 font-bold">FAN</td>
              </tr>
              <!-- PC 4 -->
              <tr class="hover:bg-white/5 transition">
                <td class="px-5 py-3 font-display font-bold text-white text-base">PC 04</td>
                <td class="px-5 py-3 text-amber-400 font-bold">RTX 3070</td>
                <td class="px-5 py-3 text-gray-200">i5 Gen 12</td>
                <td class="px-5 py-3 text-cyan-400 font-mono font-bold">240 (OC 270) Hz</td>
                <td class="px-5 py-3"><span class="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400">YA</span></td>
                <td class="px-5 py-3 text-gray-400 font-bold">FAN</td>
              </tr>
              <!-- PC 5 -->
              <tr class="hover:bg-white/5 transition">
                <td class="px-5 py-3 font-display font-bold text-white text-base">PC 05</td>
                <td class="px-5 py-3 text-amber-400 font-bold">RTX 4060 Ti</td>
                <td class="px-5 py-3 text-gray-200">i5 Gen 12</td>
                <td class="px-5 py-3 text-cyan-400 font-mono font-bold">360 (OC 390) Hz</td>
                <td class="px-5 py-3"><span class="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400">YA</span></td>
                <td class="px-5 py-3 text-gray-400 font-bold">FAN</td>
              </tr>
              <!-- PC 6 -->
              <tr class="hover:bg-white/5 transition">
                <td class="px-5 py-3 font-display font-bold text-white text-base">PC 06</td>
                <td class="px-5 py-3 text-amber-400 font-bold">RTX 4060 Ti</td>
                <td class="px-5 py-3 text-gray-200">i5 Gen 12</td>
                <td class="px-5 py-3 text-cyan-400 font-mono font-bold">360 (OC 390) Hz</td>
                <td class="px-5 py-3"><span class="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400">YA</span></td>
                <td class="px-5 py-3 text-gray-400 font-bold">FAN</td>
              </tr>
              <!-- PC 7 (Flexible) -->
              <tr class="hover:bg-white/5 transition bg-blue-950/10">
                <td class="px-5 py-3 font-display font-bold text-white text-base">PC 07</td>
                <td class="px-5 py-3 text-amber-400 font-bold">RTX 4060 Ti</td>
                <td class="px-5 py-3 text-gray-200">i5 Gen 12</td>
                <td class="px-5 py-3 text-cyan-400 font-mono font-bold">240 (OC 270) Hz</td>
                <td class="px-5 py-3"><span class="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">FLEXIBLE</span></td>
                <td class="px-5 py-3 text-gray-400 font-bold">FAN</td>
              </tr>
              <!-- PC 8 -->
              <tr class="hover:bg-white/5 transition bg-cyan-950/10">
                <td class="px-5 py-3 font-display font-bold text-white text-base">PC 08</td>
                <td class="px-5 py-3 text-amber-400 font-bold">RTX 4060 Ti</td>
                <td class="px-5 py-3 text-gray-200">i5 Gen 12</td>
                <td class="px-5 py-3 text-cyan-400 font-mono font-bold">360 (OC 390) Hz</td>
                <td class="px-5 py-3"><span class="px-2 py-0.5 rounded text-xs font-bold bg-gray-700 text-gray-300">NO</span></td>
                <td class="px-5 py-3 text-cyan-400 font-bold">AC</td>
              </tr>
              <!-- PC 9 -->
              <tr class="hover:bg-white/5 transition bg-cyan-950/10">
                <td class="px-5 py-3 font-display font-bold text-white text-base">PC 09</td>
                <td class="px-5 py-3 text-amber-400 font-bold">RTX 4060 Ti</td>
                <td class="px-5 py-3 text-gray-200">i5 Gen 13</td>
                <td class="px-5 py-3 text-cyan-400 font-mono font-bold">240 (OC 270) Hz</td>
                <td class="px-5 py-3"><span class="px-2 py-0.5 rounded text-xs font-bold bg-gray-700 text-gray-300">NO</span></td>
                <td class="px-5 py-3 text-cyan-400 font-bold">AC</td>
              </tr>
              <!-- PC 10 -->
              <tr class="hover:bg-white/5 transition bg-emerald-950/10">
                <td class="px-5 py-3 font-display font-bold text-white text-base">PC 10</td>
                <td class="px-5 py-3 text-emerald-400 font-extrabold">RTX 4070 SU</td>
                <td class="px-5 py-3 text-white font-bold">i7 Gen 14</td>
                <td class="px-5 py-3 text-cyan-400 font-mono font-bold">300 Hz</td>
                <td class="px-5 py-3"><span class="px-2 py-0.5 rounded text-xs font-bold bg-gray-700 text-gray-300">NO</span></td>
                <td class="px-5 py-3 text-cyan-400 font-bold">AC</td>
              </tr>
              <!-- PC 11 -->
              <tr class="hover:bg-white/5 transition bg-emerald-950/10">
                <td class="px-5 py-3 font-display font-bold text-white text-base">PC 11</td>
                <td class="px-5 py-3 text-emerald-400 font-extrabold">RTX 4070 SU</td>
                <td class="px-5 py-3 text-white font-bold">i7 Gen 14</td>
                <td class="px-5 py-3 text-cyan-400 font-mono font-bold">300 Hz</td>
                <td class="px-5 py-3"><span class="px-2 py-0.5 rounded text-xs font-bold bg-gray-700 text-gray-300">NO</span></td>
                <td class="px-5 py-3 text-cyan-400 font-bold">AC</td>
              </tr>
              <!-- PC 12 -->
              <tr class="hover:bg-white/5 transition bg-emerald-950/10">
                <td class="px-5 py-3 font-display font-bold text-white text-base">PC 12</td>
                <td class="px-5 py-3 text-emerald-400 font-extrabold">RTX 4070 SU</td>
                <td class="px-5 py-3 text-white font-bold">i7 Gen 14</td>
                <td class="px-5 py-3 text-cyan-400 font-mono font-bold">300 Hz</td>
                <td class="px-5 py-3"><span class="px-2 py-0.5 rounded text-xs font-bold bg-gray-700 text-gray-300">NO</span></td>
                <td class="px-5 py-3 text-cyan-400 font-bold">AC</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Official Peripherals Gear Card -->
        <div class="p-6 rounded-2xl bg-gradient-to-r from-[#171922] via-surface-card to-[#171922] border border-amber-500/20 shadow-xl">
          <div class="font-display font-bold text-lg text-amber-400 mb-3 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-xl">keyboard</span> PERIPHERALS GAMING RESMI SELURUH RIG
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div class="p-3.5 rounded-xl bg-surface-container border border-gray-800">
              <span class="text-gray-400 block text-[11px] font-semibold uppercase">KEYBOARD</span>
              <strong class="text-white block mt-1 leading-snug">Gamen III, MXRSKEY Rapid Trigger &amp; Leobog A80 HE Rapid Trigger</strong>
            </div>
            <div class="p-3.5 rounded-xl bg-surface-container border border-gray-800">
              <span class="text-gray-400 block text-[11px] font-semibold uppercase">MOUSE</span>
              <strong class="text-white block mt-1 leading-snug">Logitech G 203 / Logitech G 102</strong>
            </div>
            <div class="p-3.5 rounded-xl bg-surface-container border border-gray-800">
              <span class="text-gray-400 block text-[11px] font-semibold uppercase">HEADPHONE</span>
              <strong class="text-white block mt-1 leading-snug">HyperX Gaming Headset</strong>
            </div>
          </div>
        </div>

      </div>
    </section>

  </main>

  <!-- Footer -->
  <footer class="bg-surface-card border-t border-gray-800 py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-400">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-display font-bold text-black text-sm">HOG</div>
        <div>
          <span class="font-bold text-white block">Home Of Gamers (HOG)</span>
          <span>Bebas download game yang kamu mau tanpa request operator</span>
        </div>
      </div>
      <div class="flex items-center gap-6">
        <a href="https://wa.me/6287878672111" target="_blank" class="text-emerald-400 hover:underline flex items-center gap-1.5 font-bold">
          <i class="fa-brands fa-whatsapp text-sm"></i> WhatsApp 0878-7867-2111
        </a>
        <a href="booking.php" class="hover:text-white transition">Booking PC</a>
        <a href="booking-status.php" class="hover:text-white transition">Status Reservasi</a>
        <a href="../admin/login.php" class="text-gray-500 hover:text-white transition">Admin Portal</a>
      </div>
      <div>
        <p>&copy; 2026 Home Of Gamers (HOG). All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script>
    async function loadLiveTelemetry() {
      try {
        const res = await fetch('../api/v1/public/pcs.php');
        const data = await res.json();
        if (data.success) {
          document.getElementById('statAvailable').textContent = data.summary.available + ' PC';
          document.getElementById('statInUse').textContent = data.summary.in_use + ' PC';

          const grid = document.getElementById('livePcGrid');
          grid.innerHTML = '';

          data.pcs.forEach(pc => {
            const card = document.createElement('div');
            card.className = 'p-3.5 rounded-xl bg-surface-card border border-gray-800 flex flex-col justify-between gap-3 shadow-md hover:border-gray-700 transition';
            
            let badge = 'text-status-available bg-status-available/10 border-status-available/20';
            let pulse = pc.status === 'available' ? 'animate-pulse' : '';
            
            if (pc.status === 'in-use') badge = 'text-status-in-use bg-status-in-use/10 border-status-in-use/20';
            else if (pc.status === 'reserved') badge = 'text-status-reserved bg-status-reserved/10 border-status-reserved/20';
            else if (pc.status === 'offline') badge = 'text-gray-400 bg-gray-800 border-gray-700';

            let actionBtn = `<a href="booking.php" class="w-full py-1.5 text-center rounded-lg bg-surface-container hover:bg-amber-500 hover:text-black text-xs font-bold text-gray-200 transition-colors">Pilih Rig</a>`;
            if (pc.status !== 'available') {
              actionBtn = `<span class="w-full py-1.5 text-center rounded-lg bg-gray-800/60 text-gray-500 text-xs font-semibold">${pc.status_label}</span>`;
            }

            const coolingBadge = pc.specs.cooling === 'AC' 
              ? `<span class="text-[9px] font-bold text-cyan-400 bg-cyan-950/60 px-1 py-0.5 rounded border border-cyan-800/40">AC</span>` 
              : `<span class="text-[9px] font-bold text-amber-400 bg-amber-950/60 px-1 py-0.5 rounded border border-amber-800/40">FAN</span>`;

            card.innerHTML = `
              <div class="flex items-center justify-between">
                <span class="font-bold text-white font-display text-lg">${pc.pc_code}</span>
                <div class="flex items-center gap-1">
                  ${coolingBadge}
                  <span class="text-[9px] uppercase font-semibold text-gray-400 px-1 py-0.5 rounded bg-surface-container">${pc.specs.smoking_policy === 'YA' ? 'Smk' : (pc.specs.smoking_policy === 'FLEXIBLE' ? 'Flex' : 'Non')}</span>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[11px] font-semibold ${badge} px-2 py-0.5 rounded-full w-max flex items-center gap-1 border">
                  <span class="w-1.5 h-1.5 rounded-full bg-current ${pulse}"></span>
                  ${pc.status_label}
                </span>
                <span class="text-xs font-bold text-amber-400 truncate">${pc.specs.gpu}</span>
                <span class="text-[10px] text-gray-400 truncate">${pc.specs.cpu} • ${pc.specs.display}</span>
              </div>
              ${actionBtn}
            `;
            grid.appendChild(card);
          });
        }
      } catch (err) {
        console.error('Failed to load telemetry:', err);
      }
    }

    loadLiveTelemetry();
    setInterval(loadLiveTelemetry, 10000);
  </script>
</body>
</html>

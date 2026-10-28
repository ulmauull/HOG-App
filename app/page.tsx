import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  const pcStations = [
    { id: "PC-01", room: "Smoking Zone", status: "available", specs: "RTX 4070 Ti • 240Hz", label: "Tersedia", badgeColor: "bg-status-available" },
    { id: "PC-02", room: "Smoking Zone", status: "in-use", specs: "Sisa 01:42:15", label: "Digunakan", badgeColor: "bg-status-in-use" },
    { id: "PC-03", room: "Smoking Zone", status: "available", specs: "RTX 4070 Ti • 240Hz", label: "Tersedia", badgeColor: "bg-status-available" },
    { id: "PC-04", room: "Smoking Zone", status: "in-use", specs: "Sisa 00:28:40", label: "Digunakan", badgeColor: "bg-status-in-use" },
    { id: "PC-05", room: "Smoking Zone", status: "reserved", specs: "Pukul 20:00 WIB", label: "Dipesan", badgeColor: "bg-status-reserved" },
    { id: "PC-06", room: "Smoking Zone", status: "available", specs: "RTX 4080 • 280Hz", label: "Tersedia", badgeColor: "bg-status-available" },
    { id: "PC-07", room: "VIP Non-Smoking", status: "available", specs: "RTX 4080 • 280Hz", label: "Tersedia", badgeColor: "bg-status-available" },
    { id: "PC-08", room: "VIP Non-Smoking", status: "in-use", specs: "Sisa 03:10:05", label: "Digunakan", badgeColor: "bg-status-in-use" },
    { id: "PC-09", room: "VIP Non-Smoking", status: "available", specs: "RTX 4070 Ti • 240Hz", label: "Tersedia", badgeColor: "bg-status-available" },
    { id: "PC-10", room: "VIP Non-Smoking", status: "available", specs: "RTX 4070 Ti • 240Hz", label: "Tersedia", badgeColor: "bg-status-available" },
    { id: "PC-11", room: "VIP Non-Smoking", status: "available", specs: "RTX 4090 VIP • 280Hz", label: "Tersedia", badgeColor: "bg-status-available" },
    { id: "PC-12", room: "VIP Non-Smoking", status: "available", specs: "RTX 4090 VIP • 280Hz", label: "Tersedia", badgeColor: "bg-status-available" },
  ];

  const packages = [
    {
      name: "Paket Pagi",
      time: "06:00 - 12:00",
      icon: "wb_twilight",
      desc: "Mulai hari dengan sesi warm-up santai",
      price: "Rp 25.000",
      unit: "/ 4 Jam",
      perks: ["Termasuk Free Iced Tea", "Berlaku setiap hari", "Akses Smoking / Non-Smoking"],
      highlight: false,
    },
    {
      name: "Paket Siang",
      time: "12:00 - 18:00",
      icon: "wb_sunny",
      desc: "Peak hours push rank squad kompetitif",
      price: "Rp 35.000",
      unit: "/ 4 Jam",
      perks: ["Reservasi sangat disarankan", "High demand hours", "Pilih PC VIP / Battle Booth"],
      highlight: false,
    },
    {
      name: "Paket Begadang",
      time: "22:00 - 06:00",
      icon: "dark_mode",
      desc: "Malam penuh energi & maraton gaming",
      price: "Rp 50.000",
      unit: "/ 8 Jam",
      perks: ["8 Jam penuh nonstop", "Free Mineral Water", "Pencahayaan atmosferik malam"],
      highlight: true,
    },
    {
      name: "Billing Reguler",
      time: "Fleksibel",
      icon: "timer",
      desc: "Hitungan jam fleksibel bebas waktu",
      price: "Rp 8.000",
      unit: "/ Jam",
      perks: ["Dapat diisi ulang kapan saja", "Sisa waktu tersimpan di akun", "Minimal top-up 1 jam"],
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface-base text-on-surface">
      <Navbar />

      <main className="w-full pt-20 bg-surface-base">
        <div className="flex flex-col w-full">
          {/* SECTION 1: HERO */}
          <section className="relative w-full -mt-20 pt-32 pb-16 lg:pb-24 px-margin overflow-hidden bg-surface-container-lowest">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-primary-container/10 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute top-1/3 -right-24 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto w-full flex flex-col gap-space-xl relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
                <div className="lg:col-span-7 flex flex-col gap-space-lg">
                  <div className="flex flex-wrap items-center gap-space-xs">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary-container font-label-sm text-label-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-available animate-ping"></span>
                      ⚡ 24 JAM NON-STOP
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm">
                      🎮 HIGH-END GAMING PC
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      ☕ CAFE &amp; LOUNGE
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      📶 1 GBPS DEDICATED FIBER
                    </span>
                  </div>

                  <div className="flex flex-col gap-space-sm">
                    <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
                      Your Game.<br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-secondary to-primary">
                        Your Space.
                      </span><br />
                      Your Home.
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                      Rasakan pengalaman gaming yang nyaman, performa PC kelas turnamen, dan atmosfer eksklusif midnight lounge untuk setiap gamer di Indonesia.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                    <Link
                      href="/booking"
                      className="relative group inline-flex items-center justify-center gap-2 font-label-lg text-label-lg px-space-xl py-3.5 rounded-lg bg-primary-container text-on-primary-fixed shadow-[0_0_30px_rgba(0,255,102,0.35)] hover:shadow-[0_0_40px_rgba(0,255,102,0.6)] transition-all font-bold"
                    >
                      <span className="material-symbols-outlined text-[20px]">sports_esports</span>
                      <span>Booking PC Sekarang</span>
                    </Link>
                    <a
                      href="#fasilitas"
                      className="inline-flex items-center justify-center gap-2 font-label-lg text-label-lg px-space-lg py-3.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-elevated hover:text-primary transition-all font-semibold"
                    >
                      <span className="material-symbols-outlined text-[20px]">meeting_room</span>
                      <span>Lihat Fasilitas &amp; Ruangan</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-surface-card border border-surface-container-high/40">
                    <img
                      className="w-full h-[380px] lg:h-[440px] object-cover filter brightness-90 contrast-110"
                      alt="High-end esports cyber gaming lounge interior"
                      src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-base via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-surface-container-lowest/85 backdrop-blur-md flex items-center justify-between border border-surface-container-high/40">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary-container">
                          <span className="material-symbols-outlined text-[22px]">speed</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-headline-sm text-headline-sm text-primary">Ultra Low Latency</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">&lt; 3ms Ping Valorant &amp; CS2</span>
                        </div>
                      </div>
                      <span className="font-label-sm text-label-sm text-status-available uppercase px-2.5 py-1 rounded-full bg-primary-container/10 border border-primary-container/20">
                        Active 1Gbps
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Status Bar */}
              <div className="w-full p-4 lg:p-6 rounded-xl bg-surface-card shadow-lg flex flex-col md:flex-row items-center justify-between gap-space-md border border-surface-container-high/40">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-primary-container text-[24px]">desktop_windows</span>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-primary">Ketersediaan Rig Real-Time</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Update otomatis setiap 10 detik</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-6 w-full md:w-auto">
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-surface-container">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Total PC</span>
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">12 Unit</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-surface-container">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-available animate-pulse"></span>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Tersedia</span>
                      <span className="font-headline-sm text-headline-sm text-status-available font-bold">8 PC</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-surface-container">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-in-use"></span>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Digunakan</span>
                      <span className="font-headline-sm text-headline-sm text-status-in-use font-bold">3 PC</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-surface-container">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-reserved"></span>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Dipesan</span>
                      <span className="font-headline-sm text-headline-sm text-status-reserved font-bold">1 PC</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: ABOUT HOG */}
          <section className="w-full py-16 lg:py-24 px-margin bg-surface">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
                <div className="lg:col-span-5 flex flex-col gap-space-md">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-container font-semibold">
                    Tentang Home Of Gamers
                  </span>
                  <h2 className="font-display-lg text-headline-lg lg:text-display-lg text-primary tracking-tight">
                    Lebih dari Sekadar Warnet — Rumah Bagi Gamer Sejati.
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Lahir dari hasrat murni komunitas kompetitif, HOG dirancang untuk mengikis stigma warnet konvensional yang bising dan sesak. Kami mengawinkan standar esports profesional dengan kenyamanan hospitality premium.
                  </p>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Setiap meja, pencahayaan minim silau, tata suara terkalibrasi, hingga suplai makanan berkualitas tinggi disiapkan agar Anda bisa push rank tanpa kompromi performa dan kenyamanan.
                  </p>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div className="p-6 rounded-xl bg-surface-card flex flex-col gap-3 shadow-md hover:bg-surface-elevated transition-colors border border-surface-container-high/30">
                    <div className="w-12 h-12 rounded-lg bg-primary-container/15 flex items-center justify-center text-primary-container">
                      <span className="material-symbols-outlined text-[28px]">airline_seat_recline_extra</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-primary">Kursi Ergonomis Premium</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Bantalan lumbar adaptif dengan material breathable mesh, menopang postur tubuh untuk sesi gaming maraton 8+ jam tanpa letih.
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-surface-card flex flex-col gap-3 shadow-md hover:bg-surface-elevated transition-colors border border-surface-container-high/30">
                    <div className="w-12 h-12 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[28px]">local_cafe</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-primary">Refreshment &amp; Snack Bar</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Menu kopi artisan, minuman berenergi dingin, dan cemilan hangat siap diantar langsung ke meja monitor Anda hanya lewat scan QR.
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-surface-card flex flex-col gap-3 shadow-md hover:bg-surface-elevated transition-colors border border-surface-container-high/30">
                    <div className="w-12 h-12 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[28px]">ac_unit</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-primary">AC Dingin &amp; Udara HEPA</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Sistem pendingin inverter konstan 20-22°C dan pembersih udara HEPA terpisah menjaga ruangan tetap sejuk, higienis, dan wangi sepanjang hari.
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-surface-card flex flex-col gap-3 shadow-md hover:bg-surface-elevated transition-colors border border-surface-container-high/30">
                    <div className="w-12 h-12 rounded-lg bg-primary-container/15 flex items-center justify-center text-primary-container">
                      <span className="material-symbols-outlined text-[28px]">trophy</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-primary">Komunitas &amp; Turnamen Rutin</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Wadah kompetisi mingguan untuk Valorant, Dota 2, dan CS2 dengan prizepool jutaan rupiah serta komunitas gamer yang suportif dan solid.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: FACILITIES */}
          <section className="w-full py-16 lg:py-24 px-margin bg-surface-container-lowest" id="fasilitas">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                <div className="flex flex-col gap-space-xs max-w-xl">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-container font-semibold">
                    Standar Tanpa Kompromi
                  </span>
                  <h2 className="font-display-lg text-headline-lg lg:text-display-lg text-primary tracking-tight">
                    Fasilitas Eksklusif Arena
                  </h2>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                  Hardware generasi terkini, ruang steril berfilter khusus, dan konektivitas anti-interupsi disiapkan secara presisi untuk performa maksimal.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {/* Facility 1 */}
                <div className="p-6 rounded-2xl bg-surface-card shadow-lg flex flex-col gap-space-md group hover:bg-surface-elevated transition-all border border-surface-container-high/40">
                  <div className="w-full h-44 rounded-xl overflow-hidden relative">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt="High performance rig"
                      src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=600&auto=format&fit=crop"
                    />
                    <span className="absolute top-3 right-3 font-label-sm text-label-sm px-2.5 py-1 rounded bg-surface-container-lowest/80 text-primary-container uppercase font-bold">
                      Specs Level A
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-headline-md text-headline-md text-primary">High-Performance Gaming PCs</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Panel IPS 240Hz / 280Hz 0.5ms G-Sync, Keyboard Mechanical Tactile, dan Precision Mouse sensor optical 26.000 DPI siap bertarung.
                    </p>
                  </div>
                </div>

                {/* Facility 2 */}
                <div className="p-6 rounded-2xl bg-surface-card shadow-lg flex flex-col gap-space-md group hover:bg-surface-elevated transition-all border border-surface-container-high/40">
                  <div className="w-full h-44 rounded-xl overflow-hidden relative">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt="Battle station desk"
                      src="https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=600&auto=format&fit=crop"
                    />
                    <span className="absolute top-3 right-3 font-label-sm text-label-sm px-2.5 py-1 rounded bg-surface-container-lowest/80 text-secondary uppercase font-bold">
                      Ergo Design
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-headline-md text-headline-md text-primary">Stasiun Gaming Nyaman</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Meja 120cm ekstra lega dengan extended mousepad, sandaran tangan fleksibel, dan headset studio audio bersuara jernih minim noise.
                    </p>
                  </div>
                </div>

                {/* Facility 3 */}
                <div className="p-6 rounded-2xl bg-surface-card shadow-lg flex flex-col gap-space-md group hover:bg-surface-elevated transition-all border border-surface-container-high/40">
                  <div className="w-full h-44 rounded-xl overflow-hidden relative">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt="Dedicated smoking room"
                      src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop"
                    />
                    <span className="absolute top-3 right-3 font-label-sm text-label-sm px-2.5 py-1 rounded bg-surface-container-lowest/80 text-on-surface uppercase font-bold">
                      Negative Pressure
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-headline-md text-headline-md text-primary">Dedicated Smoking Room</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Sistem exhaust sirkulasi tekanan negatif 12 blower aktif dengan karbon filter. Nikmati rokok santai tanpa membuat mata perih atau ruangan pengap.
                    </p>
                  </div>
                </div>

                {/* Facility 4 */}
                <div className="p-6 rounded-2xl bg-surface-card shadow-lg flex flex-col gap-space-md group hover:bg-surface-elevated transition-all border border-surface-container-high/40">
                  <div className="w-full h-44 rounded-xl overflow-hidden relative">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt="Non smoking room"
                      src="https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=600&auto=format&fit=crop"
                    />
                    <span className="absolute top-3 right-3 font-label-sm text-label-sm px-2.5 py-1 rounded bg-surface-container-lowest/80 text-primary-container uppercase font-bold">
                      100% Smoke Free
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-headline-md text-headline-md text-primary">Non-Smoking Clean Room</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Zona bersih mutlak dengan aroma terapi menyegarkan, sanitasi stasiun berkala, dan udara murni bebas residu abu atau asap tembakau.
                    </p>
                  </div>
                </div>

                {/* Facility 5 */}
                <div className="p-6 rounded-2xl bg-surface-card shadow-lg flex flex-col gap-space-md group hover:bg-surface-elevated transition-all border border-surface-container-high/40">
                  <div className="w-full h-44 rounded-xl overflow-hidden relative">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt="5v5 esports squad"
                      src="https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=600&auto=format&fit=crop"
                    />
                    <span className="absolute top-3 right-3 font-label-sm text-label-sm px-2.5 py-1 rounded bg-surface-container-lowest/80 text-secondary uppercase font-bold">
                      5v5 Squad Booth
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-headline-md text-headline-md text-primary">Group Squad &amp; Scrim Zone</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Tata letak 5v5 sejajar khusus squad esports untuk scrim tim, komunikasi suara langsung tanpa latensi, serta privasi strategi bertanding.
                    </p>
                  </div>
                </div>

                {/* Facility 6 */}
                <div className="p-6 rounded-2xl bg-surface-card shadow-lg flex flex-col gap-space-md group hover:bg-surface-elevated transition-all border border-surface-container-high/40">
                  <div className="w-full h-44 rounded-xl overflow-hidden relative">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt="Server rack"
                      src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop"
                    />
                    <span className="absolute top-3 right-3 font-label-sm text-label-sm px-2.5 py-1 rounded bg-surface-container-lowest/80 text-status-available uppercase font-bold">
                      Dual Failover
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-headline-md text-headline-md text-primary">Koneksi Internet Dedicated</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Koneksi dual-ISP redundant dengan routing khusus jalur game (0% packet loss) dan ping stabil &lt;3ms ke server game SEA.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: PACKAGES & PRICING */}
          <section className="w-full py-16 lg:py-24 px-margin bg-surface" id="paket-harga">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
              <div className="flex flex-col items-center text-center gap-space-sm max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary-container font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[14px]">sell</span>
                  HARGA TRANSPARAN &amp; FLEKSIBEL
                </span>
                <h2 className="font-display-lg text-headline-lg lg:text-display-lg text-primary tracking-tight">
                  Pilih Paket Sesuai Gaya Mainmu
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Semua paket sudah termasuk akses penuh ke semua game library (Steam, Riot, Battle.net, Epic Games), peripheral lengkap, dan fasilitas lounge.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter items-stretch">
                {packages.map((pkg) => (
                  <div
                    key={pkg.name}
                    className={`p-6 rounded-2xl bg-surface-card shadow-lg flex flex-col justify-between gap-space-lg hover:bg-surface-elevated transition-all border ${
                      pkg.highlight
                        ? "border-primary-container/80 shadow-[0_0_25px_rgba(0,255,102,0.15)] relative scale-[1.02]"
                        : "border-surface-container-high/40"
                    }`}
                  >
                    {pkg.highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary-container text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider font-bold shadow-md">
                        Best Seller
                      </div>
                    )}

                    <div className="flex flex-col gap-space-md">
                      <div className="flex items-center justify-between">
                        <span className="font-label-sm text-label-sm uppercase px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                          {pkg.time}
                        </span>
                        <span className={`material-symbols-outlined text-[22px] ${pkg.highlight ? "text-primary-container" : "text-secondary"}`}>
                          {pkg.icon}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <h3 className="font-headline-md text-headline-md text-primary font-bold">{pkg.name}</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{pkg.desc}</p>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className={`font-display-lg text-headline-lg font-bold ${pkg.highlight ? "text-primary-container" : "text-primary"}`}>
                          {pkg.price}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">{pkg.unit}</span>
                      </div>

                      <div className="flex flex-col gap-2 pt-2">
                        {pkg.perks.map((perk, idx) => (
                          <div key={idx} className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                            <span className="material-symbols-outlined text-primary-container text-[18px]">check_circle</span>
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link
                      href="/booking"
                      className={`w-full py-2.5 rounded-lg text-center font-label-md text-label-md transition-all font-semibold ${
                        pkg.highlight
                          ? "bg-primary-container text-on-primary-fixed shadow-[0_0_20px_rgba(0,255,102,0.3)] hover:shadow-[0_0_30px_rgba(0,255,102,0.5)]"
                          : "bg-surface-container hover:bg-primary-container hover:text-on-primary-fixed text-on-surface"
                      }`}
                    >
                      Pilih Paket &amp; Booking
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 5: PC AVAILABILITY PREVIEW (12 PCs) */}
          <section className="w-full py-16 lg:py-24 px-margin bg-surface-container-lowest">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                <div className="flex flex-col gap-space-xs">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-container font-semibold">
                    Denah &amp; Status Live
                  </span>
                  <h2 className="font-display-lg text-headline-lg lg:text-display-lg text-primary tracking-tight">
                    Ketersediaan Stasiun PC (12 Rig)
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-space-sm p-3 rounded-xl bg-surface-card border border-surface-container-high/40">
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-available"></span>
                    <span>Tersedia (8)</span>
                  </div>
                  <span className="text-on-surface-variant/40">|</span>
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-in-use"></span>
                    <span>Digunakan (3)</span>
                  </div>
                  <span className="text-on-surface-variant/40">|</span>
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-reserved"></span>
                    <span>Dipesan (1)</span>
                  </div>
                </div>
              </div>

              {/* 12 PCs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-space-md">
                {pcStations.map((pc) => (
                  <div
                    key={pc.id}
                    className="p-4 rounded-xl bg-surface-card shadow-md flex flex-col justify-between gap-3 hover:bg-surface-elevated transition-colors border border-surface-container-high/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">{pc.id}</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${pc.badgeColor} ${pc.status === "available" ? "animate-pulse" : ""}`}></span>
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-label-sm text-label-sm uppercase font-semibold ${
                        pc.status === "available" ? "text-status-available" : pc.status === "in-use" ? "text-status-in-use" : "text-status-reserved"
                      }`}>
                        {pc.label}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                        {pc.specs}
                      </span>
                    </div>
                    {pc.status === "available" ? (
                      <Link
                        href="/booking"
                        className="w-full py-1.5 rounded bg-surface-container hover:bg-primary-container hover:text-on-primary-fixed text-center font-label-sm text-label-sm text-on-surface transition-all font-semibold"
                      >
                        Pilih Rig
                      </Link>
                    ) : (
                      <span className="w-full py-1.5 rounded bg-surface-container/50 text-center font-label-sm text-label-sm text-on-surface-variant/50 cursor-not-allowed">
                        {pc.status === "in-use" ? "Sedang Main" : "Reserved"}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-space-xs">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 font-label-lg text-label-lg px-space-xl py-3 rounded-lg bg-surface-card hover:bg-surface-elevated text-primary-container hover:text-primary transition-all border border-surface-container-high/50 font-bold"
                >
                  <span>Buka Sistem Booking &amp; Denah Lengkap 12 PC</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>

          {/* SECTION 6: LOCATION & CONTACT & FAQ */}
          <section className="w-full py-16 lg:py-24 px-margin bg-surface" id="lokasi-kontak">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
                {/* Contact & Location Info */}
                <div className="lg:col-span-6 flex flex-col gap-space-lg">
                  <div className="flex flex-col gap-space-xs">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-container font-semibold">
                      Kunjungi Markas HOG
                    </span>
                    <h2 className="font-display-lg text-headline-lg lg:text-display-lg text-primary tracking-tight">
                      Lokasi Strategis &amp; Kontak
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Terletak di pusat keramaian dengan area parkir aman 24 jam untuk motor dan mobil. Selalu siap menyambut squad Anda.
                    </p>
                  </div>

                  <div className="flex flex-col gap-space-md">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-card border border-surface-container-high/30">
                      <div className="w-10 h-10 rounded-lg bg-primary-container/15 flex items-center justify-center text-primary-container shrink-0">
                        <span className="material-symbols-outlined text-[24px]">location_on</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">Alamat Arena</span>
                        <span className="font-body-md text-body-md text-on-surface-variant">
                          Jl. Boulevard Gaming Esports No. 88, Jakarta Barat, DKI Jakarta 11530
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-card border border-surface-container-high/30">
                      <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary shrink-0">
                        <span className="material-symbols-outlined text-[24px]">schedule</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">Jam Operasional</span>
                        <span className="font-body-md text-body-md text-on-surface-variant">
                          Buka 24 Jam Setiap Hari (Senin s/d Minggu Tanpa Libur)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-card border border-surface-container-high/30">
                      <div className="w-10 h-10 rounded-lg bg-status-available/15 flex items-center justify-center text-status-available shrink-0">
                        <span className="material-symbols-outlined text-[24px]">chat</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">WhatsApp Reservasi &amp; Kasir</span>
                        <span className="font-body-md text-body-md text-on-surface-variant">
                          +62 812-3456-7890 (Layanan Cepat Response Admin)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* FAQ */}
                  <div className="flex flex-col gap-space-sm pt-space-sm">
                    <h3 className="font-headline-md text-headline-md text-primary font-bold">Pertanyaan Sering Diajukan</h3>
                    <div className="p-4 rounded-xl bg-surface-card flex flex-col gap-1.5 border border-surface-container-high/30">
                      <span className="font-headline-sm text-headline-sm text-primary font-semibold">
                        Apakah wajib mendaftar member sebelum bermain?
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Tidak wajib! Anda bisa bermain sebagai Guest dengan tarif reguler. Namun, member mendapatkan diskon paket hingga 20% dan sisa billing tersimpan aman selamanya.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-card flex flex-col gap-1.5 border border-surface-container-high/30">
                      <span className="font-headline-sm text-headline-sm text-primary font-semibold">
                        Bagaimana cara memesan makanan &amp; minuman ke meja?
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Setiap stasiun PC dilengkapi barcode QR cafe di desktop. Scan atau klik aplikasi launcher HOG Cafe, pilih menu, dan staf kami akan mengantarkan langsung ke meja Anda.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Map Card Preview */}
                <div className="lg:col-span-6 flex flex-col gap-space-md">
                  <div className="relative w-full h-[400px] lg:h-[480px] rounded-2xl overflow-hidden shadow-2xl bg-surface-card border border-surface-container-high/40">
                    <img
                      className="w-full h-full object-cover"
                      alt="HOG Arena Location Map"
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-base/90 via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-space-sm border border-surface-container-high/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-fixed flex items-center justify-center font-bold">
                          <span className="material-symbols-outlined text-[20px]">pin_drop</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-headline-sm text-headline-sm text-primary font-bold">HOG Gaming Arena</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">5 Menit dari Stasiun / Pintu Tol</span>
                        </div>
                      </div>
                      <a
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-elevated text-primary font-label-md text-label-md transition-colors font-semibold"
                        href="https://maps.google.com"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span>Buka di Google Maps</span>
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
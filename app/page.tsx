"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

interface PCItem {
  id: string;
  pcCode: string;
  room: string;
  roomType: "smoking" | "non-smoking";
  gpu: string;
  cpu: string;
  monitor: string;
  cooling: "FAN" | "AC";
  smoking: "YA" | "NO" | "FLEXIBLE";
  status: "available" | "in-use" | "reserved" | "offline";
  label: string;
  badgeColor: string;
}

export default function Home() {
  // Default specs aligned 100% with HOG Official Specs Poster
  const initialPCs: PCItem[] = [
    { id: "PC-01", pcCode: "PC-01", room: "Smoking Zone", roomType: "smoking", gpu: "RTX 4060 Ti", cpu: "i7 Gen 14", monitor: "360 (OC 390) Hz", cooling: "FAN", smoking: "YA", status: "available", label: "Tersedia", badgeColor: "bg-status-available" },
    { id: "PC-02", pcCode: "PC-02", room: "Smoking Zone", roomType: "smoking", gpu: "RTX 4060 Ti", cpu: "i5 Gen 12", monitor: "300 Hz", cooling: "FAN", smoking: "YA", status: "available", label: "Tersedia", badgeColor: "bg-status-available" },
    { id: "PC-03", pcCode: "PC-03", room: "Smoking Zone", roomType: "smoking", gpu: "RX 6600", cpu: "i5 Gen 12", monitor: "240 (OC 270) Hz", cooling: "FAN", smoking: "YA", status: "available", label: "Tersedia", badgeColor: "bg-status-available" },
    { id: "PC-04", pcCode: "PC-04", room: "Smoking Zone", roomType: "smoking", gpu: "RTX 3070", cpu: "i5 Gen 12", monitor: "240 (OC 270) Hz", cooling: "FAN", smoking: "YA", status: "available", label: "Tersedia", badgeColor: "bg-status-available" },
    { id: "PC-05", pcCode: "PC-05", room: "Smoking Zone", roomType: "smoking", gpu: "RTX 4060 Ti", cpu: "i5 Gen 12", monitor: "360 (OC 390) Hz", cooling: "FAN", smoking: "YA", status: "available", label: "Tersedia", badgeColor: "bg-status-available" },
    { id: "PC-06", pcCode: "PC-06", room: "Smoking Zone", roomType: "smoking", gpu: "RTX 4060 Ti", cpu: "i5 Gen 12", monitor: "360 (OC 390) Hz", cooling: "FAN", smoking: "YA", status: "available", label: "Tersedia", badgeColor: "bg-status-available" },
    { id: "PC-07", pcCode: "PC-07", room: "Flexible Smoking", roomType: "smoking", gpu: "RTX 4060 Ti", cpu: "i5 Gen 12", monitor: "240 (OC 270) Hz", cooling: "FAN", smoking: "FLEXIBLE", status: "available", label: "Tersedia", badgeColor: "bg-status-available" },
    { id: "PC-08", pcCode: "PC-08", room: "VIP Non-Smoking", roomType: "non-smoking", gpu: "RTX 4060 Ti", cpu: "i5 Gen 12", monitor: "360 (OC 390) Hz", cooling: "AC", smoking: "NO", status: "available", label: "Tersedia", badgeColor: "bg-status-available" },
    { id: "PC-09", pcCode: "PC-09", room: "VIP Non-Smoking", roomType: "non-smoking", gpu: "RTX 4060 Ti", cpu: "i5 Gen 13", monitor: "240 (OC 270) Hz", cooling: "AC", smoking: "NO", status: "available", label: "Tersedia", badgeColor: "bg-status-available" },
    { id: "PC-10", pcCode: "PC-10", room: "VIP Non-Smoking", roomType: "non-smoking", gpu: "RTX 4070 SU", cpu: "i7 Gen 14", monitor: "300 Hz", cooling: "AC", smoking: "NO", status: "available", label: "Tersedia", badgeColor: "bg-status-available" },
    { id: "PC-11", pcCode: "PC-11", room: "VIP Non-Smoking", roomType: "non-smoking", gpu: "RTX 4070 SU", cpu: "i7 Gen 14", monitor: "300 Hz", cooling: "AC", smoking: "NO", status: "available", label: "Tersedia", badgeColor: "bg-status-available" },
    { id: "PC-12", pcCode: "PC-12", room: "VIP Non-Smoking", roomType: "non-smoking", gpu: "RTX 4070 SU", cpu: "i7 Gen 14", monitor: "300 Hz", cooling: "AC", smoking: "NO", status: "available", label: "Tersedia", badgeColor: "bg-status-available" },
  ];

  const [pcStations, setPcStations] = useState<PCItem[]>(initialPCs);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "waktu" | "regular" | "spesial">("all");

  // Fetch live PCs from Supabase
  useEffect(() => {
    async function fetchPcs() {
      try {
        const { data, error } = await supabase.from("pcs").select("*").order("id");
        if (data && data.length > 0) {
          setPcStations((prev) =>
            prev.map((p) => {
              const remote = data.find((d: any) => d.pc_code === p.pcCode);
              if (remote) {
                let status: "available" | "in-use" | "reserved" | "offline" = "available";
                let label = "Tersedia";
                let badgeColor = "bg-status-available";

                if (remote.connection_status === "offline") {
                  status = "offline";
                  label = "Offline";
                  badgeColor = "bg-outline";
                } else if (remote.current_session_id) {
                  status = "in-use";
                  label = "Digunakan";
                  badgeColor = "bg-status-in-use";
                }

                return {
                  ...p,
                  status,
                  label,
                  badgeColor,
                };
              }
              return p;
            })
          );
        }
      } catch (err) {
        console.error("Gagal memuat status PC dari Supabase:", err);
      }
    }

    fetchPcs();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("home-pcs-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "pcs" }, () => {
        fetchPcs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 13 Official Packages aligned 100% with Price List Poster
  const officialPackages = [
    // Waktu Tertentu
    {
      category: "waktu",
      name: "Paket Pagi*",
      time: "05:00 - 10:00 WIB",
      duration: "6 Jam",
      bonus: "-",
      price: "Rp 40.000",
      expired: "Exp Ketika Waktu Selesai",
      desc: "Datang diantara Jam 5 sampai Jam 10 pagi langsung dapat 6 Jam penuh.",
      badge: "Promo Pagi",
      badgeColor: "bg-yellow-400 text-black",
      highlight: false,
    },
    {
      category: "waktu",
      name: "Paket Siang**",
      time: "11:00 - 15:00 WIB",
      duration: "6 Jam",
      bonus: "-",
      price: "Rp 40.000",
      expired: "Exp Ketika Waktu Selesai",
      desc: "Datang diantara Jam 11 siang sampai Jam 3 sore langsung dapat 6 Jam mabar.",
      badge: "Peak Rank",
      badgeColor: "bg-pink-500 text-white",
      highlight: false,
    },
    {
      category: "waktu",
      name: "Paket Malam***",
      time: "20:00 - 02:00 WIB",
      duration: "9 Jam",
      bonus: "-",
      price: "Rp 50.000",
      expired: "Exp Ketika Waktu Selesai",
      desc: "Datang diantara Jam 8 malam sampai Jam 2 pagi langsung dapat 9 Jam begadang.",
      badge: "Best Seller",
      badgeColor: "bg-orange-500 text-white",
      highlight: true,
    },
    // Regular + Bonus (Exp 3 Bulan)
    {
      category: "regular",
      name: "3 Jam Regular",
      time: "Fleksibel 24 Jam",
      duration: "3 Jam",
      bonus: "+ Bonus 30 Menit",
      price: "Rp 30.000",
      expired: "Masa Aktif 3 Bulan",
      desc: "Paket terpopuler untuk santai & turnamen mini. Sisa waktu tersimpan di akun.",
      badge: "Bonus 30m",
      badgeColor: "bg-primary-container text-on-primary-fixed",
      highlight: false,
    },
    {
      category: "regular",
      name: "4 Jam Regular",
      time: "Fleksibel 24 Jam",
      duration: "4 Jam",
      bonus: "+ Bonus 40 Menit",
      price: "Rp 40.000",
      expired: "Masa Aktif 3 Bulan",
      desc: "Push rank squad maraton dengan ekstra bonus 40 menit cuma-cuma.",
      badge: "Bonus 40m",
      badgeColor: "bg-primary-container text-on-primary-fixed",
      highlight: false,
    },
    {
      category: "regular",
      name: "5 Jam Regular",
      time: "Fleksibel 24 Jam",
      duration: "5 Jam",
      bonus: "+ Bonus 50 Menit",
      price: "Rp 50.000",
      expired: "Masa Aktif 3 Bulan",
      desc: "Sesi panjang paling hemat dengan bonus hampir 1 jam penuh.",
      badge: "Bonus 50m",
      badgeColor: "bg-primary-container text-on-primary-fixed",
      highlight: false,
    },
    // Spesial & Marathon
    {
      category: "spesial",
      name: "War Tiket",
      time: "Fleksibel 24 Jam",
      duration: "5 Jam",
      bonus: "Speed 1 Gbps Prioritas",
      price: "Rp 45.000",
      expired: "Exp Ketika Waktu Selesai",
      desc: "Koneksi ultra-prioritas anti-lag untuk war tiket konser, event, dan pendaftaran CPNS/BUMN.",
      badge: "Speed 1 Gbps",
      badgeColor: "bg-cyan-400 text-black",
      highlight: true,
    },
    {
      category: "spesial",
      name: "Paket Mabar 2 PC",
      time: "Fleksibel 24 Jam",
      duration: "5 Jam Masing\" PC",
      bonus: "-",
      price: "Rp 70.000",
      expired: "Exp Ketika Waktu Selesai",
      desc: "Hemat berdua! Langsung dapat 5 Jam untuk 2 unit PC bersebelahan.",
      badge: "Mabar Duo",
      badgeColor: "bg-secondary text-on-secondary",
      highlight: false,
    },
    {
      category: "spesial",
      name: "Paket 12 Jam",
      time: "Fleksibel 24 Jam",
      duration: "12 Jam",
      bonus: "-",
      price: "Rp 90.000",
      expired: "Exp Ketika Waktu Selesai",
      desc: "Maraton gaming setengah hari non-stop dengan tarif spesial.",
      badge: "Marathon",
      badgeColor: "bg-purple-500 text-white",
      highlight: false,
    },
    {
      category: "spesial",
      name: "Paket 24 Jam",
      time: "Fleksibel 24 Jam",
      duration: "24 Jam",
      bonus: "-",
      price: "Rp 150.000",
      expired: "Exp Ketika Waktu Selesai",
      desc: "Akses workstation seharian penuh 24 jam nonstop bebas keluar masuk.",
      badge: "All-Day Pass",
      badgeColor: "bg-yellow-500 text-black",
      highlight: false,
    },
  ];

  const filteredPackages = selectedCategory === "all"
    ? officialPackages
    : officialPackages.filter((p) => p.category === selectedCategory);

  const availableCount = pcStations.filter((p) => p.status === "available").length;
  const inUseCount = pcStations.filter((p) => p.status === "in-use").length;
  const reservedCount = pcStations.filter((p) => p.status === "reserved").length;

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
                  {/* Badges strip based on poster */}
                  <div className="flex flex-wrap items-center gap-space-xs">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary-container font-label-sm text-label-sm font-semibold border border-primary-container/30">
                      <span className="w-2 h-2 rounded-full bg-status-available animate-ping"></span>
                      ⚡ SPEED 1 GBPS (BACKUP 500 MBPS)
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-semibold border border-secondary/30">
                      🎮 BEBAS DOWNLOAD GAME TANPA REQUEST
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      🕒 24 JAM NON-STOP
                    </span>
                  </div>

                  <div className="flex flex-col gap-space-sm">
                    <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
                      Home Of Gamers.<br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-secondary to-primary">
                        Esports Arena &amp; Lounge.
                      </span>
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                      12 PC High-End Gaming dengan monitor hingga <strong className="text-primary font-semibold">390Hz Rapid Trigger</strong>, koneksi dedicated 1 Gbps, serta bebas download game apa pun tanpa harus request operator!
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
                      href="https://wa.me/6287878672111"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 font-label-lg text-label-lg px-space-lg py-3.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-elevated hover:text-primary transition-all font-semibold border border-surface-container-high/40"
                    >
                      <span className="material-symbols-outlined text-[20px]">chat</span>
                      <span>WhatsApp: 0878-7867-2111</span>
                    </a>
                  </div>

                  {/* Free Download Policy Notice */}
                  <div className="p-3.5 rounded-xl bg-surface-card border border-primary-container/20 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary-container text-[22px]">download_done</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      <strong className="text-primary">Bebas Download Game:</strong> Kamu bebas unduh game Steam, Epic, Riot, atau emulator tanpa batasan sistem &amp; tanpa tunggu operator.
                    </p>
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
                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-between border border-surface-container-high/40">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary-container">
                          <span className="material-symbols-outlined text-[22px]">speed</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-headline-sm text-headline-sm text-primary">Dedicated 1 Gbps</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">&lt; 3ms Ping Valorant &amp; CS2</span>
                        </div>
                      </div>
                      <span className="font-label-sm text-label-sm text-status-available uppercase px-2.5 py-1 rounded-full bg-primary-container/10 border border-primary-container/20 font-bold">
                        1 Gbps Active
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
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Live Telemetry Supabase Sync</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-6 w-full md:w-auto">
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-surface-container">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Total PC</span>
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">12 Rig</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-surface-container">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-available animate-pulse"></span>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Tersedia</span>
                      <span className="font-headline-sm text-headline-sm text-status-available font-bold">{availableCount} PC</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-surface-container">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-in-use"></span>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Digunakan</span>
                      <span className="font-headline-sm text-headline-sm text-status-in-use font-bold">{inUseCount} PC</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-surface-container">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-reserved"></span>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Dipesan</span>
                      <span className="font-headline-sm text-headline-sm text-status-reserved font-bold">{reservedCount} PC</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: HARDWARE & PERIPHERALS SHOWCASE */}
          <section className="w-full py-16 px-margin bg-surface">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
              <div className="flex flex-col items-center text-center gap-space-xs max-w-2xl mx-auto">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-container font-semibold">
                  Tournament-Grade Gear
                </span>
                <h2 className="font-display-lg text-headline-lg lg:text-display-lg text-primary tracking-tight">
                  Peripherals Resmi Home Of Gamers
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Setiap rig gaming dilengkapi perlengkapan standar turnamen internasional untuk akurasi respon tanpa jeda.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                <div className="p-6 rounded-2xl bg-surface-card border border-surface-container-high/40 flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined text-[28px]">keyboard</span>
                  </div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-container font-bold">Rapid Trigger Keyboard</span>
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">Gamen III, MXRSKEY &amp; Leobog A80 HE</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Teknologi Hall Effect Rapid Trigger dengan aktuasi adaptif hingga 0.1mm untuk stop-shooting instan di Valorant &amp; CS2.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-surface-card border border-surface-container-high/40 flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[28px]">mouse</span>
                  </div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Tournament Mouse</span>
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">Logitech G 203 / G 102</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Sensor optik gaming 8,000 DPI terkalibrasi presisi dengan switch mekanikal ultra-responsif untuk tracking recoil sempurna.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-surface-card border border-surface-container-high/40 flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined text-[28px]">headphones</span>
                  </div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-container font-bold">Spatial Audio Headset</span>
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">HyperX Gaming Headphone</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Akustik directional jernih dengan noise-cancelling earcups agar langkah kaki musuh terdengar jelas dari setiap sudut.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: PACKAGES & PRICING (SESUAI POSTER RESMI) */}
          <section className="w-full py-16 lg:py-24 px-margin bg-surface-container-lowest" id="paket-harga">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
              <div className="flex flex-col items-center text-center gap-space-sm max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary-container font-label-sm text-label-sm font-semibold border border-primary-container/30">
                  <span className="material-symbols-outlined text-[14px]">sell</span>
                  OFFICIAL HOG PRICE LIST
                </span>
                <h2 className="font-display-lg text-headline-lg lg:text-display-lg text-primary tracking-tight">
                  Daftar Paket &amp; Biaya Per Jam
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Tarif resmi warnet Home Of Gamers dengan bonus waktu main dan masa aktif saldo hingga 3 bulan.
                </p>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-space-xs">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm font-semibold transition-all ${
                      selectedCategory === "all"
                        ? "bg-primary-container text-on-primary-fixed shadow-md"
                        : "bg-surface-card text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Semua Paket
                  </button>
                  <button
                    onClick={() => setSelectedCategory("waktu")}
                    className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm font-semibold transition-all ${
                      selectedCategory === "waktu"
                        ? "bg-primary-container text-on-primary-fixed shadow-md"
                        : "bg-surface-card text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Paket Jam Datang (Pagi / Siang / Malam)
                  </button>
                  <button
                    onClick={() => setSelectedCategory("regular")}
                    className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm font-semibold transition-all ${
                      selectedCategory === "regular"
                        ? "bg-primary-container text-on-primary-fixed shadow-md"
                        : "bg-surface-card text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Regular + Bonus (Exp 3 Bulan)
                  </button>
                  <button
                    onClick={() => setSelectedCategory("spesial")}
                    className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm font-semibold transition-all ${
                      selectedCategory === "spesial"
                        ? "bg-primary-container text-on-primary-fixed shadow-md"
                        : "bg-surface-card text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    War Tiket, Mabar &amp; Marathon
                  </button>
                </div>
              </div>

              {/* Grid Packages */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter items-stretch">
                {filteredPackages.map((pkg) => (
                  <div
                    key={pkg.name}
                    className={`p-6 rounded-2xl bg-surface-card shadow-lg flex flex-col justify-between gap-space-md hover:bg-surface-elevated transition-all border ${
                      pkg.highlight
                        ? "border-primary-container/80 shadow-[0_0_25px_rgba(0,255,102,0.15)] relative scale-[1.02]"
                        : "border-surface-container-high/40"
                    }`}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="font-label-sm text-label-sm uppercase px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                          {pkg.time}
                        </span>
                        <span className={`font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-bold ${pkg.badgeColor}`}>
                          {pkg.badge}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <h3 className="font-headline-md text-headline-md text-primary font-bold">{pkg.name}</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{pkg.desc}</p>
                      </div>

                      <div className="flex items-baseline gap-1 mt-2">
                        <span className={`font-display-lg text-headline-lg font-bold ${pkg.highlight ? "text-primary-container" : "text-primary"}`}>
                          {pkg.price}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">/ {pkg.duration}</span>
                      </div>

                      <div className="flex flex-col gap-1.5 pt-2 border-t border-surface-container-high/40">
                        {pkg.bonus !== "-" && (
                          <div className="flex items-center gap-2 font-body-sm text-body-sm text-primary-container font-semibold">
                            <span className="material-symbols-outlined text-[18px]">add_circle</span>
                            <span>{pkg.bonus}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-status-available text-[18px]">verified</span>
                          <span>{pkg.expired}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/booking"
                      className={`w-full py-2.5 rounded-lg text-center font-label-md text-label-md transition-all font-semibold mt-4 ${
                        pkg.highlight
                          ? "bg-primary-container text-on-primary-fixed shadow-[0_0_20px_rgba(0,255,102,0.3)] hover:shadow-[0_0_30px_rgba(0,255,102,0.5)] font-bold"
                          : "bg-surface-container hover:bg-primary-container hover:text-on-primary-fixed text-on-surface"
                      }`}
                    >
                      Pilih Paket &amp; Booking
                    </Link>
                  </div>
                ))}
              </div>

              {/* Bottom Notice from Poster */}
              <div className="p-4 rounded-xl bg-surface-card border border-primary-container/20 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary-container text-[28px]">info</span>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">Ketentuan Reservasi HOG</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Booking PC Minimal 3 Jam melalui WhatsApp <strong>0878-7867-2111</strong> atau via Website ini.
                    </span>
                  </div>
                </div>
                <a
                  href="https://wa.me/6287878672111"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-lg bg-primary-container text-on-primary-fixed font-label-md text-label-md font-bold whitespace-nowrap"
                >
                  Chat WhatsApp 0878-7867-2111
                </a>
              </div>
            </div>
          </section>

          {/* SECTION 5: PC AVAILABILITY PREVIEW (12 PCs DENGAN SPECS SESUAI GAMBAR) */}
          <section className="w-full py-16 lg:py-24 px-margin bg-surface" id="pc-stations">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                <div className="flex flex-col gap-space-xs">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-container font-semibold">
                    12 Gaming Rig Standar Turnamen
                  </span>
                  <h2 className="font-display-lg text-headline-lg lg:text-display-lg text-primary tracking-tight">
                    Spesifikasi Lengkap PC 1 — PC 12
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Smoking Room (PC 1–6), Flexible Zone (PC 7), dan VIP Non-Smoking AC (PC 8–12).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-space-sm p-3 rounded-xl bg-surface-card border border-surface-container-high/40">
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-available"></span>
                    <span>Tersedia ({availableCount})</span>
                  </div>
                  <span className="text-on-surface-variant/40">|</span>
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-in-use"></span>
                    <span>Digunakan ({inUseCount})</span>
                  </div>
                  <span className="text-on-surface-variant/40">|</span>
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-reserved"></span>
                    <span>Dipesan ({reservedCount})</span>
                  </div>
                </div>
              </div>

              {/* 12 PCs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-space-md">
                {pcStations.map((pc) => (
                  <div
                    key={pc.id}
                    className="p-5 rounded-2xl bg-surface-card shadow-md flex flex-col justify-between gap-3 hover:bg-surface-elevated transition-all border border-surface-container-high/40 hover:border-primary-container/40"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">{pc.id}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          pc.cooling === "AC" ? "bg-cyan-500/20 text-cyan-400" : "bg-orange-500/20 text-orange-400"
                        }`}>
                          {pc.cooling}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${pc.badgeColor} ${pc.status === "available" ? "animate-pulse" : ""}`}></span>
                        <span className="font-label-sm text-label-sm uppercase font-semibold text-on-surface-variant text-[11px]">
                          {pc.label}
                        </span>
                      </div>
                    </div>

                    {/* Specs List sesuai poster */}
                    <div className="flex flex-col gap-1.5 py-2 border-y border-surface-container-high/30 font-body-sm text-body-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant">VGA:</span>
                        <span className="font-bold text-primary">{pc.gpu}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant">CPU:</span>
                        <span className="text-primary font-medium">{pc.cpu}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant">Monitor:</span>
                        <span className="text-primary-container font-semibold">{pc.monitor}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant">Rokok:</span>
                        <span className={`font-semibold ${
                          pc.smoking === "YA" ? "text-orange-400" : pc.smoking === "NO" ? "text-status-available" : "text-yellow-400"
                        }`}>
                          {pc.smoking === "YA" ? "YA (Boleh)" : pc.smoking === "NO" ? "NO (Dilarang)" : "FLEXIBLE"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-label-sm text-label-sm text-on-surface-variant text-[12px] truncate">
                        {pc.room}
                      </span>
                      <Link
                        href={`/booking?pc=${pc.id}`}
                        className="py-1.5 px-3 rounded bg-surface-container hover:bg-primary-container hover:text-on-primary-fixed text-center font-label-sm text-label-sm text-on-surface transition-all font-semibold"
                      >
                        Pilih PC
                      </Link>
                    </div>
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
          <section className="w-full py-16 lg:py-24 px-margin bg-surface-container-lowest" id="lokasi-kontak">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
                <div className="lg:col-span-6 flex flex-col gap-space-lg">
                  <div className="flex flex-col gap-space-xs">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-container font-semibold">
                      Kunjungi Markas HOG
                    </span>
                    <h2 className="font-display-lg text-headline-lg lg:text-display-lg text-primary tracking-tight">
                      Lokasi Strategis &amp; Kontak Resmi
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
                          <strong>0878-7867-2111</strong> (Layanan Cepat Tanggap Booking &amp; Konsultasi PC)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ */}
                <div className="lg:col-span-6 flex flex-col gap-space-md">
                  <h3 className="font-headline-md text-headline-md text-primary font-bold">Pertanyaan Sering Diajukan (FAQ)</h3>

                  <div className="p-4 rounded-xl bg-surface-card flex flex-col gap-1.5 border border-surface-container-high/30">
                    <span className="font-headline-sm text-headline-sm text-primary font-semibold">
                      Apakah saya boleh download game sendiri tanpa izin operator?
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      <strong>YA, SANGAT BEBAS!</strong> Sesuai kebijakan resmi HOG, Anda bebas mendownload game apa pun dari Steam, Riot, Epic Games, atau sumber resmi lainnya dengan kecepatan 1 Gbps tanpa perlu izin atau request ke operator.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-card flex flex-col gap-1.5 border border-surface-container-high/30">
                    <span className="font-headline-sm text-headline-sm text-primary font-semibold">
                      Berapa minimal waktu booking PC melalui WhatsApp atau Website?
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Minimal reservasi booking adalah <strong>3 Jam</strong>. Anda bisa memilih paket 3 Jam Regular (+ Bonus 30 Menit) atau paket jam tertentu (Pagi, Siang, Malam).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-card flex flex-col gap-1.5 border border-surface-container-high/30">
                    <span className="font-headline-sm text-headline-sm text-primary font-semibold">
                      Apa bedanya area Smoking, Flexible, dan VIP Non-Smoking?
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      PC 1–6 berada di Smoking Zone dengan pendingin kipas (FAN). PC 7 adalah zona Flexible. Sedangkan PC 8–12 berada di ruangan ber-AC dingin dan steril tanpa asap rokok (Non-Smoking).
                    </p>
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

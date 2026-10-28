"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PCStation {
  id: string;
  room: "Smoking Zone" | "VIP Non-Smoking Zone";
  roomType: "smoking" | "non-smoking";
  status: "available" | "in-use" | "reserved";
  specs: string;
  gpu: string;
  display: string;
  peripherals: string;
  remainingTime?: string;
  currentGame?: string;
  reservedAt?: string;
}

export default function BookingPage() {
  const router = useRouter();

  const stationsData: PCStation[] = [
    {
      id: "PC-01",
      room: "Smoking Zone",
      roomType: "smoking",
      status: "available",
      specs: "RTX 4060 Ti • i7 Gen 14 • 360 (OC 390) Hz • FAN",
      gpu: "RTX 4060 Ti",
      display: "360 (OC 390) Hz",
      peripherals: "Gamen III / MXRSKEY / Leobog A80 HE • Logitech G203/G102 • HyperX",
    },
    {
      id: "PC-02",
      room: "Smoking Zone",
      roomType: "smoking",
      status: "in-use",
      specs: "RTX 4060 Ti • i5 Gen 12 • 300 Hz • FAN",
      gpu: "RTX 4060 Ti",
      display: "300 Hz",
      peripherals: "Gamen III / MXRSKEY / Leobog A80 HE • Logitech G203/G102 • HyperX",
      remainingTime: "01:42:10 (s/d 18:30)",
      currentGame: "Valorant Ranked",
    },
    {
      id: "PC-03",
      room: "Smoking Zone",
      roomType: "smoking",
      status: "in-use",
      specs: "RX 6600 • i5 Gen 12 • 240 (OC 270) Hz • FAN",
      gpu: "RX 6600",
      display: "240 (OC 270) Hz",
      peripherals: "Gamen III / MXRSKEY / Leobog A80 HE • Logitech G203/G102 • HyperX",
      remainingTime: "00:28:45 (s/d 17:15)",
      currentGame: "Dota 2 Turbo",
    },
    {
      id: "PC-04",
      room: "Smoking Zone",
      roomType: "smoking",
      status: "available",
      specs: "RTX 3070 • i5 Gen 12 • 240 (OC 270) Hz • FAN",
      gpu: "RTX 3070",
      display: "240 (OC 270) Hz",
      peripherals: "Gamen III / MXRSKEY / Leobog A80 HE • Logitech G203/G102 • HyperX",
    },
    {
      id: "PC-05",
      room: "Smoking Zone",
      roomType: "smoking",
      status: "reserved",
      specs: "RTX 4060 Ti • i5 Gen 12 • 360 (OC 390) Hz • FAN",
      gpu: "RTX 4060 Ti",
      display: "360 (OC 390) Hz",
      peripherals: "Gamen III / MXRSKEY / Leobog A80 HE • Logitech G203/G102 • HyperX",
      reservedAt: "Dipesan pukul 20:00 WIB",
    },
    {
      id: "PC-06",
      room: "Smoking Zone",
      roomType: "smoking",
      status: "available",
      specs: "RTX 4060 Ti • i5 Gen 12 • 360 (OC 390) Hz • FAN",
      gpu: "RTX 4060 Ti",
      display: "360 (OC 390) Hz",
      peripherals: "Gamen III / MXRSKEY / Leobog A80 HE • Logitech G203/G102 • HyperX",
    },
    {
      id: "PC-07",
      room: "VIP Non-Smoking Zone",
      roomType: "non-smoking",
      status: "available",
      specs: "RTX 4060 Ti • i5 Gen 12 • 240 (OC 270) Hz • FAN • Flexible Smoking",
      gpu: "RTX 4060 Ti",
      display: "240 (OC 270) Hz",
      peripherals: "Gamen III / MXRSKEY / Leobog A80 HE • Logitech G203/G102 • HyperX",
    },
    {
      id: "PC-08",
      room: "VIP Non-Smoking Zone",
      roomType: "non-smoking",
      status: "available",
      specs: "RTX 4060 Ti • i5 Gen 12 • 360 (OC 390) Hz • AC • No Smoking",
      gpu: "RTX 4060 Ti",
      display: "360 (OC 390) Hz",
      peripherals: "Gamen III / MXRSKEY / Leobog A80 HE • Logitech G203/G102 • HyperX",
    },
    {
      id: "PC-09",
      room: "VIP Non-Smoking Zone",
      roomType: "non-smoking",
      status: "available",
      specs: "RTX 4060 Ti • i5 Gen 13 • 240 (OC 270) Hz • AC • No Smoking",
      gpu: "RTX 4060 Ti",
      display: "240 (OC 270) Hz",
      peripherals: "Gamen III / MXRSKEY / Leobog A80 HE • Logitech G203/G102 • HyperX",
    },
    {
      id: "PC-10",
      room: "VIP Non-Smoking Zone",
      roomType: "non-smoking",
      status: "available",
      specs: "RTX 4070 SU • i7 Gen 14 • 300 Hz • AC • No Smoking",
      gpu: "RTX 4070 SU",
      display: "300 Hz",
      peripherals: "Gamen III / MXRSKEY / Leobog A80 HE • Logitech G203/G102 • HyperX",
    },
    {
      id: "PC-11",
      room: "VIP Non-Smoking Zone",
      roomType: "non-smoking",
      status: "in-use",
      specs: "RTX 4070 SU • i7 Gen 14 • 300 Hz • AC • No Smoking",
      gpu: "RTX 4070 SU",
      display: "300 Hz",
      peripherals: "Gamen III / MXRSKEY / Leobog A80 HE • Logitech G203/G102 • HyperX",
      remainingTime: "03:10:00 (s/d 22:00)",
      currentGame: "Counter-Strike 2 Premier",
    },
    {
      id: "PC-12",
      room: "VIP Non-Smoking Zone",
      roomType: "non-smoking",
      status: "available",
      specs: "RTX 4070 SU • i7 Gen 14 • 300 Hz • AC • No Smoking",
      gpu: "RTX 4070 SU",
      display: "300 Hz",
      peripherals: "Gamen III / MXRSKEY / Leobog A80 HE • Logitech G203/G102 • HyperX",
    },
  ];

  // Filters & State
  const [roomFilter, setRoomFilter] = useState<"all" | "smoking" | "non-smoking">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "in-use" | "reserved">("all");
  const [selectedDate, setSelectedDate] = useState<"Hari Ini" | "Besok">("Hari Ini");
  const [selectedTime, setSelectedTime] = useState("19:00");
  const [selectedDuration, setSelectedDuration] = useState("3");
  const [selectedPackage, setSelectedPackage] = useState({
    id: "reg_3h",
    name: "3 Jam Regular (+ Bonus 30m)",
    price: 30000,
  });

  const [selectedPC, setSelectedPC] = useState<PCStation>(stationsData[7]); // Default PC-08
  const [agreeRules, setAgreeRules] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State inside Modal
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("qris");

  const filteredStations = stationsData.filter((s) => {
    if (roomFilter !== "all" && s.roomType !== roomFilter) return false;
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    return true;
  });

  const packagesList = [
    { id: "reg_30m", name: "30 Menit Regular", price: 5000 },
    { id: "reg_1h", name: "1 Jam Regular", price: 10000 },
    { id: "reg_2h", name: "2 Jam Regular", price: 20000 },
    { id: "reg_3h", name: "3 Jam Regular (+ Bonus 30m)", price: 30000 },
    { id: "reg_4h", name: "4 Jam Regular (+ Bonus 40m)", price: 40000 },
    { id: "reg_5h", name: "5 Jam Regular (+ Bonus 50m)", price: 50000 },
    { id: "mabar_2pc", name: "Paket Mabar 2 PC (5 Jam/PC)", price: 70000 },
    { id: "paket_12h", name: "Paket 12 Jam Marathon", price: 90000 },
    { id: "paket_24h", name: "Paket 24 Jam All-Day", price: 150000 },
    { id: "pagi", name: "Paket Pagi* 6 Jam [05:00-10:00]", price: 40000 },
    { id: "siang", name: "Paket Siang** 6 Jam [11:00-15:00]", price: 40000 },
    { id: "malam", name: "Paket Malam*** 9 Jam [20:00-02:00]", price: 50000 },
    { id: "war_tiket", name: "War Tiket 5 Jam (Speed 1 Gbps)", price: 45000 },
  ];

  const handleSelectPackage = (pkgId: string) => {
    const pkg = packagesList.find((p) => p.id === pkgId);
    if (pkg) {
      setSelectedPackage(pkg);
    }
  };

  const handleConfirmReservation = () => {
    if (!custName.trim() || !custPhone.trim()) {
      alert("Silakan lengkapi nama dan nomor WhatsApp Anda terlebih dahulu.");
      return;
    }
    setIsModalOpen(false);
    // Navigate to status page with query params
    const code = `HOG-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-${selectedPC.id.replace("-", "")}`;
    router.push(`/booking-status?code=${code}&pc=${selectedPC.id}&room=${encodeURIComponent(selectedPC.room)}&name=${encodeURIComponent(custName)}&time=${encodeURIComponent(selectedTime)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-base text-on-surface">
      <Navbar />

      <main className="w-full pt-20 bg-surface-base">
        <div className="flex flex-col w-full">
          {/* Subtle Ambient Top Halo */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-primary-container/10 blur-[130px] rounded-full pointer-events-none"></div>

            {/* Header Section */}
            <section className="relative w-full px-margin-mobile md:px-margin pt-space-lg pb-space-md">
              <div className="max-w-7xl mx-auto flex flex-col gap-space-md">
                {/* Breadcrumb & Real-time Pulsing Telemetry */}
                <div className="flex flex-wrap items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
                    <span className="text-on-surface-variant/70">Home</span>
                    <span className="text-outline">/</span>
                    <span className="text-primary font-headline-sm text-headline-sm">Reservasi &amp; Ketersediaan PC</span>
                  </div>
                  <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container rounded-full text-on-surface border border-surface-container-high/40">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-available animate-pulse"></span>
                    <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">
                      Live Telemetry Sync • Server HOG-JKT01
                    </span>
                  </div>
                </div>

                {/* Main Title & Copy */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
                  <div className="max-w-3xl flex flex-col gap-space-xs">
                    <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
                      Pilih PC, Atur Waktu, Mulai Gaming.
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant">
                      Cek ketersediaan 12 PC gaming HOG secara real-time, tentukan ruangan favorit, dan amankan stasiun gaming Anda sebelum datang.
                    </p>
                  </div>

                  {/* Status Summary Metric Pills */}
                  <div className="flex flex-wrap items-center gap-space-xs bg-surface-card p-space-xs rounded-xl shadow-xl border border-surface-container-high/40">
                    <div className="px-space-md py-space-xs rounded-lg bg-surface-container flex items-center gap-space-xs">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Total</span>
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">12 PC</span>
                    </div>
                    <div className="px-space-md py-space-xs rounded-lg bg-emerald-950/60 flex items-center gap-space-xs border border-emerald-800/40">
                      <span className="w-2 h-2 rounded-full bg-status-available"></span>
                      <span className="font-label-sm text-label-sm text-status-available uppercase font-semibold">Tersedia: 8</span>
                    </div>
                    <div className="px-space-md py-space-xs rounded-lg bg-cyan-950/50 flex items-center gap-space-xs border border-cyan-800/40">
                      <span className="w-2 h-2 rounded-full bg-status-in-use"></span>
                      <span className="font-label-sm text-label-sm text-status-in-use uppercase font-semibold">Digunakan: 3</span>
                    </div>
                    <div className="px-space-md py-space-xs rounded-lg bg-purple-950/50 flex items-center gap-space-xs border border-purple-800/40">
                      <span className="w-2 h-2 rounded-full bg-status-reserved"></span>
                      <span className="font-label-sm text-label-sm text-status-reserved uppercase font-semibold">Dipesan: 1</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Comprehensive Filter Bar */}
            <section className="w-full px-margin-mobile md:px-margin py-space-sm sticky top-20 z-40 bg-surface-base/90 backdrop-blur-xl">
              <div className="max-w-7xl mx-auto bg-surface-card p-space-md rounded-xl shadow-2xl flex flex-col gap-space-md border border-surface-container-high/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-space-md">
                  {/* Filter Ruangan */}
                  <div className="flex flex-col gap-space-xs">
                    <label className="font-label-sm text-label-sm uppercase text-on-surface-variant flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[14px]">meeting_room</span> Ruangan
                    </label>
                    <div className="relative">
                      <select
                        value={roomFilter}
                        onChange={(e) => setRoomFilter(e.target.value as any)}
                        className="w-full appearance-none bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-sm rounded-lg focus:outline-none focus:bg-surface-elevated transition-colors cursor-pointer border border-surface-container-high/30"
                      >
                        <option value="all">Semua Ruangan (12 PC)</option>
                        <option value="smoking">Smoking Zone (PC-01 - PC-06)</option>
                        <option value="non-smoking">VIP Non-Smoking (PC-07 - PC-12)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none text-[18px]">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Filter Status */}
                  <div className="flex flex-col gap-space-xs">
                    <label className="font-label-sm text-label-sm uppercase text-on-surface-variant flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[14px]">stream</span> Status Rig
                    </label>
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="w-full appearance-none bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-sm rounded-lg focus:outline-none focus:bg-surface-elevated transition-colors cursor-pointer border border-surface-container-high/30"
                      >
                        <option value="all">Semua Status</option>
                        <option value="available">Tersedia (Ready)</option>
                        <option value="in-use">Digunakan (Active)</option>
                        <option value="reserved">Dipesan (Booked)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none text-[18px]">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Paket / Sesi */}
                  <div className="flex flex-col gap-space-xs">
                    <label className="font-label-sm text-label-sm uppercase text-on-surface-variant flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[14px]">loyalty</span> Paket Billing
                    </label>
                    <div className="relative">
                      <select
                        value={selectedPackage.id}
                        onChange={(e) => handleSelectPackage(e.target.value)}
                        className="w-full appearance-none bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-sm rounded-lg focus:outline-none focus:bg-surface-elevated transition-colors cursor-pointer border border-surface-container-high/30"
                      >
                        <option value="regular">Billing Per Jam (Rp 10k/jam)</option>
                        <option value="pagi">Paket Pagi [08:00-12:00] (Rp 25k)</option>
                        <option value="siang">Paket Siang/Sore 4 Jam (Rp 35k)</option>
                        <option value="begadang">Paket Begadang 8 Jam (Rp 55k)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none text-[18px]">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Date Selector */}
                  <div className="flex flex-col gap-space-xs">
                    <label className="font-label-sm text-label-sm uppercase text-on-surface-variant flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span> Tanggal
                    </label>
                    <div className="flex items-center bg-surface-container-lowest rounded-lg p-1 border border-surface-container-high/30">
                      <button
                        onClick={() => setSelectedDate("Hari Ini")}
                        className={`flex-1 py-1.5 px-2 rounded font-label-sm text-label-sm font-semibold transition-all ${
                          selectedDate === "Hari Ini"
                            ? "bg-surface-elevated text-primary shadow-sm"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                        type="button"
                      >
                        Hari Ini
                      </button>
                      <button
                        onClick={() => setSelectedDate("Besok")}
                        className={`flex-1 py-1.5 px-2 rounded font-label-sm text-label-sm font-semibold transition-all ${
                          selectedDate === "Besok"
                            ? "bg-surface-elevated text-primary shadow-sm"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                        type="button"
                      >
                        Besok
                      </button>
                    </div>
                  </div>

                  {/* Jam Mulai */}
                  <div className="flex flex-col gap-space-xs">
                    <label className="font-label-sm text-label-sm uppercase text-on-surface-variant flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[14px]">schedule</span> Jam Mulai
                    </label>
                    <div className="relative">
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full appearance-none bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-sm rounded-lg focus:outline-none focus:bg-surface-elevated transition-colors cursor-pointer border border-surface-container-high/30"
                      >
                        <option value="15:00">15:00 WIB</option>
                        <option value="17:00">17:00 WIB</option>
                        <option value="19:00">19:00 WIB</option>
                        <option value="21:00">21:00 WIB</option>
                        <option value="23:00">23:00 WIB (Begadang)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none text-[18px]">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Durasi Jam */}
                  <div className="flex flex-col gap-space-xs">
                    <label className="font-label-sm text-label-sm uppercase text-on-surface-variant flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[14px]">timelapse</span> Durasi Bermain
                    </label>
                    <div className="relative">
                      <select
                        value={selectedDuration}
                        onChange={(e) => setSelectedDuration(e.target.value)}
                        className="w-full appearance-none bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-sm rounded-lg focus:outline-none focus:bg-surface-elevated transition-colors cursor-pointer border border-surface-container-high/30"
                      >
                        <option value="2">2 Jam</option>
                        <option value="3">3 Jam</option>
                        <option value="4">4 Jam (Recommended)</option>
                        <option value="6">6 Jam</option>
                        <option value="8">8 Jam (Paket Begadang)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none text-[18px]">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Main Content Area: Split Grid + Desktop Sticky Summary */}
            <section className="w-full px-margin-mobile md:px-margin py-space-lg">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
                {/* PC Stations Column (Left, 8 Cols on desktop) */}
                <div className="lg:col-span-8 flex flex-col gap-space-xl">
                  {/* Smoking Zone */}
                  {(roomFilter === "all" || roomFilter === "smoking") && (
                    <div className="flex flex-col gap-space-md">
                      <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high/40">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-3 h-3 rounded-sm bg-accent-emerald"></div>
                          <div>
                            <h2 className="font-headline-md text-headline-md text-primary font-bold">
                              Smoking Zone (Area Merokok)
                            </h2>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              PC-01 s/d PC-06 • Exhaust Turbofan 3000 RPM &amp; Air Purifier Aktif
                            </p>
                          </div>
                        </div>
                        <span className="px-space-sm py-1 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">
                          Station 01-06
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
                        {filteredStations
                          .filter((s) => s.roomType === "smoking")
                          .map((station) => {
                            const isSelected = selectedPC.id === station.id;
                            return (
                              <div
                                key={station.id}
                                onClick={() => {
                                  if (station.status === "available") setSelectedPC(station);
                                }}
                                className={`relative bg-surface-card rounded-xl p-space-md transition-all border ${
                                  isSelected
                                    ? "border-primary-container ring-1 ring-primary-container shadow-[0_0_20px_rgba(0,255,102,0.2)]"
                                    : "border-surface-container-high/40 hover:bg-surface-elevated cursor-pointer"
                                } ${station.status !== "available" ? "opacity-80" : ""}`}
                              >
                                {isSelected && (
                                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary-fixed px-space-md py-0.5 rounded-full font-label-sm text-label-sm uppercase font-bold flex items-center gap-1 shadow-lg">
                                    <span className="material-symbols-outlined text-[14px]">check_circle</span> Rig Dipilih
                                  </div>
                                )}

                                <div className="flex items-center justify-between">
                                  <span className="font-headline-sm text-headline-sm text-primary font-bold">{station.id}</span>
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm uppercase font-semibold ${
                                      station.status === "available"
                                        ? "bg-status-available/10 text-status-available"
                                        : station.status === "in-use"
                                        ? "bg-status-in-use/10 text-status-in-use"
                                        : "bg-status-reserved/10 text-status-reserved"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        station.status === "available"
                                          ? "bg-status-available animate-pulse"
                                          : station.status === "in-use"
                                          ? "bg-status-in-use"
                                          : "bg-status-reserved"
                                      }`}
                                    ></span>
                                    {station.status === "available" ? "Tersedia" : station.status === "in-use" ? "Digunakan" : "Dipesan"}
                                  </span>
                                </div>

                                <div className="my-space-md py-space-sm flex items-center justify-center relative">
                                  <div className="w-24 h-16 rounded-t-md bg-surface-container-high relative flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary-container/20 to-transparent"></div>
                                    <span className="material-symbols-outlined text-primary text-[28px]">
                                      {station.status === "available" ? "desktop_windows" : "sports_esports"}
                                    </span>
                                  </div>
                                  <div className="absolute -bottom-1 w-10 h-1.5 bg-surface-container-highest rounded-full"></div>
                                </div>

                                <div className="flex flex-col gap-1 font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                                  <div className="flex items-center justify-between">
                                    <span>GPU / Refresh:</span>
                                    <span className="text-on-surface font-medium">{station.gpu}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Display:</span>
                                    <span className="text-on-surface">{station.display}</span>
                                  </div>
                                  {station.remainingTime && (
                                    <div className="flex items-center justify-between pt-1 border-t border-surface-container-high/30">
                                      <span>Sisa Waktu:</span>
                                      <span className="text-status-in-use font-semibold">{station.remainingTime}</span>
                                    </div>
                                  )}
                                </div>

                                {station.status === "available" ? (
                                  <button
                                    onClick={() => setSelectedPC(station)}
                                    className={`w-full py-space-xs rounded-lg font-label-md text-label-md font-semibold transition-all flex items-center justify-center gap-1 ${
                                      isSelected
                                        ? "bg-primary-container text-on-primary-fixed shadow-[0_0_15px_rgba(0,255,102,0.3)]"
                                        : "bg-surface-container text-on-surface hover:bg-primary-container hover:text-on-primary-fixed"
                                    }`}
                                    type="button"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">
                                      {isSelected ? "check" : "touch_app"}
                                    </span>
                                    {isSelected ? "Rig Aktif Dipilih" : "Pilih PC Ini"}
                                  </button>
                                ) : (
                                  <div className="w-full py-space-xs rounded-lg bg-surface-container-low text-on-surface-variant text-center font-label-sm text-label-sm">
                                    {station.status === "in-use" ? "Sedang Berlangsung" : "Sudah Dipesan"}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* VIP Non-Smoking Zone */}
                  {(roomFilter === "all" || roomFilter === "non-smoking") && (
                    <div className="flex flex-col gap-space-md">
                      <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high/40">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-3 h-3 rounded-sm bg-secondary"></div>
                          <div>
                            <h2 className="font-headline-md text-headline-md text-primary font-bold">
                              VIP Non-Smoking Zone (Ruang Bebas Asap)
                            </h2>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              PC-07 s/d PC-12 • LG OLED 240Hz / BenQ 360Hz &amp; Ergonomic Secretlab Chair
                            </p>
                          </div>
                        </div>
                        <span className="px-space-sm py-1 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">
                          Station 07-12
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
                        {filteredStations
                          .filter((s) => s.roomType === "non-smoking")
                          .map((station) => {
                            const isSelected = selectedPC.id === station.id;
                            return (
                              <div
                                key={station.id}
                                onClick={() => {
                                  if (station.status === "available") setSelectedPC(station);
                                }}
                                className={`relative bg-surface-card rounded-xl p-space-md transition-all border ${
                                  isSelected
                                    ? "border-primary-container ring-1 ring-primary-container shadow-[0_0_20px_rgba(0,255,102,0.2)]"
                                    : "border-surface-container-high/40 hover:bg-surface-elevated cursor-pointer"
                                } ${station.status !== "available" ? "opacity-80" : ""}`}
                              >
                                {isSelected && (
                                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary-fixed px-space-md py-0.5 rounded-full font-label-sm text-label-sm uppercase font-bold flex items-center gap-1 shadow-lg">
                                    <span className="material-symbols-outlined text-[14px]">check_circle</span> Rig Dipilih
                                  </div>
                                )}

                                <div className="flex items-center justify-between">
                                  <span className="font-headline-sm text-headline-sm text-primary font-bold">{station.id}</span>
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm uppercase font-semibold ${
                                      station.status === "available"
                                        ? "bg-status-available/10 text-status-available"
                                        : station.status === "in-use"
                                        ? "bg-status-in-use/10 text-status-in-use"
                                        : "bg-status-reserved/10 text-status-reserved"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        station.status === "available"
                                          ? "bg-status-available animate-pulse"
                                          : station.status === "in-use"
                                          ? "bg-status-in-use"
                                          : "bg-status-reserved"
                                      }`}
                                    ></span>
                                    {station.status === "available" ? "Tersedia" : station.status === "in-use" ? "Digunakan" : "Dipesan"}
                                  </span>
                                </div>

                                <div className="my-space-md py-space-sm flex items-center justify-center relative">
                                  <div className="w-24 h-16 rounded-t-md bg-surface-container-high relative flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary-container/20 to-transparent"></div>
                                    <span className="material-symbols-outlined text-primary text-[28px]">
                                      {station.status === "available" ? "desktop_windows" : "sports_esports"}
                                    </span>
                                  </div>
                                  <div className="absolute -bottom-1 w-10 h-1.5 bg-surface-container-highest rounded-full"></div>
                                </div>

                                <div className="flex flex-col gap-1 font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                                  <div className="flex items-center justify-between">
                                    <span>GPU:</span>
                                    <span className="text-on-surface font-medium">{station.gpu}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Display:</span>
                                    <span className="text-on-surface">{station.display}</span>
                                  </div>
                                  {station.remainingTime && (
                                    <div className="flex items-center justify-between pt-1 border-t border-surface-container-high/30">
                                      <span>Sisa Waktu:</span>
                                      <span className="text-status-in-use font-semibold">{station.remainingTime}</span>
                                    </div>
                                  )}
                                </div>

                                {station.status === "available" ? (
                                  <button
                                    onClick={() => setSelectedPC(station)}
                                    className={`w-full py-space-xs rounded-lg font-label-md text-label-md font-semibold transition-all flex items-center justify-center gap-1 ${
                                      isSelected
                                        ? "bg-primary-container text-on-primary-fixed shadow-[0_0_15px_rgba(0,255,102,0.3)]"
                                        : "bg-surface-container text-on-surface hover:bg-primary-container hover:text-on-primary-fixed"
                                    }`}
                                    type="button"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">
                                      {isSelected ? "check" : "touch_app"}
                                    </span>
                                    {isSelected ? "Rig Aktif Dipilih" : "Pilih PC Ini"}
                                  </button>
                                ) : (
                                  <div className="w-full py-space-xs rounded-lg bg-surface-container-low text-on-surface-variant text-center font-label-sm text-label-sm">
                                    {station.status === "in-use" ? "Sedang Berlangsung" : "Sudah Dipesan"}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Feature Amenity Banner */}
                  <div className="w-full bg-surface-card rounded-xl p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-lg border border-surface-container-high/40">
                    <div className="flex items-center gap-space-md">
                      <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary-container text-[28px]">bolt</span>
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-headline-sm text-headline-sm text-primary font-bold">
                          Jaminan Latensi &lt; 3ms Fiber Dedicated
                        </h4>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                          Dual ISP Biznet &amp; Telkom IndiHome Enterprise dengan automatic load balancing tanpa drop packet.
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-surface-container text-secondary shrink-0 font-semibold">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span className="font-label-md text-label-md">Tier-1 Esports Ready</span>
                    </div>
                  </div>
                </div>

                {/* Sticky Booking Summary Desktop Panel (4 Cols on desktop) */}
                <div className="lg:col-span-4 sticky top-44 z-30 flex flex-col gap-space-md">
                  <div className="bg-surface-card rounded-xl p-space-lg shadow-2xl backdrop-blur-xl flex flex-col gap-space-md border border-surface-container-high/50">
                    <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high/30">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-primary-container text-[22px]">receipt_long</span>
                        <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                          Ringkasan Reservasi
                        </h3>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-status-available animate-ping"></span>
                    </div>

                    {/* Rig Preview Card */}
                    <div className="bg-surface-container-lowest p-space-md rounded-xl flex flex-col gap-space-xs border border-surface-container-high/30">
                      <div className="flex items-center justify-between">
                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                          PC Terpilih
                        </span>
                        <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-primary-container/20 text-primary font-bold">
                          {selectedPC.id}
                        </span>
                      </div>
                      <div className="text-on-surface font-headline-sm text-headline-sm font-bold">
                        {selectedPC.room}
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {selectedPC.specs}
                      </p>
                    </div>

                    {/* Parameters Breakdown */}
                    <div className="flex flex-col gap-space-xs font-body-sm text-body-sm">
                      <div className="flex items-center justify-between py-1 text-on-surface-variant">
                        <span>Tanggal Sesi:</span>
                        <span className="text-on-surface font-medium">{selectedDate}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 text-on-surface-variant">
                        <span>Jam Reservasi:</span>
                        <span className="text-on-surface font-medium">{selectedTime} WIB ({selectedDuration} Jam)</span>
                      </div>
                      <div className="flex items-center justify-between py-1 text-on-surface-variant">
                        <span>Skema Paket:</span>
                        <span className="text-on-surface font-medium">{selectedPackage.name}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 text-on-surface-variant">
                        <span>Free Perks:</span>
                        <span className="text-status-available font-medium">1x Free Cold Mineral Water</span>
                      </div>
                    </div>

                    <div className="w-full h-px bg-surface-container-highest my-1"></div>

                    {/* Cost Calculation Box */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
                          Estimasi Biaya Sesi
                        </span>
                        <span className="font-headline-md text-headline-md text-primary font-bold">
                          Rp {selectedPackage.price.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant/80">
                        Sudah termasuk PPN 11% &amp; Free Headset Sterilization.
                      </p>
                    </div>

                    {/* Agreement Checkbox */}
                    <label className="flex items-start gap-space-xs cursor-pointer group mt-space-xs select-none">
                      <input
                        checked={agreeRules}
                        onChange={(e) => setAgreeRules(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded bg-surface-container-lowest text-primary-container focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        type="checkbox"
                      />
                      <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                        Saya menyetujui tata tertib warnet HOG (Dilarang cheat, jaga kebersihan meja, hadir tepat waktu toleransi 15 menit).
                      </span>
                    </label>

                    {/* CTA Button */}
                    <button
                      onClick={() => {
                        if (!agreeRules) {
                          alert("Silakan centang persetujuan tata tertib warnet terlebih dahulu.");
                          return;
                        }
                        setIsModalOpen(true);
                      }}
                      className="w-full py-space-sm rounded-lg bg-primary-container text-on-primary-fixed font-label-lg text-label-lg font-bold hover:shadow-[0_0_24px_rgba(0,255,102,0.4)] transition-all flex items-center justify-center gap-space-xs mt-space-xs cursor-pointer"
                      type="button"
                    >
                      <span>Lanjutkan ke Konfirmasi Booking</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>

                    <div className="flex items-center justify-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[14px]">lock</span>
                      <span>Koneksi Aman Enkripsi SSL 256-bit</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Interactive Booking & Payment Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-surface-base/80 backdrop-blur-md flex items-center justify-center p-margin-mobile md:p-margin animate-in fade-in duration-200">
              <div className="relative w-full max-w-2xl bg-surface-card rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-surface-container-high/60">
                {/* Modal Header */}
                <div className="p-space-lg bg-surface-container flex items-center justify-between shrink-0 border-b border-surface-container-high/50">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary-container">
                      <span className="material-symbols-outlined text-[24px]">confirmation_number</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-primary font-bold">
                        Konfirmasi Reservasi &amp; Pembayaran
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Lengkapi data Anda untuk mengamankan tiket gaming HOG.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-space-lg overflow-y-auto flex flex-col gap-space-lg">
                  {/* Selected Rig Summary Banner */}
                  <div className="bg-surface-container-lowest p-space-md rounded-xl flex items-center justify-between border border-surface-container-high/40">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary-container font-bold text-lg">
                        {selectedPC.id}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-primary font-semibold">{selectedPC.room}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {selectedDate} • {selectedTime} WIB ({selectedDuration} Jam)
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-headline-md text-headline-md text-primary font-bold">
                        Rp {selectedPackage.price.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="flex flex-col gap-space-md">
                    <h4 className="font-headline-sm text-headline-sm text-primary font-semibold">
                      Informasi Pemesan
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                          Nama Lengkap / Nickname <span className="text-error">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={custName}
                          onChange={(e) => setCustName(e.target.value)}
                          placeholder="Contoh: Rizki Gamer"
                          className="px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface border border-surface-container-high/50 focus:outline-none focus:border-primary-container font-body-md"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                          Nomor WhatsApp <span className="text-error">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={custPhone}
                          onChange={(e) => setCustPhone(e.target.value)}
                          placeholder="081234567890"
                          className="px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface border border-surface-container-high/50 focus:outline-none focus:border-primary-container font-body-md"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="flex flex-col gap-space-md">
                    <h4 className="font-headline-sm text-headline-sm text-primary font-semibold">
                      Metode Pembayaran
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                      {[
                        { id: "qris", name: "QRIS Instant (GoPay/OVO/BCA)", icon: "qr_code_2" },
                        { id: "bca", name: "BCA Virtual Account", icon: "account_balance" },
                        { id: "mandiri", name: "Mandiri Virtual Account", icon: "account_balance" },
                        { id: "cash", name: "Bayar di Kasir HOG", icon: "payments" },
                      ].map((m) => (
                        <div
                          key={m.id}
                          onClick={() => setPaymentMethod(m.id)}
                          className={`p-space-md rounded-xl flex items-center justify-between cursor-pointer border transition-all ${
                            paymentMethod === m.id
                              ? "bg-surface-elevated border-primary-container shadow-[0_0_15px_rgba(0,255,102,0.15)]"
                              : "bg-surface-container-lowest border-surface-container-high/40 hover:bg-surface-container/60"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary-container text-[24px]">
                              {m.icon}
                            </span>
                            <span className="font-label-md text-label-md font-medium text-on-surface">
                              {m.name}
                            </span>
                          </div>
                          <div
                            className={`w-3 h-3 rounded-full ${
                              paymentMethod === m.id ? "bg-primary-container" : "border border-surface-container-highest"
                            }`}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-space-lg bg-surface-container flex items-center justify-between shrink-0 border-t border-surface-container-high/50">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    type="button"
                    className="px-space-lg py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest font-label-md text-label-md text-on-surface transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmReservation}
                    type="button"
                    className="px-space-xl py-2.5 rounded-lg bg-primary-container text-on-primary-fixed font-label-md text-label-md font-bold hover:shadow-[0_0_20px_rgba(0,255,102,0.4)] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Konfirmasi &amp; Amankan PC</span>
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
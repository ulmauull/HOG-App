"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

interface PCStation {
  id: string;
  room: string;
  roomType: "smoking" | "non-smoking";
  status: "available" | "in-use" | "reserved" | "offline";
  specs: string;
  gpu: string;
  cpu: string;
  display: string;
  cooling: "FAN" | "AC";
  smoking: "YA" | "NO" | "FLEXIBLE";
  peripherals: string;
  remainingTime?: string;
  currentGame?: string;
  reservedAt?: string;
}

interface PackageItem {
  id: string | number;
  name: string;
  price: number;
  duration_minutes: number;
  bonus?: string;
  expired?: string;
  description?: string;
}

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPcId = searchParams.get("pc");

  const peripheralsCommon = "Gamen III / MXRSKEY / Leobog A80 HE Rapid Trigger • Logitech G 203 / G 102 • HyperX";

  // Initial specs aligned 100% with HOG Specs Table Poster
  const initialStations: PCStation[] = [
    {
      id: "PC-01",
      room: "Smoking Zone",
      roomType: "smoking",
      status: "available",
      specs: "RTX 4060 Ti • i7 Gen 14 • 360 (OC 390) Hz • FAN",
      gpu: "RTX 4060 Ti",
      cpu: "i7 Gen 14",
      display: "360 (OC 390) Hz",
      cooling: "FAN",
      smoking: "YA",
      peripherals: peripheralsCommon,
    },
    {
      id: "PC-02",
      room: "Smoking Zone",
      roomType: "smoking",
      status: "available",
      specs: "RTX 4060 Ti • i5 Gen 12 • 300 Hz • FAN",
      gpu: "RTX 4060 Ti",
      cpu: "i5 Gen 12",
      display: "300 Hz",
      cooling: "FAN",
      smoking: "YA",
      peripherals: peripheralsCommon,
    },
    {
      id: "PC-03",
      room: "Smoking Zone",
      roomType: "smoking",
      status: "available",
      specs: "RX 6600 • i5 Gen 12 • 240 (OC 270) Hz • FAN",
      gpu: "RX 6600",
      cpu: "i5 Gen 12",
      display: "240 (OC 270) Hz",
      cooling: "FAN",
      smoking: "YA",
      peripherals: peripheralsCommon,
    },
    {
      id: "PC-04",
      room: "Smoking Zone",
      roomType: "smoking",
      status: "available",
      specs: "RTX 3070 • i5 Gen 12 • 240 (OC 270) Hz • FAN",
      gpu: "RTX 3070",
      cpu: "i5 Gen 12",
      display: "240 (OC 270) Hz",
      cooling: "FAN",
      smoking: "YA",
      peripherals: peripheralsCommon,
    },
    {
      id: "PC-05",
      room: "Smoking Zone",
      roomType: "smoking",
      status: "available",
      specs: "RTX 4060 Ti • i5 Gen 12 • 360 (OC 390) Hz • FAN",
      gpu: "RTX 4060 Ti",
      cpu: "i5 Gen 12",
      display: "360 (OC 390) Hz",
      cooling: "FAN",
      smoking: "YA",
      peripherals: peripheralsCommon,
    },
    {
      id: "PC-06",
      room: "Smoking Zone",
      roomType: "smoking",
      status: "available",
      specs: "RTX 4060 Ti • i5 Gen 12 • 360 (OC 390) Hz • FAN",
      gpu: "RTX 4060 Ti",
      cpu: "i5 Gen 12",
      display: "360 (OC 390) Hz",
      cooling: "FAN",
      smoking: "YA",
      peripherals: peripheralsCommon,
    },
    {
      id: "PC-07",
      room: "Flexible Smoking Zone",
      roomType: "smoking",
      status: "available",
      specs: "RTX 4060 Ti • i5 Gen 12 • 240 (OC 270) Hz • FAN • Flexible",
      gpu: "RTX 4060 Ti",
      cpu: "i5 Gen 12",
      display: "240 (OC 270) Hz",
      cooling: "FAN",
      smoking: "FLEXIBLE",
      peripherals: peripheralsCommon,
    },
    {
      id: "PC-08",
      room: "VIP Non-Smoking Zone",
      roomType: "non-smoking",
      status: "available",
      specs: "RTX 4060 Ti • i5 Gen 12 • 360 (OC 390) Hz • AC • No Smoking",
      gpu: "RTX 4060 Ti",
      cpu: "i5 Gen 12",
      display: "360 (OC 390) Hz",
      cooling: "AC",
      smoking: "NO",
      peripherals: peripheralsCommon,
    },
    {
      id: "PC-09",
      room: "VIP Non-Smoking Zone",
      roomType: "non-smoking",
      status: "available",
      specs: "RTX 4060 Ti • i5 Gen 13 • 240 (OC 270) Hz • AC • No Smoking",
      gpu: "RTX 4060 Ti",
      cpu: "i5 Gen 13",
      display: "240 (OC 270) Hz",
      cooling: "AC",
      smoking: "NO",
      peripherals: peripheralsCommon,
    },
    {
      id: "PC-10",
      room: "VIP Non-Smoking Zone",
      roomType: "non-smoking",
      status: "available",
      specs: "RTX 4070 SU • i7 Gen 14 • 300 Hz • AC • No Smoking",
      gpu: "RTX 4070 SU",
      cpu: "i7 Gen 14",
      display: "300 Hz",
      cooling: "AC",
      smoking: "NO",
      peripherals: peripheralsCommon,
    },
    {
      id: "PC-11",
      room: "VIP Non-Smoking Zone",
      roomType: "non-smoking",
      status: "available",
      specs: "RTX 4070 SU • i7 Gen 14 • 300 Hz • AC • No Smoking",
      gpu: "RTX 4070 SU",
      cpu: "i7 Gen 14",
      display: "300 Hz",
      cooling: "AC",
      smoking: "NO",
      peripherals: peripheralsCommon,
    },
    {
      id: "PC-12",
      room: "VIP Non-Smoking Zone",
      roomType: "non-smoking",
      status: "available",
      specs: "RTX 4070 SU • i7 Gen 14 • 300 Hz • AC • No Smoking",
      gpu: "RTX 4070 SU",
      cpu: "i7 Gen 14",
      display: "300 Hz",
      cooling: "AC",
      smoking: "NO",
      peripherals: peripheralsCommon,
    },
  ];

  const officialPackages: PackageItem[] = [
    { id: "test_qris", name: "🧪 Mode Uji Coba QRIS (Rp 1.000)", price: 1000, duration_minutes: 60, bonus: "Khusus Tes Demo", expired: "Selesai Sesi" },
    { id: "reg_3h", name: "3 Jam Regular (+ Bonus 30m)", price: 30000, duration_minutes: 180, bonus: "+30 Menit", expired: "3 Bulan" },
    { id: "reg_4h", name: "4 Jam Regular (+ Bonus 40m)", price: 40000, duration_minutes: 240, bonus: "+40 Menit", expired: "3 Bulan" },
    { id: "reg_5h", name: "5 Jam Regular (+ Bonus 50m)", price: 50000, duration_minutes: 300, bonus: "+50 Menit", expired: "3 Bulan" },
    { id: "pagi", name: "Paket Pagi* 6 Jam [05:00-10:00]", price: 40000, duration_minutes: 360, bonus: "-", expired: "Selesai Sesi" },
    { id: "siang", name: "Paket Siang** 6 Jam [11:00-15:00]", price: 40000, duration_minutes: 360, bonus: "-", expired: "Selesai Sesi" },
    { id: "malam", name: "Paket Malam*** 9 Jam [20:00-02:00]", price: 50000, duration_minutes: 540, bonus: "-", expired: "Selesai Sesi" },
    { id: "war_tiket", name: "War Tiket 5 Jam (Dedicated 1 Gbps)", price: 45000, duration_minutes: 300, bonus: "Prioritas 1Gbps", expired: "Selesai Sesi" },
    { id: "mabar_2pc", name: "Paket Mabar 2 PC (5 Jam/PC)", price: 70000, duration_minutes: 300, bonus: "-", expired: "Selesai Sesi" },
    { id: "paket_12h", name: "Paket 12 Jam Marathon", price: 90000, duration_minutes: 720, bonus: "-", expired: "Selesai Sesi" },
    { id: "paket_24h", name: "Paket 24 Jam All-Day", price: 150000, duration_minutes: 1440, bonus: "-", expired: "Selesai Sesi" },
    { id: "reg_30m", name: "30 Menit Regular", price: 5000, duration_minutes: 30, bonus: "-", expired: "3 Bulan" },
    { id: "reg_1h", name: "1 Jam Regular", price: 10000, duration_minutes: 60, bonus: "-", expired: "3 Bulan" },
    { id: "reg_2h", name: "2 Jam Regular", price: 20000, duration_minutes: 120, bonus: "-", expired: "3 Bulan" },
  ];

  const [stations, setStations] = useState<PCStation[]>(initialStations);
  const [packages, setPackages] = useState<PackageItem[]>(officialPackages);

  // Filters & State
  const [roomFilter, setRoomFilter] = useState<"all" | "smoking" | "non-smoking">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "in-use" | "reserved" | "offline">("all");
  // Helper: today's date in Jakarta timezone (YYYY-MM-DD)
  const getJakartaDate = (offsetDays = 0): string => {
    const d = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000);
    return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(d);
  };

  // Helper: current time in Jakarta +1 hour, rounded to nearest 30m
  const getDefaultTime = (): string => {
    const d = new Date(Date.now() + 60 * 60 * 1000); // +1 jam
    const jakartaHour = parseInt(
      new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", hour12: false }).format(d)
    );
    const jakartaMin = parseInt(
      new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", minute: "2-digit" }).format(d)
    );
    const roundedMin = jakartaMin >= 30 ? 30 : 0;
    return `${String(jakartaHour % 24).padStart(2, "0")}:${String(roundedMin).padStart(2, "0")}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getJakartaDate(0));
  const [selectedTime, setSelectedTime] = useState(getDefaultTime());
  const [selectedDuration, setSelectedDuration] = useState("3");
  const [selectedPackage, setSelectedPackage] = useState<PackageItem>(officialPackages[0]); // Default 3 Jam
  const [selectedPC, setSelectedPC] = useState<PCStation>(initialStations[7]); // Default PC-08
  const [agreeRules, setAgreeRules] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State inside Modal
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("qris");

  // Load live PCs & packages from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch PCs
        const { data: dbPcs } = await supabase.from("pcs").select("*").order("id");
        if (dbPcs && dbPcs.length > 0) {
          setStations((prev) =>
            prev.map((station) => {
              const matched = dbPcs.find((d: any) => d.pc_code === station.id);
              if (matched) {
                let status: "available" | "in-use" | "reserved" | "offline" = "available";
                if (matched.connection_status === "offline") {
                  status = "offline";
                } else if (matched.current_session_id) {
                  status = "in-use";
                }
                return {
                  ...station,
                  status,
                };
              }
              return station;
            })
          );
        }

        // Fetch Packages
        const { data: dbPkgs } = await supabase.from("packages").select("*").eq("is_active", 1).order("id");
        if (dbPkgs && dbPkgs.length > 0) {
          const mapped = dbPkgs.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            duration_minutes: p.duration_minutes,
            description: p.description,
          }));
          setPackages(mapped);
          // Set selected package default
          const defaultPkg = mapped.find((p: any) => p.name.includes("3 Jam")) || mapped[0];
          setSelectedPackage(defaultPkg);
        }
      } catch (err) {
        console.error("Error loading data from Supabase:", err);
      }
    }

    loadData();

    // Handle preselected PC from query param
    if (preselectedPcId) {
      const found = initialStations.find((s) => s.id === preselectedPcId);
      if (found) {
        setSelectedPC(found);
      }
    }

    // Realtime channel
    const channel = supabase
      .channel("booking-pcs-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "pcs" }, () => {
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [preselectedPcId]);

  const handleSelectPackage = (pkgId: string | number) => {
    const pkg = packages.find((p) => String(p.id) === String(pkgId));
    if (pkg) {
      setSelectedPackage(pkg);
      // Automatically adjust duration in hours
      const hours = Math.round(pkg.duration_minutes / 60);
      if (hours > 0) {
        setSelectedDuration(String(hours));
      }
    }
  };

  const handleConfirmReservation = async () => {
    if (!custName.trim() || !custPhone.trim()) {
      alert("Silakan lengkapi nama dan nomor WhatsApp Anda terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Check or Insert Customer in Supabase
      let customerId: number | null = null;
      const cleanPhone = custPhone.trim().replace(/\D/g, "");

      const { data: existingCust } = await supabase
        .from("customers")
        .select("id")
        .eq("phone", cleanPhone)
        .limit(1);

      if (existingCust && existingCust.length > 0) {
        customerId = existingCust[0].id;
      } else {
        const { data: newCust, error: custErr } = await supabase
          .from("customers")
          .insert([{ name: custName.trim(), phone: cleanPhone }])
          .select("id");

        if (newCust && newCust.length > 0) {
          customerId = newCust[0].id;
        } else if (custErr) {
          console.warn("Could not insert customer into Supabase:", custErr.message);
        }
      }

      // 2. Generate Booking Code
      const today = new Date();
      const datePart = selectedDate.replace(/-/g, ""); // use selected booking date (YYYYMMDD)
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const bookingCode = `HOG-${datePart}-${selectedPC.id.replace("-", "")}-${randomSuffix}`;

      // Calculate start and end time
      const startTimeFormatted = `${selectedTime}:00`;
      const durationMin = selectedPackage.duration_minutes || (parseInt(selectedDuration, 10) * 60) || 180;
      
      const [sh, sm] = selectedTime.split(":").map(Number);
      const endTotalMinutes = sh * 60 + sm + durationMin;
      const endH = Math.floor((endTotalMinutes % 1440) / 60);
      const endM = endTotalMinutes % 60;
      const endTimeFormatted = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}:00`;

      const bookingDateStr = selectedDate; // already YYYY-MM-DD from Jakarta timezone
      const pcNumericId = parseInt(selectedPC.id.replace("PC-", ""), 10);

      // Generate 3-digit random unique code for QRIS auto-confirmation (e.g. Rp 30.142)
      const uniqueCode = paymentMethod === "cash" ? 0 : Math.floor(100 + Math.random() * 899);
      const finalTotalPrice = Number(selectedPackage.price) + uniqueCode;

      // 3. Insert Booking Record
      const { data: bookingData, error: bookErr } = await supabase
        .from("bookings")
        .insert([
          {
            booking_code: bookingCode,
            customer_id: customerId,
            pc_id: pcNumericId,
            package_id: typeof selectedPackage.id === "number" ? selectedPackage.id : 1,
            room_type: selectedPC.roomType,
            booking_date: bookingDateStr,
            start_time: startTimeFormatted,
            end_time: endTimeFormatted,
            duration_minutes: durationMin,
            total_price: finalTotalPrice,
            status: "pending_payment",
          },
        ])
        .select("id");

      if (bookErr) {
        console.warn("Supabase booking insert warning:", bookErr.message);
      }

      // 4. Insert Payment Record
      if (bookingData && bookingData[0]) {
        await supabase.from("payments").insert([
          {
            booking_id: bookingData[0].id,
            amount: finalTotalPrice,
            payment_method: paymentMethod === "cash" ? "cash" : paymentMethod === "qris" ? "qris" : "bank_transfer",
            payment_status: "pending",
          },
        ]);
      }

      setIsModalOpen(false);

      // Navigate to status page
      router.push(
        `/booking-status?code=${bookingCode}&pc=${selectedPC.id}&room=${encodeURIComponent(
          selectedPC.room
        )}&name=${encodeURIComponent(custName)}&time=${encodeURIComponent(
          selectedTime
        )}&date=${selectedDate}&pkg=${encodeURIComponent(selectedPackage.name)}&price=${finalTotalPrice}&basePrice=${selectedPackage.price}&uniqueCode=${uniqueCode}`
      );
    } catch (err: any) {
      console.error("Booking failed:", err);
      alert("Terjadi kesalahan saat memproses reservasi. Silakan hubungi admin via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStations = stations.filter((s) => {
    if (roomFilter !== "all" && s.roomType !== roomFilter) return false;
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    return true;
  });

  const availableCount = stations.filter((s) => s.status === "available").length;
  const inUseCount = stations.filter((s) => s.status === "in-use").length;
  const reservedCount = stations.filter((s) => s.status === "reserved").length;

  // Format date for human-readable display
  const formatDisplayDate = (dateStr: string): string => {
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const todayStr = getJakartaDate(0);
    const tomorrowStr = getJakartaDate(1);
    const [y, m, d] = dateStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dateFormatted = new Intl.DateTimeFormat("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(dateObj);
    if (dateStr === todayStr) return `Hari Ini (${dateFormatted})`;
    if (dateStr === tomorrowStr) return `Besok (${dateFormatted})`;
    return dateFormatted;
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-base text-on-surface">
      <Navbar />

      <main className="w-full pt-20 bg-surface-base">
        <div className="flex flex-col w-full">
          {/* Top Halo */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-primary-container/10 blur-[130px] rounded-full pointer-events-none"></div>

            {/* Header Section */}
            <section className="relative w-full px-margin-mobile md:px-margin pt-space-lg pb-space-md">
              <div className="max-w-7xl mx-auto flex flex-col gap-space-md">
                <div className="flex flex-wrap items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
                    <span className="text-on-surface-variant/70">Home</span>
                    <span className="text-outline">/</span>
                    <span className="text-primary font-headline-sm text-headline-sm">Reservasi &amp; Ketersediaan PC</span>
                  </div>
                  <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container rounded-full text-on-surface border border-surface-container-high/40">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-available animate-pulse"></span>
                    <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">
                      Live Telemetry • Supabase Cloud Active
                    </span>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
                  <div className="max-w-3xl flex flex-col gap-space-xs">
                    <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
                      Pilih PC, Atur Waktu, Mulai Gaming.
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant">
                      Koneksi dedicated 1 Gbps &amp; bebas unduh game apa pun tanpa request operator. Amankan rig pilihan Anda sebelum datang.
                    </p>
                  </div>

                  {/* Status Metric Pills */}
                  <div className="flex flex-wrap items-center gap-space-xs bg-surface-card p-space-xs rounded-xl shadow-xl border border-surface-container-high/40">
                    <div className="px-space-md py-space-xs rounded-lg bg-surface-container flex items-center gap-space-xs">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Total</span>
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">12 Rig</span>
                    </div>
                    <div className="px-space-md py-space-xs rounded-lg bg-emerald-950/60 flex items-center gap-space-xs border border-emerald-800/40">
                      <span className="w-2 h-2 rounded-full bg-status-available"></span>
                      <span className="font-label-sm text-label-sm text-status-available uppercase font-semibold">
                        Tersedia: {availableCount}
                      </span>
                    </div>
                    <div className="px-space-md py-space-xs rounded-lg bg-cyan-950/50 flex items-center gap-space-xs border border-cyan-800/40">
                      <span className="w-2 h-2 rounded-full bg-status-in-use"></span>
                      <span className="font-label-sm text-label-sm text-status-in-use uppercase font-semibold">
                        Digunakan: {inUseCount}
                      </span>
                    </div>
                    <div className="px-space-md py-space-xs rounded-lg bg-purple-950/50 flex items-center gap-space-xs border border-purple-800/40">
                      <span className="w-2 h-2 rounded-full bg-status-reserved"></span>
                      <span className="font-label-sm text-label-sm text-status-reserved uppercase font-semibold">
                        Dipesan: {reservedCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Important Policy Strip from Poster */}
                <div className="p-3.5 rounded-xl bg-surface-card border border-primary-container/30 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary-container text-[24px]">verified</span>
                    <span className="font-body-sm text-body-sm text-on-surface">
                      <strong>Ketentuan HOG:</strong> Booking PC minimal <strong>3 Jam</strong> • Bebas download game tanpa izin operator • Speed 1 Gbps.
                    </span>
                  </div>
                  <a
                    href="https://wa.me/6287878672111"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-label-sm text-label-sm text-primary-container hover:underline font-bold"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    <span>WhatsApp: 0878-7867-2111</span>
                  </a>
                </div>
              </div>
            </section>

            {/* Comprehensive Filter Bar */}
            <section className="w-full px-margin-mobile md:px-margin py-space-sm sticky top-20 z-40 bg-surface-base/90 backdrop-blur-xl">
              <div className="max-w-7xl mx-auto bg-surface-card p-space-md rounded-xl shadow-2xl flex flex-col gap-space-md border border-surface-container-high/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-space-md">
                  {/* Ruangan */}
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
                        <option value="smoking">Smoking Zone (PC 1–6 &amp; 7)</option>
                        <option value="non-smoking">VIP Non-Smoking AC (PC 8–12)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none text-[18px]">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Status */}
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
                  <div className="flex flex-col gap-space-xs lg:col-span-2">
                    <label className="font-label-sm text-label-sm uppercase text-on-surface-variant flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[14px]">loyalty</span> Paket Billing (13 Paket Resmi)
                    </label>
                    <div className="relative">
                      <select
                        value={String(selectedPackage.id)}
                        onChange={(e) => handleSelectPackage(e.target.value)}
                        className="w-full appearance-none bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-sm rounded-lg focus:outline-none focus:bg-surface-elevated transition-colors cursor-pointer border border-surface-container-high/30"
                      >
                        {packages.map((pkg) => (
                          <option key={String(pkg.id)} value={String(pkg.id)}>
                            {pkg.name} — Rp {pkg.price.toLocaleString("id-ID")}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none text-[18px]">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Tanggal */}
                  <div className="flex flex-col gap-space-xs">
                    <label className="font-label-sm text-label-sm uppercase text-on-surface-variant flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span> Tanggal Sesi
                    </label>
                    <div className="flex flex-col gap-1.5">
                      {/* Shortcut Pills */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedDate(getJakartaDate(0))}
                          className={`px-3 py-1 rounded-lg font-label-sm text-label-sm font-semibold transition-all ${
                            selectedDate === getJakartaDate(0)
                              ? "bg-primary-container text-on-primary-fixed shadow-sm"
                              : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                          }`}
                          type="button"
                        >
                          Hari Ini
                        </button>
                        <button
                          onClick={() => setSelectedDate(getJakartaDate(1))}
                          className={`px-3 py-1 rounded-lg font-label-sm text-label-sm font-semibold transition-all ${
                            selectedDate === getJakartaDate(1)
                              ? "bg-primary-container text-on-primary-fixed shadow-sm"
                              : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                          }`}
                          type="button"
                        >
                          Besok
                        </button>
                      </div>
                      {/* Custom Date Input */}
                      <input
                        type="date"
                        value={selectedDate}
                        min={getJakartaDate(0)}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-sm rounded-lg focus:outline-none focus:bg-surface-elevated transition-colors cursor-pointer border border-surface-container-high/30 [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  {/* Jam Mulai */}
                  <div className="flex flex-col gap-space-xs">
                    <label className="font-label-sm text-label-sm uppercase text-on-surface-variant flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[14px]">schedule</span> Jam Mulai
                    </label>
                    <div className="flex flex-col gap-1.5">
                      {/* Quick Preset Pills */}
                      <div className="flex flex-wrap gap-1">
                        {["06:00", "09:00", "14:00", "19:00", "21:00", "23:00"].map((t) => (
                          <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={`px-2.5 py-0.5 rounded-md font-label-sm text-label-sm font-semibold transition-all ${
                              selectedTime === t
                                ? "bg-primary-container text-on-primary-fixed shadow-sm"
                                : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                            }`}
                            type="button"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      {/* Custom Time Input */}
                      <input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-sm rounded-lg focus:outline-none focus:bg-surface-elevated transition-colors cursor-pointer border border-surface-container-high/30 [color-scheme:dark]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Main Content Area */}
            <section className="w-full px-margin-mobile md:px-margin py-space-lg">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
                {/* PC Stations (8 Cols) */}
                <div className="lg:col-span-8 flex flex-col gap-space-xl">
                  {/* Smoking Zone (PC 1 - PC 6 & PC 7) */}
                  {(roomFilter === "all" || roomFilter === "smoking") && (
                    <div className="flex flex-col gap-space-md">
                      <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high/40">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-3 h-3 rounded-sm bg-accent-emerald"></div>
                          <div>
                            <h2 className="font-headline-md text-headline-md text-primary font-bold">
                              Smoking &amp; Flexible Zone
                            </h2>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              PC 1–6 (Smoking FAN) &amp; PC 7 (Flexible FAN) • Monitor 240Hz s/d 390Hz
                            </p>
                          </div>
                        </div>
                        <span className="px-space-sm py-1 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">
                          Station 01–07
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
                                } ${station.status !== "available" ? "opacity-75" : ""}`}
                              >
                                {isSelected && (
                                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary-fixed px-space-md py-0.5 rounded-full font-label-sm text-label-sm uppercase font-bold flex items-center gap-1 shadow-lg">
                                    <span className="material-symbols-outlined text-[14px]">check_circle</span> Rig Terpilih
                                  </div>
                                )}

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="font-headline-sm text-headline-sm text-primary font-bold">{station.id}</span>
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
                                      {station.cooling}
                                    </span>
                                  </div>
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm uppercase font-semibold ${
                                      station.status === "available"
                                        ? "bg-status-available/10 text-status-available"
                                        : station.status === "in-use"
                                        ? "bg-status-in-use/10 text-status-in-use"
                                        : station.status === "offline"
                                        ? "bg-outline/20 text-on-surface-variant"
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
                                    {station.status === "available"
                                      ? "Tersedia"
                                      : station.status === "in-use"
                                      ? "Digunakan"
                                      : station.status === "offline"
                                      ? "Offline"
                                      : "Dipesan"}
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
                                    <span className="text-primary font-bold">{station.gpu}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>CPU:</span>
                                    <span className="text-on-surface">{station.cpu}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Monitor:</span>
                                    <span className="text-primary-container font-semibold">{station.display}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Rokok:</span>
                                    <span className={`font-semibold ${station.smoking === "YA" ? "text-orange-400" : "text-yellow-400"}`}>
                                      {station.smoking === "YA" ? "YA (Boleh)" : "FLEXIBLE"}
                                    </span>
                                  </div>
                                </div>

                                {station.status === "available" ? (
                                  <button
                                    onClick={() => setSelectedPC(station)}
                                    className={`w-full py-space-xs rounded-lg font-label-md text-label-md font-semibold transition-all flex items-center justify-center gap-1 ${
                                      isSelected
                                        ? "bg-primary-container text-on-primary-fixed shadow-[0_0_15px_rgba(0,255,102,0.3)] font-bold"
                                        : "bg-surface-container text-on-surface hover:bg-primary-container hover:text-on-primary-fixed"
                                    }`}
                                    type="button"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">
                                      {isSelected ? "check" : "touch_app"}
                                    </span>
                                    {isSelected ? "Rig Terpilih" : "Pilih PC Ini"}
                                  </button>
                                ) : (
                                  <div className="w-full py-space-xs rounded-lg bg-surface-container-low text-on-surface-variant text-center font-label-sm text-label-sm">
                                    {station.status === "in-use" ? "Sedang Berlangsung" : "Tidak Tersedia"}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* VIP Non-Smoking Zone (PC 8 - PC 12) */}
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
                              PC 8–12 • Full AC Dingin, RTX 4070 SUPER / 4060 Ti &amp; Monitor 300Hz–390Hz
                            </p>
                          </div>
                        </div>
                        <span className="px-space-sm py-1 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">
                          Station 08–12
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
                                } ${station.status !== "available" ? "opacity-75" : ""}`}
                              >
                                {isSelected && (
                                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary-fixed px-space-md py-0.5 rounded-full font-label-sm text-label-sm uppercase font-bold flex items-center gap-1 shadow-lg">
                                    <span className="material-symbols-outlined text-[14px]">check_circle</span> Rig Terpilih
                                  </div>
                                )}

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="font-headline-sm text-headline-sm text-primary font-bold">{station.id}</span>
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">
                                      AC
                                    </span>
                                  </div>
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm uppercase font-semibold ${
                                      station.status === "available"
                                        ? "bg-status-available/10 text-status-available"
                                        : station.status === "in-use"
                                        ? "bg-status-in-use/10 text-status-in-use"
                                        : station.status === "offline"
                                        ? "bg-outline/20 text-on-surface-variant"
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
                                    {station.status === "available"
                                      ? "Tersedia"
                                      : station.status === "in-use"
                                      ? "Digunakan"
                                      : station.status === "offline"
                                      ? "Offline"
                                      : "Dipesan"}
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
                                    <span className="text-primary font-bold">{station.gpu}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>CPU:</span>
                                    <span className="text-on-surface">{station.cpu}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Monitor:</span>
                                    <span className="text-primary-container font-semibold">{station.display}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Rokok:</span>
                                    <span className="font-semibold text-status-available">
                                      NO (Dilarang)
                                    </span>
                                  </div>
                                </div>

                                {station.status === "available" ? (
                                  <button
                                    onClick={() => setSelectedPC(station)}
                                    className={`w-full py-space-xs rounded-lg font-label-md text-label-md font-semibold transition-all flex items-center justify-center gap-1 ${
                                      isSelected
                                        ? "bg-primary-container text-on-primary-fixed shadow-[0_0_15px_rgba(0,255,102,0.3)] font-bold"
                                        : "bg-surface-container text-on-surface hover:bg-primary-container hover:text-on-primary-fixed"
                                    }`}
                                    type="button"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">
                                      {isSelected ? "check" : "touch_app"}
                                    </span>
                                    {isSelected ? "Rig Terpilih" : "Pilih PC Ini"}
                                  </button>
                                ) : (
                                  <div className="w-full py-space-xs rounded-lg bg-surface-container-low text-on-surface-variant text-center font-label-sm text-label-sm">
                                    {station.status === "in-use" ? "Sedang Berlangsung" : "Tidak Tersedia"}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sticky Summary Panel (4 Cols) */}
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

                    {/* Selected PC Card */}
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
                        {selectedPC.room} ({selectedPC.cooling})
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {selectedPC.gpu} • {selectedPC.cpu} • {selectedPC.display}
                      </p>
                    </div>

                    {/* Breakdown */}
                    <div className="flex flex-col gap-space-xs font-body-sm text-body-sm">
                      <div className="flex items-center justify-between py-1 text-on-surface-variant">
                        <span>Tanggal Sesi:</span>
                        <span className="text-on-surface font-medium">{formatDisplayDate(selectedDate)}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 text-on-surface-variant">
                        <span>Jam Reservasi:</span>
                        <span className="text-on-surface font-medium">{selectedTime} WIB</span>
                      </div>
                      <div className="flex items-center justify-between py-1 text-on-surface-variant">
                        <span>Paket Terpilih:</span>
                        <span className="text-primary font-semibold">{selectedPackage.name}</span>
                      </div>
                      {selectedPackage.bonus && selectedPackage.bonus !== "-" && (
                        <div className="flex items-center justify-between py-1 text-on-surface-variant">
                          <span>Ekstra Bonus:</span>
                          <span className="text-primary-container font-bold">{selectedPackage.bonus}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between py-1 text-on-surface-variant">
                        <span>Fasilitas:</span>
                        <span className="text-status-available font-medium">Bebas Download &amp; 1 Gbps</span>
                      </div>
                    </div>

                    <div className="w-full h-px bg-surface-container-highest my-1"></div>

                    {/* Cost Calculation */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-body-md text-body-md text-on-surface-variant">Total Biaya:</span>
                        <span className="font-headline-lg text-headline-lg text-primary font-bold">
                          Rp {selectedPackage.price.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant/70 text-right">
                        *Tarif resmi sesuai poster HOG
                      </span>
                    </div>

                    {/* Checkbox Policy */}
                    <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={agreeRules}
                        onChange={(e) => setAgreeRules(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded bg-surface-container border-surface-container-highest text-primary-container focus:ring-0 cursor-pointer"
                      />
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Saya memahami ketentuan toleransi keterlambatan 45 menit &amp; minimal booking 3 jam.
                      </span>
                    </label>

                    {/* Trigger Modal Button */}
                    <button
                      onClick={() => {
                        if (!agreeRules) {
                          alert("Silakan setujui ketentuan bermain terlebih dahulu.");
                          return;
                        }
                        setIsModalOpen(true);
                      }}
                      className="w-full py-3.5 rounded-xl bg-primary-container text-on-primary-fixed font-label-lg text-label-lg font-bold shadow-[0_0_25px_rgba(0,255,102,0.35)] hover:shadow-[0_0_35px_rgba(0,255,102,0.55)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      type="button"
                    >
                      <span>Lanjut ke Konfirmasi</span>
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-surface-base/80 backdrop-blur-md flex items-center justify-center p-margin-mobile md:p-margin animate-in fade-in duration-200">
              <div className="relative w-full max-w-2xl bg-surface-card rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-surface-container-high/60">
                {/* Header */}
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
                        Data booking akan dicatat langsung di database cloud HOG.
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

                {/* Body */}
                <div className="p-space-lg overflow-y-auto flex flex-col gap-space-lg">
                  {/* Summary Banner */}
                  <div className="bg-surface-container-lowest p-space-md rounded-xl flex items-center justify-between border border-surface-container-high/40">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary-container font-bold text-lg">
                        {selectedPC.id}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-primary font-semibold">
                          {selectedPC.room} ({selectedPC.cooling})
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {formatDisplayDate(selectedDate)} • {selectedTime} WIB • {selectedPackage.name}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-headline-md text-headline-md text-primary font-bold">
                        Rp {selectedPackage.price.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {/* Customer Information */}
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
                          placeholder="Contoh: Rizki HOG"
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
                          placeholder="Contoh: 087878672111"
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
                        { id: "qris", name: "QRIS Instant (GoPay/OVO/Dana/BCA)", icon: "qr_code_2" },
                        { id: "bca", name: "BCA Virtual Account", icon: "account_balance" },
                        { id: "mandiri", name: "Mandiri Virtual Account", icon: "account_balance" },
                        { id: "cash", name: "Bayar Tunai di Kasir HOG", icon: "payments" },
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

                {/* Footer */}
                <div className="p-space-lg bg-surface-container flex items-center justify-between shrink-0 border-t border-surface-container-high/50">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    type="button"
                    disabled={isSubmitting}
                    className="px-space-lg py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest font-label-md text-label-md text-on-surface transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmReservation}
                    disabled={isSubmitting}
                    type="button"
                    className="px-space-xl py-2.5 rounded-lg bg-primary-container text-on-primary-fixed font-label-md text-label-md font-bold hover:shadow-[0_0_20px_rgba(0,255,102,0.4)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-on-primary-fixed border-t-transparent rounded-full animate-spin"></span>
                        <span>Menyimpan ke Database...</span>
                      </>
                    ) : (
                      <>
                        <span>Konfirmasi &amp; Amankan PC</span>
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      </>
                    )}
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

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-base text-on-surface flex items-center justify-center">Memuat Sistem Booking HOG...</div>}>
      <BookingPageContent />
    </Suspense>
  );
}

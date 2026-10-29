"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

function BookingStatusContent() {
  const searchParams = useSearchParams();
  const codeParam = searchParams.get("code") || "HOG-DEMO-PC08";
  const pcParam = searchParams.get("pc") || "PC-08";
  const roomParam = searchParams.get("room") || "VIP Non-Smoking Zone";
  const nameParam = searchParams.get("name") || "Gamer";
  const timeParam = searchParams.get("time") || "19:00";
  const dateParam = searchParams.get("date") || new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());
  const pkgParam = searchParams.get("pkg") || "3 Jam Regular (+ Bonus 30m)";
  const priceParam = searchParams.get("price") || "30142";
  const uniqueCodeParam = searchParams.get("uniqueCode") || "";

  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationMessage, setSimulationMessage] = useState("");
  const [showMacroGuide, setShowMacroGuide] = useState(false);

  // Compute target session datetime in WIB (UTC+07:00)
  const getSessionTargetMs = (): number => {
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());
    const cleanDate = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : today;
    const match = (timeParam || "").match(/(\d{1,2}):(\d{2})/);
    const h = match ? match[1].padStart(2, "0") : "19";
    const m = match ? match[2].padStart(2, "0") : "00";
    return new Date(`${cleanDate}T${h}:${m}:00+07:00`).getTime();
  };

  const computeTimeLeft = () => {
    const targetMs = getSessionTargetMs();
    const diff = targetMs - Date.now();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, started: true };
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      started: false,
    };
  };

  // Countdown State — initialized from real Jakarta time
  const [timeLeft, setTimeLeft] = useState(computeTimeLeft);

  // 1. Initial Fetch from Supabase
  const loadBooking = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("booking_code", codeParam)
        .maybeSingle();

      if (error) {
        console.error("Error loading booking:", error.message);
      } else if (data) {
        setBookingDetails(data);
      }
    } catch (err) {
      console.error("Error loading booking:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();

    // 2. Realtime WebSocket subscription to Supabase bookings
    const channel = supabase
      .channel(`live-${codeParam}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bookings",
          filter: `booking_code=eq.${codeParam}`,
        },
        (payload: any) => {
          console.log("[Realtime Booking Update]:", payload.new);
          if (payload.new) {
            setBookingDetails(payload.new);
          }
        }
      )
      .subscribe();

    // 3. Fallback Polling every 3 seconds for guaranteed sync
    const pollInterval = setInterval(() => {
      loadBooking();
    }, 3000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [codeParam]);

  // Realtime countdown — recalculated every second from Jakarta clock (UTC+07:00)
  useEffect(() => {
    const tick = () => setTimeLeft(computeTimeLeft());
    tick(); // run immediately
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [dateParam, timeParam]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeParam);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyAmount = () => {
    const rawNumber = String(bookingDetails?.total_price || priceParam).replace(/\D/g, "");
    navigator.clipboard.writeText(rawNumber);
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2500);
  };

  // Test simulation trigger
  const handleSimulatePayment = async () => {
    setIsSimulating(true);
    setSimulationMessage("Mengirim sinyal simulasi notifikasi ke webhook...");

    try {
      const targetAmount = bookingDetails?.total_price || Number(priceParam);

      const res = await fetch("/api/qris-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: targetAmount,
          code: codeParam,
          message: `Kamu menerima pembayaran QRIS sebesar Rp ${targetAmount.toLocaleString("id-ID")} dari BCA / GoPay Merchant`,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSimulationMessage("✓ Berhasil! Sinyal diterima. Status ter-update otomatis!");
        await loadBooking();
      } else {
        setSimulationMessage(`Gagal: ${json.message || json.error}`);
      }
    } catch (err: any) {
      setSimulationMessage("Error menembak webhook: " + err.message);
    } finally {
      setIsSimulating(false);
    }
  };

  const currentStatus = bookingDetails?.status || "pending_payment";
  const isConfirmed = currentStatus === "confirmed" || currentStatus === "checked_in";

  const totalTransfer = Number(bookingDetails?.total_price || priceParam);

  const pcSpecsMap: Record<string, string> = {
    "PC-01": "RTX 4060 Ti • i7 Gen 14 • 360 (OC 390) Hz • FAN (Smoking)",
    "PC-02": "RTX 4060 Ti • i5 Gen 12 • 300 Hz • FAN (Smoking)",
    "PC-03": "RX 6600 • i5 Gen 12 • 240 (OC 270) Hz • FAN (Smoking)",
    "PC-04": "RTX 3070 • i5 Gen 12 • 240 (OC 270) Hz • FAN (Smoking)",
    "PC-05": "RTX 4060 Ti • i5 Gen 12 • 360 (OC 390) Hz • FAN (Smoking)",
    "PC-06": "RTX 4060 Ti • i5 Gen 12 • 360 (OC 390) Hz • FAN (Smoking)",
    "PC-07": "RTX 4060 Ti • i5 Gen 12 • 240 (OC 270) Hz • FAN (Flexible)",
    "PC-08": "RTX 4060 Ti • i5 Gen 12 • 360 (OC 390) Hz • AC (VIP Non-Smoking)",
    "PC-09": "RTX 4060 Ti • i5 Gen 13 • 240 (OC 270) Hz • AC (VIP Non-Smoking)",
    "PC-10": "RTX 4070 SU • i7 Gen 14 • 300 Hz • AC (VIP Non-Smoking)",
    "PC-11": "RTX 4070 SU • i7 Gen 14 • 300 Hz • AC (VIP Non-Smoking)",
    "PC-12": "RTX 4070 SU • i7 Gen 14 • 300 Hz • AC (VIP Non-Smoking)",
  };

  const currentSpecs = pcSpecsMap[pcParam] || "High-End Tournament Rig • Rapid Trigger";

  return (
    <div className="w-full relative overflow-hidden px-margin py-space-xl">
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -left-24 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col gap-space-xl relative z-10">
        {/* Breadcrumb Strip */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm bg-surface-container-high/60 backdrop-blur-md px-space-lg py-space-sm rounded-xl border border-surface-container-high/40">
          <div className="flex items-center gap-space-sm text-on-surface-variant font-label-md text-label-md">
            <span className="inline-flex items-center gap-1.5 text-primary-container font-semibold">
              <span className="w-2 h-2 rounded-full bg-status-available animate-ping"></span>
              Gateway Pembayaran
            </span>
            <span>/</span>
            <span className="text-on-surface">Reservasi Tiket Gaming HOG</span>
          </div>
          <div className="inline-flex items-center gap-space-xs font-label-sm text-label-sm text-primary-container bg-surface-container-highest px-space-md py-1 rounded-full font-semibold border border-primary-container/20">
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>Auto-Confirmation QRIS Realtime</span>
          </div>
        </div>

        {/* Status Top Banner */}
        <div className="relative bg-surface-card rounded-2xl p-space-lg md:p-space-xl overflow-hidden shadow-2xl border border-surface-container-high/50">
          <div
            className={`absolute top-0 left-0 right-0 h-1.5 ${
              isConfirmed
                ? "bg-gradient-to-r from-status-available via-primary-container to-secondary"
                : "bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-300 animate-pulse"
            }`}
          ></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
            <div className="flex flex-col gap-space-sm">
              <div className="inline-flex items-center gap-space-sm">
                <span className="relative flex h-3.5 w-3.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isConfirmed ? "bg-status-available" : "bg-yellow-400"
                    }`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                      isConfirmed ? "bg-status-available" : "bg-yellow-400"
                    }`}
                  ></span>
                </span>
                <span
                  className={`font-label-sm text-label-sm tracking-wider uppercase px-space-sm py-1 rounded-full font-bold ${
                    isConfirmed
                      ? "bg-status-available/10 text-status-available border border-status-available/30"
                      : "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30"
                  }`}
                >
                  {isConfirmed
                    ? "✓ Pembayaran Terkonfirmasi Otomatis (LUNAS)"
                    : "⏳ Menunggu Pembayaran QRIS (Mendeteksi Notifikasi)"}
                </span>
              </div>

              <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
                {isConfirmed ? "Tiket Gaming Resmi Diaktifkan!" : "Selesaikan Pembayaran QRIS"}
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                {isConfirmed ? (
                  <>
                    Selamat <strong className="text-primary">{nameParam}</strong>, sistem otomatis memverifikasi pembayaran Anda! Unit workstation <strong className="text-primary">{pcParam}</strong> telah siap dipakai.
                  </>
                ) : (
                  <>
                    Halo <strong className="text-primary">{nameParam}</strong>, silakan transfer dengan nominal tepat hingga 3 digit terakhir. Begitu uang masuk, halaman ini <strong className="text-primary-container">otomatis terverifikasi dalam hitungan detik</strong> tanpa perlu konfirmasi kasir.
                  </>
                )}
              </p>
            </div>

            {/* Code Reference Pill */}
            <div className="flex flex-col items-start lg:items-end gap-space-xs bg-surface-container-lowest/90 p-space-lg rounded-xl border border-surface-container-high/50 shadow-inner">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant font-semibold">
                Kode Referensi Reservasi
              </span>
              <div className="flex items-center gap-space-sm mt-1">
                <span className="font-display-lg text-headline-lg tracking-wider text-primary font-mono select-all font-bold">
                  {codeParam}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center justify-center p-2.5 bg-surface-container-high hover:bg-surface-container-highest text-primary-container rounded-lg transition-all cursor-pointer"
                  title="Salin Kode"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {copiedCode ? "check" : "content_copy"}
                  </span>
                </button>
              </div>
              <span className={`font-label-sm text-label-sm text-status-available transition-opacity duration-300 ${copiedCode ? "opacity-100" : "opacity-0"}`}>
                Kode berhasil disalin!
              </span>
            </div>
          </div>
        </div>

        {/* CONDITIONAL LAYOUT: PENDING QRIS vs CONFIRMED SUCCESS */}
        {!isConfirmed ? (
          /* SECTION: REALTIME QRIS PAYMENT CARD */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            {/* Left: QRIS Code & Instructions */}
            <div className="lg:col-span-7 bg-surface-card rounded-2xl p-space-lg md:p-space-xl flex flex-col gap-space-lg border border-primary-container/40 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                      Scan QRIS Kasir / GoPay / BCA
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Dukung semua e-Wallet &amp; Mobile Banking (BCA, Mandiri, GoPay, Dana, OVO)
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm font-bold border border-surface-container-high/50">
                  QRIS MPM
                </span>
              </div>

              {/* Exact Nominal Transfer Box (HIGHLIGHT) */}
              <div className="p-space-lg rounded-2xl bg-surface-container-lowest border-2 border-primary-container/70 flex flex-col gap-2 relative shadow-[0_0_30px_rgba(0,255,102,0.15)]">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                    Nominal Yang Harus Ditransfer
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-primary-container text-on-primary-fixed uppercase tracking-wider">
                    Termasuk Kode Unik
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display-lg text-display-lg text-primary font-mono font-bold tracking-tight">
                      Rp {totalTransfer.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyAmount}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary-fixed font-label-md text-label-md font-bold shadow-md hover:shadow-[0_0_20px_rgba(0,255,102,0.4)] transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {copiedAmount ? "check" : "content_copy"}
                    </span>
                    <span>{copiedAmount ? "Nominal Tersalin!" : "Salin Nominal"}</span>
                  </button>
                </div>

                <div className="mt-2 p-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-2 text-yellow-300 font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">warning</span>
                  <span>
                    <strong>PENTING:</strong> Pastikan nominal transfer sama persis hingga 3 digit terakhir agar sistem webhook mendeteksi pembayaran secara otomatis.
                  </span>
                </div>
              </div>

              {/* Visual QR Code Display */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-space-lg py-space-sm bg-surface-container-lowest/50 p-space-md rounded-xl border border-surface-container-high/30">
                <div className="p-3 bg-white rounded-xl shadow-md border border-neutral-200 shrink-0">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=4&data=00020101021126600016ID.CO.GOPAY.WWW01189360091800000000000215000000000000000520458125303360540${totalTransfer}5802ID5914HOME%20OF%20GAMERS6007JAKARTA61051153062070703A016304`}
                    alt="QRIS Pembayaran Resmi Home Of Gamers"
                    className="w-44 h-44 object-contain"
                  />
                  <div className="text-center text-[10px] text-neutral-800 font-bold tracking-wider mt-1 uppercase">
                    Scan via GoPay / BCA / m-Banking
                  </div>
                </div>

                <div className="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant max-w-xs">
                  <span className="font-label-md text-label-md text-primary font-bold">Cara Pembayaran:</span>
                  <ol className="list-decimal list-inside flex flex-col gap-1 text-[13px]">
                    <li>Buka aplikasi BCA / GoPay / Dana / Livin.</li>
                    <li>Pilih menu <strong>Scan QRIS</strong> (scan barcode ini atau QRIS kasir).</li>
                    <li>Masukkan nominal tepat <strong>Rp {totalTransfer.toLocaleString("id-ID")}</strong>.</li>
                    <li>Selesaikan pembayaran. Halaman ini akan berubah otomatis dalam 3-5 detik!</li>
                  </ol>
                </div>
              </div>

              {/* Real-time Listening Wave */}
              <div className="p-space-md rounded-xl bg-surface-container flex items-center justify-between border border-surface-container-high/50">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-container"></span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold animate-pulse">
                    Mendengarkan notifikasi masuk secara real-time...
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                  Port: Webhook / Supabase Sync
                </span>
              </div>
            </div>

            {/* Right: Demo Simulation & Live Test Panel */}
            <div className="lg:col-span-5 flex flex-col gap-space-md">
              {/* Simulation Sandbox Box */}
              <div className="bg-surface-card rounded-2xl p-space-lg shadow-xl border border-secondary/40 flex flex-col gap-space-md">
                <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high/40">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[22px]">science</span>
                    <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                      Uji Coba Demo (Tanpa Transfer)
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-secondary/20 text-secondary uppercase">
                    Testing Mode
                  </span>
                </div>

                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Untuk menguji coba alur otomatisasi tanpa perlu transfer uang asli, lo bisa klik tombol simulasi di bawah:
                </p>

                <button
                  onClick={handleSimulatePayment}
                  disabled={isSimulating}
                  type="button"
                  className="w-full py-3.5 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-bold shadow-lg hover:shadow-[0_0_20px_rgba(0,255,200,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSimulating ? (
                    <>
                      <span className="w-4 h-4 border-2 border-on-secondary border-t-transparent rounded-full animate-spin"></span>
                      <span>Menembak Webhook...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">bolt</span>
                      <span>⚡ Simulasikan Notif Masuk (Rp {totalTransfer.toLocaleString("id-ID")})</span>
                    </>
                  )}
                </button>

                {simulationMessage && (
                  <div className="p-3 rounded-lg bg-surface-container-lowest border border-surface-container-high text-primary font-mono text-xs break-all">
                    {simulationMessage}
                  </div>
                )}

                {/* MacroDroid Guide Toggle */}
                <div className="pt-2 border-t border-surface-container-high/40">
                  <button
                    onClick={() => setShowMacroGuide(!showMacroGuide)}
                    className="w-full text-left font-label-sm text-label-sm text-primary-container hover:underline flex items-center justify-between"
                    type="button"
                  >
                    <span>📱 Cara Sambungkan ke HP Kasir Beneran (MacroDroid)</span>
                    <span className="material-symbols-outlined text-[18px]">
                      {showMacroGuide ? "expand_less" : "expand_more"}
                    </span>
                  </button>

                  {showMacroGuide && (
                    <div className="mt-3 p-3 rounded-xl bg-surface-container-lowest text-on-surface-variant font-body-sm text-body-sm flex flex-col gap-2 border border-surface-container-high/50">
                      <p>
                        <strong>Alamat Webhook di Jaringan Wi-Fi Warnet:</strong>
                      </p>
                      <code className="p-2 rounded bg-surface-container font-mono text-primary text-xs select-all block">
                        http://192.168.0.181:3000/api/qris-webhook
                      </code>
                      <ol className="list-decimal list-inside text-xs flex flex-col gap-1 mt-1">
                        <li>Install <strong>MacroDroid</strong> di HP Kasir Android.</li>
                        <li>Pemicu (Trigger): Notifikasi masuk dari app <strong>BCA Merchant / GoPay</strong>.</li>
                        <li>Tindakan (Action): HTTP Request POST ke URL di atas dengan body teks notifikasi.</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>

              {/* Station Summary Preview */}
              <div className="bg-surface-card rounded-2xl p-space-md border border-surface-container-high/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">PC Yang Dipesan</span>
                  <span className="font-bold text-primary font-mono">{pcParam}</span>
                </div>
                <div className="text-primary font-headline-sm text-headline-sm font-bold">{roomParam}</div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{currentSpecs}</p>
                <div className="flex items-center justify-between pt-2 border-t border-surface-container-high/30 font-body-sm text-body-sm">
                  <span className="text-on-surface-variant">Jadwal Sesi:</span>
                  <span className="text-primary font-medium">{timeParam}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* SECTION: CONFIRMED SUCCESS DETAILS (SETELAH PEMBAYARAN MASUK) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Countdown Clock Bento */}
            <div className="lg:col-span-5 bg-surface-card rounded-2xl p-space-lg flex flex-col justify-between relative overflow-hidden shadow-xl border border-primary-container/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-status-available text-[22px]">timer</span>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    {(timeLeft as any).started ? "Sesi Berlangsung" : "Waktu Menuju Sesi"}
                  </span>
                </div>
                <span className={`font-label-sm text-label-sm px-2.5 py-0.5 rounded-full uppercase font-bold border ${
                  (timeLeft as any).started
                    ? "text-primary-container bg-primary-container/10 border-primary-container/30 animate-pulse"
                    : "text-status-available bg-status-available/10 border-status-available/30"
                }`}>
                  {(timeLeft as any).started ? "Live" : "Aktif"}
                </span>
              </div>

              {/* Digital Clock */}
              {(timeLeft as any).started ? (
                <div className="my-space-lg flex flex-col items-center justify-center gap-2 py-4">
                  <span className="material-symbols-outlined text-primary-container text-[48px] animate-pulse">sports_esports</span>
                  <p className="font-headline-sm text-headline-sm text-primary font-bold text-center">Sesi Gaming Sedang Berlangsung!</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-center">Selamat bermain, {nameParam}! 🎮</p>
                </div>
              ) : (
                <div className="my-space-lg flex items-center justify-center gap-space-sm">
                  <div className="flex flex-col items-center bg-surface-container-lowest px-4 py-3 rounded-lg min-w-[76px] border border-surface-container-high/40">
                    <span className="font-display-lg text-display-lg text-primary tracking-tight font-mono font-bold">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-1">Jam</span>
                  </div>
                  <span className="font-display-lg text-display-lg text-primary-container font-mono -mt-5 animate-pulse font-bold">:</span>
                  <div className="flex flex-col items-center bg-surface-container-lowest px-4 py-3 rounded-lg min-w-[76px] border border-surface-container-high/40">
                    <span className="font-display-lg text-display-lg text-primary tracking-tight font-mono font-bold">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-1">Menit</span>
                  </div>
                  <span className="font-display-lg text-display-lg text-primary-container font-mono -mt-5 animate-pulse font-bold">:</span>
                  <div className="flex flex-col items-center bg-surface-container-lowest px-4 py-3 rounded-lg min-w-[76px] border border-surface-container-high/40">
                    <span className="font-display-lg text-display-lg text-primary-container tracking-tight font-mono font-bold">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-1">Detik</span>
                  </div>
                </div>
              )}

              <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between text-on-surface-variant font-label-md text-label-md">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-status-available">schedule</span>
                  Jadwal Mulai
                </span>
                <span className="text-primary font-semibold">{timeParam} WIB · {dateParam}</span>
              </div>
            </div>

            {/* Details Bento */}
            <div className="lg:col-span-7 bg-surface-card rounded-2xl p-space-lg flex flex-col justify-between shadow-xl border border-surface-container-high/40">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high/30">
                <span className="font-headline-sm text-headline-sm text-primary font-bold">Rincian Stasiun &amp; Pembayaran</span>
                <span className="font-label-sm text-label-sm px-2.5 py-1 rounded bg-primary-container/20 text-primary-container font-bold">
                  {pcParam}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md py-space-md">
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase text-[12px]">Ruangan</span>
                  <span className="font-headline-sm text-headline-sm text-primary font-semibold">{roomParam}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase text-[12px]">Hardware Rig</span>
                  <span className="font-headline-sm text-headline-sm text-primary font-semibold">{currentSpecs}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase text-[12px]">Paket Terpilih</span>
                  <span className="font-headline-sm text-headline-sm text-primary font-semibold">{pkgParam}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase text-[12px]">Status Pembayaran</span>
                  <span className="font-headline-sm text-headline-sm text-status-available font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">verified</span> LUNAS (Auto-Verified)
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-space-md pt-space-xs border-t border-surface-container-high/30">
                <a
                  href="https://wa.me/6287878672111"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-lg bg-surface-container hover:bg-surface-elevated text-on-surface font-label-md text-label-md transition-colors font-semibold"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  WhatsApp Kasir
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-lg bg-primary-container text-on-primary-fixed font-label-md text-label-md font-bold hover:shadow-[0_0_20px_rgba(0,255,102,0.4)] transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">home</span>
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingStatus() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-base text-on-surface">
      <Navbar />
      <main className="w-full pt-20 bg-surface-base">
        <Suspense fallback={<div className="p-12 text-center text-primary">Memuat status reservasi...</div>}>
          <BookingStatusContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

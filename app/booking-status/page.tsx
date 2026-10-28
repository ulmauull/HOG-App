"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function BookingStatusContent() {
  const searchParams = useSearchParams();
  const codeParam = searchParams.get("code") || "HOG-20250524-PC08";
  const pcParam = searchParams.get("pc") || "PC-08";
  const roomParam = searchParams.get("room") || "VIP Non-Smoking Zone";
  const nameParam = searchParams.get("name") || "Gamer";
  const timeParam = searchParams.get("time") || "19:00 WIB";

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({
    hours: 1,
    minutes: 24,
    seconds: 15,
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeParam);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="w-full relative overflow-hidden px-margin py-space-xl">
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -left-24 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col gap-space-xl relative z-10">
        {/* Top Demo Banner & Breadcrumb Strip */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm bg-surface-container-high/60 backdrop-blur-md px-space-lg py-space-sm rounded-xl border border-surface-container-high/40">
          <div className="flex items-center gap-space-sm text-on-surface-variant font-label-md text-label-md">
            <span className="inline-flex items-center gap-1.5 text-primary-container font-semibold">
              <span className="w-2 h-2 rounded-full bg-status-available animate-ping"></span>
              Booking Gateway
            </span>
            <span>/</span>
            <span className="text-on-surface">Konfirmasi Reservasi Resmi</span>
          </div>
          <div className="inline-flex items-center gap-space-xs font-label-sm text-label-sm text-secondary bg-surface-container-highest px-space-md py-1 rounded-full font-semibold">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            <span>Status: Terverifikasi di Database Server HOG</span>
          </div>
        </div>

        {/* Main Status Banner */}
        <div className="relative bg-surface-card rounded-xl p-space-lg md:p-space-xl overflow-hidden shadow-2xl border border-surface-container-high/50">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-container via-secondary to-primary-fixed-dim"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
            <div className="flex flex-col gap-space-sm">
              <div className="inline-flex items-center gap-space-sm">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-available opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-status-available"></span>
                </span>
                <span className="font-label-sm text-label-sm text-status-available tracking-wider uppercase bg-status-available/10 px-space-sm py-1 rounded-full font-bold">
                  Booking Terkonfirmasi (Menunggu Check-in di Kasir)
                </span>
              </div>
              <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
                Reservasi Sukses Diaktifkan
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                Halo <strong className="text-primary">{nameParam}</strong>, unit gaming workstation Anda telah diamankan dalam sistem server HOG. Silakan tunjukkan kode booking ini kepada Game Master di reception desk saat tiba.
              </p>
            </div>

            {/* Code Pill */}
            <div className="flex flex-col items-start lg:items-end gap-space-xs bg-surface-container-lowest/80 p-space-lg rounded-xl border border-surface-container-high/50">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant font-semibold">
                Kode Referensi Booking
              </span>
              <div className="flex items-center gap-space-sm mt-1">
                <span className="font-display-lg text-headline-lg tracking-wider text-primary font-mono select-all font-bold">
                  {codeParam}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center p-2.5 bg-surface-container-high hover:bg-surface-container-highest text-primary-container rounded-lg transition-all cursor-pointer"
                  title="Salin Kode"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {copied ? "check" : "content_copy"}
                  </span>
                </button>
              </div>
              <span className={`font-label-sm text-label-sm text-status-available transition-opacity duration-300 ${copied ? "opacity-100" : "opacity-0"}`}>
                Kode berhasil disalin ke clipboard!
              </span>
            </div>
          </div>

          {/* Security Banner */}
          <div className="mt-space-lg flex items-center gap-space-md p-space-md rounded-lg bg-surface-container-low text-on-surface border border-surface-container-high/40">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-[22px]">verified_user</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-xs w-full">
              <p className="font-body-md text-body-md text-on-surface">
                <strong className="text-primary-container font-semibold">Security Token Active:</strong> PC Anda terkunci khusus untuk nama Anda dan software game sedang dipanaskan (warm-up prefetch).
              </p>
              <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap bg-surface-container-highest px-space-sm py-1 rounded">
                Toleransi Hadir: 15 Menit
              </span>
            </div>
          </div>
        </div>

        {/* Live Countdown & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Countdown Clock Bento */}
          <div className="lg:col-span-5 bg-surface-card rounded-xl p-space-lg flex flex-col justify-between relative overflow-hidden shadow-xl border border-surface-container-high/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">timer</span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">Waktu Menuju Sesi</span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full uppercase font-semibold">
                Live Sync
              </span>
            </div>

            {/* Digital Clock Display */}
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

            <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between text-on-surface-variant font-label-md text-label-md">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-status-available">sync</span>
                Jadwal Mulai
              </span>
              <span className="text-primary font-semibold">{timeParam}</span>
            </div>
          </div>

          {/* Details Bento */}
          <div className="lg:col-span-7 bg-surface-card rounded-xl p-space-lg flex flex-col justify-between shadow-xl border border-surface-container-high/40">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high/30">
              <span className="font-headline-sm text-headline-sm text-primary font-bold">Rincian Stasiun &amp; Ruangan</span>
              <span className="font-label-sm text-label-sm px-2.5 py-1 rounded bg-primary-container/20 text-primary-container font-bold">
                {pcParam}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md py-space-md">
              <div className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Ruangan</span>
                <span className="font-headline-sm text-headline-sm text-primary font-semibold">{roomParam}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Hardware Rig</span>
                <span className="font-headline-sm text-headline-sm text-primary font-semibold">RTX 4080 / 4090 • 280-360Hz</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Perks Gratis</span>
                <span className="font-headline-sm text-headline-sm text-status-available font-semibold">1x Free Cold Mineral Water</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Status Tagihan</span>
                <span className="font-headline-sm text-headline-sm text-status-available font-semibold">LUNAS / VERIFIED</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-lg bg-surface-container hover:bg-surface-elevated text-on-surface font-label-md text-label-md transition-colors font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Booking PC Lain
              </Link>
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
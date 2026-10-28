"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BookingDetails() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/booking-status");
  }, [router]);

  return (
    <div className="min-h-screen bg-surface-base text-on-surface flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <span className="material-symbols-outlined text-primary-container text-4xl animate-spin">
          progress_activity
        </span>
        <p className="font-headline-sm text-primary">Mengalihkan ke Status Reservasi...</p>
      </div>
    </div>
  );
}
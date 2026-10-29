import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use Supabase Service Role Key if available, or Anon Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hslleuuyfmaqpajjmwie.supabase.co";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzbGxldXV5Zm1hcXBhamptd2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMTU1NTcsImV4cCI6MjEwODc5MTU1N30.ykz1okldVO7ooViqTAdp9ZJY0WtrbyKc0E0I50S6Yd4";

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Extracts nominal amount from various text notifications.
 * Examples:
 * - "Pembayaran Rp 30.142 dari Rizki berhasil" -> 30142
 * - "Kamu menerima Rp 1.250 dari GoPay" -> 1250
 * - "Rp30.142,00" -> 30142
 * - 30142 -> 30142
 */
function extractAmount(input: any): number | null {
  if (typeof input === "number") return input;
  if (!input || typeof input !== "string") return null;

  // 1. Check if already clean digits
  const cleanNumber = input.trim().replace(/,/g, ".");
  if (!isNaN(Number(cleanNumber)) && Number(cleanNumber) > 0) {
    return Math.round(Number(cleanNumber));
  }

  // 2. Regex for Indonesian currency formatting: Rp 30.142 or Rp30142 or Rp. 1.500
  const match = input.match(/(?:rp\.?|idr)\s*([\d.,]+)/i);
  if (match && match[1]) {
    // Remove dots as thousands separator, replace comma with decimal or remove decimals
    const numStr = match[1].split(",")[0].replace(/\./g, "");
    const parsed = parseInt(numStr, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }

  // 3. Fallback: find any sequence of numbers formatted like 30.142 or 30142
  const fallbackMatch = input.match(/\b\d{1,3}(?:\.\d{3})+\b|\b\d{4,7}\b/);
  if (fallbackMatch) {
    const parsed = parseInt(fallbackMatch[0].replace(/\./g, ""), 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    let rawBody: any = null;
    let textContent = "";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      rawBody = await req.json().catch(() => ({}));
      textContent = rawBody?.message || rawBody?.text || rawBody?.body || rawBody?.notif_message || JSON.stringify(rawBody);
    } else {
      textContent = await req.text().catch(() => "");
    }

    // Amount can come directly as 'amount' in JSON, or parsed from notification text
    let targetAmount = rawBody?.amount ? Number(rawBody.amount) : null;
    if (!targetAmount) {
      targetAmount = extractAmount(textContent);
    }

    const explicitBookingCode = rawBody?.booking_code || rawBody?.code || req.nextUrl.searchParams.get("code");

    console.log(`[QRIS Webhook] Incoming notification: "${textContent}", Parsed amount: ${targetAmount}`);

    let matchedBookings: any[] | null = null;

    if (!targetAmount && !explicitBookingCode) {
      // KHUSUS TESTING / DEMO (Misal: klik "Tes pemicu" manual di MacroDroid BlueStacks yang mengirim body kosong)
      // Otomatis ambil booking pending terakhir yang sedang dibuka di web!
      console.log("[QRIS Webhook] Body kosong terdeteksi (Mode Tes Pemicu). Mencari booking pending terakhir...");
      const { data: latestPending, error: latestErr } = await supabase
        .from("bookings")
        .select("*")
        .eq("status", "pending_payment")
        .order("id", { ascending: false })
        .limit(1);

      if (latestPending && latestPending.length > 0) {
        matchedBookings = latestPending;
        console.log(`[QRIS Webhook] Auto-fallback berhasil: Menemukan booking pending ${matchedBookings[0].booking_code} (Rp ${matchedBookings[0].total_price})`);
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "Gagal menemukan nominal dari notifikasi dan tidak ada booking pending yang sedang aktif di sistem.",
            received_text: textContent,
            hint: "Buat booking terlebih dahulu di website sampai muncul halaman QRIS.",
          },
          { status: 400 }
        );
      }
    } else {
      // 1. Query booking in Supabase by amount or booking code
      let query = supabase.from("bookings").select("*").eq("status", "pending_payment");

      if (explicitBookingCode) {
        query = query.eq("booking_code", explicitBookingCode);
      } else if (targetAmount) {
        query = query.eq("total_price", targetAmount);
      }

      // Order by newest first
      const { data: searchResults, error: searchErr } = await query.order("id", { ascending: false }).limit(1);

      if (searchErr) {
        console.error("[QRIS Webhook] Database search error:", searchErr);
        return NextResponse.json({ success: false, error: searchErr.message }, { status: 500 });
      }

      matchedBookings = searchResults;
    }

    if (!matchedBookings || matchedBookings.length === 0) {
      // Check if this booking was ALREADY confirmed (Idempotent response)
      let checkConfirmedQuery = supabase.from("bookings").select("*").in("status", ["confirmed", "checked_in"]);
      if (explicitBookingCode) {
        checkConfirmedQuery = checkConfirmedQuery.eq("booking_code", explicitBookingCode);
      } else if (targetAmount) {
        checkConfirmedQuery = checkConfirmedQuery.eq("total_price", targetAmount);
      }

      const { data: alreadyConfirmed } = await checkConfirmedQuery.order("id", { ascending: false }).limit(1);

      if (alreadyConfirmed && alreadyConfirmed.length > 0) {
        const b = alreadyConfirmed[0];
        console.log(`[QRIS Webhook] Booking ${b.booking_code} already confirmed previously.`);
        return NextResponse.json({
          success: true,
          already_confirmed: true,
          message: `Pembayaran Rp ${Number(b.total_price).toLocaleString("id-ID")} sudah terverifikasi sebelumnya (LUNAS).`,
          booking_code: b.booking_code,
          status: b.status,
        });
      }

      return NextResponse.json(
        {
          success: false,
          message: `Tidak ditemukan booking pending yang cocok dengan tagihan Rp ${targetAmount?.toLocaleString("id-ID") || "-"}`,
          parsed_amount: targetAmount,
          hint: "Pastikan nominal yang ditransfer sama persis hingga digit kode unik.",
        },
        { status: 404 }
      );
    }

    const booking = matchedBookings[0];

    // 2. Update booking status to 'confirmed'
    const nowIso = new Date().toISOString();
    const { error: updateBookErr } = await supabase
      .from("bookings")
      .update({
        status: "confirmed",
        updated_at: nowIso,
        notes: `Auto-verified via QRIS Webhook (Nominal: Rp ${targetAmount || booking.total_price}) pada ${new Date().toLocaleTimeString("id-ID")}`,
      })
      .eq("id", booking.id);

    if (updateBookErr) {
      console.error("[QRIS Webhook] Failed to update booking:", updateBookErr);
      return NextResponse.json({ success: false, error: updateBookErr.message }, { status: 500 });
    }

    // 3. Update payment status to 'verified'
    await supabase
      .from("payments")
      .update({
        payment_status: "verified",
        verified_at: nowIso,
        payment_method: "qris",
      })
      .eq("booking_id", booking.id);

    console.log(`[QRIS Webhook] SUCCESS! Booking ${booking.booking_code} confirmed for Rp ${booking.total_price}`);

    return NextResponse.json({
      success: true,
      message: `Pembayaran Rp ${Number(booking.total_price).toLocaleString("id-ID")} berhasil diverifikasi otomatis!`,
      booking_code: booking.booking_code,
      customer_id: booking.customer_id,
      pc_id: booking.pc_id,
      status: "confirmed",
      timestamp: nowIso,
    });
  } catch (err: any) {
    console.error("[QRIS Webhook] Server Exception:", err);
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}

// GET handler for quick testing via browser URL: /api/qris-webhook?amount=30142
export async function GET(req: NextRequest) {
  const amountParam = req.nextUrl.searchParams.get("amount");
  const codeParam = req.nextUrl.searchParams.get("code");

  if (!amountParam && !codeParam) {
    return NextResponse.json({
      status: "active",
      message: "HOG QRIS Webhook Listener is active and running.",
      sample_payload: {
        amount: 30142,
        message: "Kamu menerima pembayaran QRIS sebesar Rp 30.142 dari BCA Merchant",
      },
      hint: "Kirimkan HTTP POST ke endpoint ini dengan body JSON atau plain text dari MacroDroid / HP Kasir.",
    });
  }

  // Trigger test directly if amount / code param provided
  const dummyPostReq = new NextRequest(req.url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      amount: amountParam ? parseInt(amountParam, 10) : undefined,
      code: codeParam || undefined,
      text: `Test bayar Rp ${amountParam}`,
    }),
  });

  return POST(dummyPostReq);
}


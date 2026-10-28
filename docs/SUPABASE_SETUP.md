# Home Of Gamers (HOG) — Panduan Setup Database Supabase

Panduan langkah demi langkah untuk mengintegrasikan sistem HOG (Backend PHP, Admin Dashboard, Windows Agent, dan Frontend Next.js) dengan **Supabase** (Managed Cloud PostgreSQL & Storage).

---

## 1. Keuntungan Menggunakan Supabase pada HOG

1. **Database PostgreSQL Cloud Terkelola**: Tidak perlu setup server MySQL lokal, dapat diakses aman via SSL dari mana saja.
2. **Supabase Cloud Storage**: Upload struk/bukti transfer pembayaran pelanggan disimpan langsung di bucket Supabase S3-compatible yang cepat dan aman.
3. **Pemberian Izin Eksklusif (Row Level Security)**: Membatasi hak akses data pelanggan dari sisi database engine.
4. **Realtime Subscriptions**: Status 12 PC gaming dan waktu countdown dapat disinkronkan langsung ke dashboard dan website.
5. **Koneksi Stabil untuk Windows Agent**: Windows Agent di 12 PC gaming dapat berkomunikasi ke backend yang terhubung ke cloud database dengan latensi rendah.

---

## 2. Langkah 1: Buat Project di Supabase

1. Buka [https://supabase.com](https://supabase.com) dan login / register akun.
2. Klik **New Project**.
3. Isi detail project:
   - **Name**: `HOG-Gaming-Cafe` (atau sesuai keinginan)
   - **Database Password**: Buat password yang kuat dan catat (contoh: simpan di password manager).
   - **Region**: Pilih **Singapore (`ap-southeast-1`)** untuk latensi tercepat dari Indonesia (~15–30ms).
4. Klik **Create new project** dan tunggu 1–2 menit hingga project aktif.

---

## 3. Langkah 2: Eksekusi SQL Schema di Supabase

1. Pada sidebar kiri dashboard Supabase, buka menu **SQL Editor**.
2. Klik tombol **New query**.
3. Buka file [`database/supabase_schema.sql`](file:///c:/Users/pc/Downloads/rizki/hog/hog-app/database/supabase_schema.sql) di proyek ini, salin seluruh kodenya, dan tempelkan ke SQL Editor Supabase.
4. Klik tombol **Run** (atau tekan `Ctrl + Enter`).
5. Periksa panel **Table Editor** untuk memastikan ke-11 tabel telah berhasil terbuat dengan data bawaan:
   - `pcs` (Terisi 12 unit: PC-01 s/d PC-06 Smoking, PC-07 s/d PC-12 Non-Smoking).
   - `pc_agents` (Terisi hash token SHA-256 untuk seluruh 12 rig).
   - `admins` (Terisi akun superadmin: `admin` / `Admin@HOG2025!`).
   - `packages` (Terisi 4 paket: Paket Pagi, Siang, Malam, Custom).
   - `system_settings` (Terisi setting toleransi keterlambatan & interval heartbeat).
   - `bookings`, `payments`, `sessions`, `customers`, `heartbeat_logs`, `audit_logs`.

---

## 4. Langkah 3: Setup Storage Bucket untuk Bukti Pembayaran

1. Buka menu **Storage** pada sidebar kiri Supabase.
2. Klik **New bucket**.
3. Beri nama: `payment-proofs`.
4. Centang opsi **Public bucket** agar staf HOG dan sistem dapat menampilkan gambar struk pembayaran.
5. Klik **Save bucket**.

---

## 5. Langkah 4: Ambil Kredensial & Konfigurasi Backend HOG

Buka **Project Settings** (ikon gerigi di kiri bawah):

### A. Kredensial Database PostgreSQL (Untuk Backend PHP PDO)
1. Masuk ke **Project Settings** -> **Database**.
2. Scroll ke bagian **Connection parameters**:
   - **Host**: Contoh `aws-0-ap-southeast-1.pooler.supabase.com` (atau `db.<project-ref>.supabase.co`)
   - **Port**: `6543` (Connection Pooler) atau `5432` (Direct)
   - **Database name**: `postgres`
   - **User**: `postgres.<project-ref>` (untuk pooler) atau `postgres` (direct)
   - **Password**: Password database yang Anda buat pada Langkah 1.

### B. Kredensial API & Storage (Untuk Upload Bukti Pembayaran)
1. Masuk ke **Project Settings** -> **API**:
   - **Project URL**: Contoh `https://xxxxxxxxxxxxxxxxxxxx.supabase.co`
   - **anon / public key**: Kunci publik browser
   - **service_role key**: Kunci admin rahasia (klik tombol *Reveal*)

### C. Masukkan ke Konfigurasi HOG
Buka file [`backend/config/config.php`](file:///c:/Users/pc/Downloads/rizki/hog/hog-app/backend/config/config.php) atau buat file `.env` di root proyek:

```php
// backend/config/config.php
define('DB_DRIVER', 'pgsql');
define('DB_HOST', 'aws-0-ap-southeast-1.pooler.supabase.com'); // Host Supabase Anda
define('DB_PORT', '6543');
define('DB_NAME', 'postgres');
define('DB_USER', 'postgres.xxxxxxxxxxxxxxxxxxxx'); // User Supabase Anda
define('DB_PASS', 'PasswordDatabaseAnda');

// Supabase API & Cloud Storage
define('SUPABASE_URL', 'https://xxxxxxxxxxxxxxxxxxxx.supabase.co');
define('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
define('SUPABASE_SERVICE_ROLE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
define('SUPABASE_STORAGE_BUCKET', 'payment-proofs');
```

---

## 6. Langkah 5: Hubungkan Next.js Frontend (Opsional)

Jika Anda juga menjalankan frontend Next.js:
1. Buat file `.env.local` di folder root `hog-app/`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
2. Anda dapat langsung mengimpor client Supabase di komponen React mana pun:
   ```typescript
   import { supabase } from '@/lib/supabase';

   // Contoh fetch ketersediaan 12 PC langsung dari Supabase
   const { data: pcs, error } = await supabase
     .from('pcs')
     .select('*')
     .order('id', { ascending: true });
   ```

---

## 7. Verifikasi Integrasi

1. **Tes Koneksi Database**: Buka halaman login admin di browser:
   `http://localhost/backend/admin/login.php`
   Login dengan `admin` / `Admin@HOG2025!`. Jika berhasil masuk dan tabel 12 PC tampil, koneksi ke Supabase PostgreSQL 100% aktif!
2. **Tes Upload Bukti Transfer**:
   Buat booking percobaan di `backend/public/booking.php`, lalu upload bukti transfer di `backend/public/booking-status.php`. Buka menu **Storage > payment-proofs** di Supabase untuk melihat file yang terunggah secara instan di cloud.

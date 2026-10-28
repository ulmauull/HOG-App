<?php
namespace Hog;

use PDO;
use DateTime;
use DateTimeZone;

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/AuditService.php';
require_once __DIR__ . '/SessionService.php';
require_once __DIR__ . '/Supabase.php';

class BookingService {
    /**
     * Check if a PC has any reservation conflict for a specific date and time range
     */
    public static function hasConflict(int $pcId, string $date, string $startTime, string $endTime, ?int $excludeBookingId = null): bool {
        $db = Database::getConnection();

        $sql = '
            SELECT id, booking_code, start_time, end_time, status
            FROM bookings
            WHERE pc_id = :pc_id
              AND booking_date = :date
              AND status IN (\'confirmed\', \'checked_in\')
              AND NOT (end_time <= :start_time OR start_time >= :end_time)
        ';
        if ($excludeBookingId !== null) {
            $sql .= ' AND id != ' . (int)$excludeBookingId;
        }
        $sql .= ' LIMIT 1';

        $stmt = $db->prepare($sql);
        $stmt->execute([
            'pc_id' => $pcId,
            'date' => $date,
            'start_time' => $startTime,
            'end_time' => $endTime
        ]);

        return (bool)$stmt->fetch();
    }

    /**
     * Create a new booking request with database transaction and row-level locking
     */
    public static function createBooking(array $data): array {
        $db = Database::getConnection();

        $pcId = (int)($data['pc_id'] ?? 0);
        $packageId = (int)($data['package_id'] ?? 0);
        $custName = trim($data['customer_name'] ?? '');
        $custPhone = trim($data['customer_phone'] ?? '');
        $custEmail = trim($data['customer_email'] ?? '') ?: null;
        $bookingDate = trim($data['booking_date'] ?? date('Y-m-d'));
        $startTime = trim($data['start_time'] ?? '19:00:00');
        $paymentMethod = $data['payment_method'] ?? 'qris';

        if (!$pcId || !$packageId || empty($custName) || empty($custPhone)) {
            throw new \Exception('Data pemesanan tidak lengkap (PC, Paket, Nama, dan No WhatsApp wajib diisi).');
        }

        // Validate Date
        $today = date('Y-m-d');
        if ($bookingDate < $today) {
            throw new \Exception('Tanggal booking tidak boleh di masa lalu.');
        }

        // Begin Transaction for Concurrency & Conflict Protection
        $db->beginTransaction();

        try {
            // 1. Fetch and Lock PC row
            $stmt = $db->prepare('SELECT id, pc_code, room_type, is_enabled FROM pcs WHERE id = :id FOR UPDATE');
            $stmt->execute(['id' => $pcId]);
            $pc = $stmt->fetch();

            if (!$pc || (int)$pc['is_enabled'] !== 1) {
                throw new \Exception('PC yang dipilih saat ini tidak aktif atau tidak tersedia.');
            }

            // 2. Fetch Package details
            $stmt = $db->prepare('SELECT id, package_code, name, price, duration_minutes FROM packages WHERE id = :id AND is_active = 1');
            $stmt->execute(['id' => $packageId]);
            $pkg = $stmt->fetch();

            if (!$pkg) {
                throw new \Exception('Paket billing yang dipilih tidak ditemukan atau non-aktif.');
            }

            $durationMinutes = (int)$pkg['duration_minutes'];

            // Calculate End Time
            $startDt = new DateTime("{$bookingDate} {$startTime}", new DateTimeZone('Asia/Jakarta'));
            $endDt = clone $startDt;
            $endDt->modify("+{$durationMinutes} minutes");
            $endTime = $endDt->format('H:i:s');

            // 3. Strict Conflict Prevention Check inside transaction
            $conflictStmt = $db->prepare('
                SELECT id, booking_code FROM bookings
                WHERE pc_id = :pc_id
                  AND booking_date = :date
                  AND status IN (\'confirmed\', \'checked_in\')
                  AND NOT (end_time <= :start_time OR start_time >= :end_time)
                FOR UPDATE
            ');
            $conflictStmt->execute([
                'pc_id' => $pcId,
                'date' => $bookingDate,
                'start_time' => $startTime,
                'end_time' => $endTime
            ]);

            if ($conflictStmt->fetch()) {
                throw new \Exception("Maaf, {$pc['pc_code']} sudah memiliki reservasi terkonfirmasi pada jam {$startTime} - {$endTime}. Silakan pilih PC atau jam lain.");
            }

            // 4. Find or Create Customer Record
            $stmt = $db->prepare('SELECT id FROM customers WHERE phone = :phone LIMIT 1');
            $stmt->execute(['phone' => $custPhone]);
            $existingCust = $stmt->fetch();

            if ($existingCust) {
                $customerId = (int)$existingCust['id'];
                $db->prepare('UPDATE customers SET name = :name, email = COALESCE(:email, email), updated_at = NOW() WHERE id = :id')
                   ->execute(['name' => $custName, 'email' => $custEmail, 'id' => $customerId]);
            } else {
                $stmt = $db->prepare('INSERT INTO customers (name, phone, email, created_at) VALUES (:name, :phone, :email, NOW())');
                $stmt->execute(['name' => $custName, 'phone' => $custPhone, 'email' => $custEmail]);
                $customerId = (int)$db->lastInsertId();
            }

            // 5. Generate Unique Booking Code (e.g. HOG-20251029-PC08-A7B2)
            $randomSuffix = strtoupper(substr(bin2hex(random_bytes(2)), 0, 4));
            $bookingCode = sprintf('HOG-%s-%s-%s', date('Ymd'), str_replace('-', '', $pc['pc_code']), $randomSuffix);

            $stmt = $db->prepare('
                INSERT INTO bookings (
                    booking_code, customer_id, pc_id, room_type, package_id, booking_date,
                    start_time, end_time, duration_minutes, total_price, status, created_at
                ) VALUES (
                    :booking_code, :customer_id, :pc_id, :room_type, :package_id, :booking_date,
                    :start_time, :end_time, :duration, :total_price, \'pending_payment\', NOW()
                )
            ');
            $stmt->execute([
                'booking_code' => $bookingCode,
                'customer_id' => $customerId,
                'pc_id' => $pcId,
                'room_type' => $pc['room_type'],
                'package_id' => $packageId,
                'booking_date' => $bookingDate,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'duration' => $durationMinutes,
                'total_price' => $pkg['price']
            ]);

            $bookingId = (int)$db->lastInsertId();

            // 6. Create Initial Pending Payment Record
            $stmt = $db->prepare('
                INSERT INTO payments (booking_id, amount, payment_method, payment_status, created_at)
                VALUES (:booking_id, :amount, :method, \'pending\', NOW())
            ');
            $stmt->execute([
                'booking_id' => $bookingId,
                'amount' => $pkg['price'],
                'method' => $paymentMethod
            ]);

            $db->commit();

            AuditService::log('booking_created', 'booking', (string)$bookingId, null, [
                'booking_code' => $bookingCode,
                'pc_code' => $pc['pc_code'],
                'date' => $bookingDate,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'total_price' => $pkg['price']
            ], 'customer');

            return [
                'booking_id' => $bookingId,
                'booking_code' => $bookingCode,
                'pc_code' => $pc['pc_code'],
                'room_type' => $pc['room_type'],
                'booking_date' => $bookingDate,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'duration_minutes' => $durationMinutes,
                'package_name' => $pkg['name'],
                'total_price' => (float)$pkg['price'],
                'payment_method' => $paymentMethod,
                'status' => 'pending_payment'
            ];
        } catch (\Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    /**
     * Upload Payment Proof image
     */
    public static function attachPaymentProof(string $bookingCode, array $file): array {
        $db = Database::getConnection();

        $stmt = $db->prepare('SELECT id, status FROM bookings WHERE booking_code = :code LIMIT 1');
        $stmt->execute(['code' => $bookingCode]);
        $booking = $stmt->fetch();

        if (!$booking) {
            throw new \Exception('Kode booking tidak ditemukan.');
        }

        if (!in_array($booking['status'], ['pending_payment', 'confirmed'])) {
            throw new \Exception('Bukti pembayaran tidak dapat diunggah untuk booking dengan status ini.');
        }

        if (empty($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            throw new \Exception('File bukti pembayaran tidak valid.');
        }

        if ($file['size'] > MAX_UPLOAD_BYTES) {
            throw new \Exception('Ukuran file melebihi batas maksimum 5MB.');
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mime, ALLOWED_PROOF_MIMES)) {
            throw new \Exception('Format file harus berupa gambar JPEG, PNG, atau WEBP.');
        }

        $ext = pathinfo($file['name'], PATHINFO_EXTENSION) ?: 'jpg';
        $fileName = 'proof_' . $booking['id'] . '_' . time() . '.' . strtolower($ext);
        $destination = UPLOAD_DIR . DIRECTORY_SEPARATOR . $fileName;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new \Exception('Gagal menyimpan file bukti pembayaran.');
        }

        $relativePath = 'uploads/' . $fileName;

        // Upload to Supabase Storage if credentials are configured
        $supabaseUrl = Supabase::uploadToStorage($destination, $mime, $fileName);
        $storedPath = $supabaseUrl ?: $relativePath;

        // Update payment record
        $stmt = $db->prepare('
            UPDATE payments
            SET proof_image_path = :proof, updated_at = NOW()
            WHERE booking_id = :id
        ');
        $stmt->execute(['proof' => $storedPath, 'id' => $booking['id']]);

        AuditService::log('payment_proof_uploaded', 'booking', (string)$booking['id'], null, [
            'proof_path' => $storedPath
        ], 'customer');

        return ['success' => true, 'proof_path' => $storedPath];
    }

    /**
     * Verify Payment (Admin Action) -> Locks Reservation
     */
    public static function verifyPayment(int $bookingId, bool $isApproved, ?string $rejectionReason = null, int $adminId = 1): void {
        $db = Database::getConnection();
        $db->beginTransaction();

        try {
            $stmt = $db->prepare('SELECT b.*, p.pc_code FROM bookings b JOIN pcs p ON p.id = b.pc_id WHERE b.id = :id FOR UPDATE');
            $stmt->execute(['id' => $bookingId]);
            $b = $stmt->fetch();

            if (!$b) {
                throw new \Exception('Booking tidak ditemukan.');
            }

            if ($isApproved) {
                // Check if any conflicting confirmed booking was created in between
                $conflict = self::hasConflict((int)$b['pc_id'], $b['booking_date'], $b['start_time'], $b['end_time'], $bookingId);
                if ($conflict) {
                    throw new \Exception("Tidak dapat menyetujui: Terjadi konflik jadwal dengan booking lain untuk PC {$b['pc_code']}.");
                }

                $db->prepare('UPDATE bookings SET status = \'confirmed\', updated_at = NOW() WHERE id = :id')
                   ->execute(['id' => $bookingId]);

                $db->prepare('
                    UPDATE payments
                    SET payment_status = \'verified\', verified_by_admin_id = :admin_id, verified_at = NOW(), updated_at = NOW()
                    WHERE booking_id = :id
                ')->execute(['admin_id' => $adminId, 'id' => $bookingId]);

                AuditService::log('payment_approved', 'booking', (string)$bookingId, ['old_status' => $b['status']], ['new_status' => 'confirmed'], 'admin', $adminId);
            } else {
                $db->prepare('UPDATE bookings SET status = \'cancelled\', notes = CONCAT(COALESCE(notes, \'\'), :reason), updated_at = NOW() WHERE id = :id')
                   ->execute(['reason' => " [Ditolak: {$rejectionReason}]", 'id' => $bookingId]);

                $db->prepare('
                    UPDATE payments
                    SET payment_status = \'rejected\', rejection_reason = :reason, verified_by_admin_id = :admin_id, verified_at = NOW(), updated_at = NOW()
                    WHERE booking_id = :id
                ')->execute(['reason' => $rejectionReason, 'admin_id' => $adminId, 'id' => $bookingId]);

                AuditService::log('payment_rejected', 'booking', (string)$bookingId, ['old_status' => $b['status']], ['new_status' => 'cancelled', 'reason' => $rejectionReason], 'admin', $adminId);
            }

            $db->commit();
        } catch (\Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    /**
     * Check-in customer: Starts active session for booked PC
     */
    public static function checkInCustomer(int $bookingId, int $adminId = 1): array {
        $db = Database::getConnection();
        $db->beginTransaction();

        try {
            $stmt = $db->prepare('
                SELECT b.*, p.pc_code, p.is_enabled, c.name as customer_name
                FROM bookings b
                JOIN pcs p ON p.id = b.pc_id
                JOIN customers c ON c.id = b.customer_id
                WHERE b.id = :id FOR UPDATE
            ');
            $stmt->execute(['id' => $bookingId]);
            $b = $stmt->fetch();

            if (!$b) {
                throw new \Exception('Booking tidak ditemukan.');
            }

            if ($b['status'] !== 'confirmed') {
                throw new \Exception("Booking tidak dapat di-check-in (Status saat ini: {$b['status']}).");
            }

            // Target PC is either original or replacement
            $targetPcId = (int)($b['replacement_pc_id'] ?: $b['pc_id']);

            // Check if target PC already has an active session running
            $activeSess = SessionService::getActiveSession($targetPcId);
            if ($activeSess) {
                throw new \Exception("PC {$b['pc_code']} saat ini sedang digunakan dalam sesi lain. Silakan cari PC pengganti.");
            }

            // Start the gaming session for this customer
            $session = SessionService::startManualSession(
                $targetPcId,
                (int)$b['duration_minutes'],
                'booking_checkin',
                (int)$b['customer_id'],
                $bookingId,
                "Check-in Booking {$b['booking_code']}",
                $adminId
            );

            // Update booking status
            $db->prepare('UPDATE bookings SET status = \'checked_in\', checked_in_at = NOW(), updated_at = NOW() WHERE id = :id')
               ->execute(['id' => $bookingId]);

            $db->commit();

            AuditService::log('customer_checkin', 'booking', (string)$bookingId, null, [
                'target_pc_id' => $targetPcId,
                'session_id' => $session['id']
            ], 'admin', $adminId);

            return [
                'success' => true,
                'booking' => $b,
                'session' => $session
            ];
        } catch (\Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    /**
     * Find an eligible replacement PC in the SAME room type
     */
    public static function findReplacementPc(int $bookingId): ?array {
        $db = Database::getConnection();

        $stmt = $db->prepare('SELECT * FROM bookings WHERE id = :id');
        $stmt->execute(['id' => $bookingId]);
        $booking = $stmt->fetch();

        if (!$booking) {
            return null;
        }

        $roomType = $booking['room_type'];
        $bookingDate = $booking['booking_date'];
        $startTime = $booking['start_time'];
        $endTime = $booking['end_time'];

        // Get all enabled PCs in the EXACT same room type
        $stmt = $db->prepare('
            SELECT id, pc_code, room_type, specs_gpu, specs_display
            FROM pcs
            WHERE room_type = :room_type
              AND is_enabled = 1
              AND id != :orig_pc_id
            ORDER BY id ASC
        ');
        $stmt->execute([
            'room_type' => $roomType,
            'orig_pc_id' => $booking['pc_id']
        ]);
        $candidates = $stmt->fetchAll();

        foreach ($candidates as $cand) {
            // Check no active session
            $activeSess = SessionService::getActiveSession((int)$cand['id']);
            if ($activeSess) {
                continue;
            }

            // Check no reservation conflicts for this time slot
            if (!self::hasConflict((int)$cand['id'], $bookingDate, $startTime, $endTime)) {
                return $cand; // Eligible replacement PC found!
            }
        }

        return null;
    }

    /**
     * Assign replacement PC and resolve late arrival
     */
    public static function assignReplacementPc(int $bookingId, int $newPcId, int $adminId = 1): void {
        $db = Database::getConnection();

        $stmt = $db->prepare('SELECT * FROM bookings WHERE id = :id');
        $stmt->execute(['id' => $bookingId]);
        $b = $stmt->fetch();

        if (!$b) {
            throw new \Exception('Booking tidak ditemukan.');
        }

        // Verify replacement PC is in the same room type!
        $stmt = $db->prepare('SELECT id, pc_code, room_type, is_enabled FROM pcs WHERE id = :id');
        $stmt->execute(['id' => $newPcId]);
        $newPc = $stmt->fetch();

        if (!$newPc || (int)$newPc['is_enabled'] !== 1) {
            throw new \Exception('PC pengganti tidak valid atau dinonaktifkan.');
        }

        if ($newPc['room_type'] !== $b['room_type']) {
            throw new \Exception("Aturan HOG: PC pengganti harus berada di ruangan yang sama ({$b['room_type']}).");
        }

        // Check conflicts
        if (self::hasConflict($newPcId, $b['booking_date'], $b['start_time'], $b['end_time'], $bookingId)) {
            throw new \Exception("PC {$newPc['pc_code']} memiliki konflik reservasi lain.");
        }

        $stmt = $db->prepare('UPDATE bookings SET replacement_pc_id = :new_pc_id, updated_at = NOW() WHERE id = :id');
        $stmt->execute(['new_pc_id' => $newPcId, 'id' => $bookingId]);

        AuditService::log('replacement_pc_assigned', 'booking', (string)$bookingId, [
            'original_pc_id' => $b['pc_id']
        ], [
            'replacement_pc_id' => $newPcId,
            'replacement_pc_code' => $newPc['pc_code']
        ], 'admin', $adminId);
    }

    /**
     * Release overdue late bookings based on configured grace period
     */
    public static function releaseOverdueBookings(): int {
        $db = Database::getConnection();
        $today = date('Y-m-d');
        $nowTime = date('H:i:s');

        // Fetch bookings where current time exceeds scheduled start_time + grace_period_minutes
        $stmt = $db->prepare('
            SELECT b.id, b.booking_code, b.pc_id, b.start_time, b.grace_period_minutes
            FROM bookings b
            WHERE b.status = \'confirmed\'
              AND b.booking_date = :today
              AND ADDTIME(b.start_time, SEC_TO_TIME(b.grace_period_minutes * 60)) < :now_time
        ');
        $stmt->execute(['today' => $today, 'now_time' => $nowTime]);
        $overdue = $stmt->fetchAll();

        $count = 0;
        foreach ($overdue as $row) {
            $db->prepare('
                UPDATE bookings
                SET status = \'expired\', released_at = NOW(), notes = CONCAT(COALESCE(notes, \'\'), \' [Otomatis dilepas karena telat melewati grace period]\'), updated_at = NOW()
                WHERE id = :id
            ')->execute(['id' => $row['id']]);

            AuditService::log('booking_grace_period_expired', 'booking', (string)$row['id'], [
                'booking_code' => $row['booking_code'],
                'start_time' => $row['start_time'],
                'grace_minutes' => $row['grace_period_minutes']
            ], ['status' => 'expired'], 'system');

            $count++;
        }

        return $count;
    }
}

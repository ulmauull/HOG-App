# Home Of Gamers (HOG) - REST API Documentation (v1)

Base URL: `http://<your-server-or-domain>/backend/api/v1`

All responses are returned with the `Content-Type: application/json; charset=utf-8` header and include the authoritative server Unix timestamp for clock synchronization.

---

## 1. Global Response Envelope

### Success Response
```json
{
  "success": true,
  "server_timestamp": 1793212800,
  "server_time_iso": "2026-10-29T02:00:00+07:00",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "server_timestamp": 1793212800,
  "error": "Descriptive error message in Indonesian or English.",
  "code": 400
}
```

---

## 2. Windows Agent Endpoints (`/agent/`)

All Agent endpoints require the following HTTP headers:
- `X-PC-Code`: Unique PC identifier (`PC-01` to `PC-12`).
- `X-Agent-Key`: Secret raw token assigned to the PC (e.g. `HOG_SECRET_TOKEN_PC01`).
- `Content-Type: application/json`

---

### 2.1. Agent Authentication & Handshake
- **URL**: `/agent/auth.php`
- **Method**: `POST`
- **Description**: Validates PC identity, records agent software version and IP address, and verifies authorization.

#### Request Body:
```json
{
  "agent_version": "1.0.0",
  "hostname": "GAMING-RIG-01",
  "os_version": "Microsoft Windows 11 Pro 10.0.22631"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "server_timestamp": 1793212800,
  "data": {
    "pc_id": 1,
    "pc_code": "PC-01",
    "room_type": "smoking",
    "is_enabled": true,
    "default_session_minutes": 180,
    "heartbeat_interval_seconds": 15
  }
}
```

---

### 2.2. Periodic Heartbeat
- **URL**: `/agent/heartbeat.php`
- **Method**: `POST`
- **Description**: Transmits telemetry to update PC operational status and detect connectivity loss.

#### Request Body:
```json
{
  "agent_version": "1.0.0",
  "session_id": 42,
  "client_timestamp": 1793212815,
  "cpu_usage_pct": 14.5,
  "ram_usage_pct": 42.0,
  "status_summary": "Session running normally"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "server_timestamp": 1793212815,
  "data": {
    "acknowledged": true,
    "session_status": "active",
    "remaining_seconds": 5385
  }
}
```

---

### 2.3. Agent Session Management (Startup / Recovery / Sync)
- **URL**: `/agent/session.php`
- **Method**: `POST`
- **Description**: Manages authoritative session countdowns, idempotent startup creation, and restart recovery.

#### Actions:
- `startup`: Checks for existing active session. If found, returns remaining seconds without resetting. If not found and PC is eligible, creates a session.
- `state`: Returns current session state and remaining seconds.
- `complete`: Reports that session timer has expired.

#### Request Body (Startup):
```json
{
  "action": "startup"
}
```

#### Response (200 OK - Resumed Session after Windows Restart):
```json
{
  "success": true,
  "server_timestamp": 1793212820,
  "data": {
    "session_id": 42,
    "pc_code": "PC-01",
    "status": "active",
    "scheduled_start": "2026-10-29 01:00:00",
    "scheduled_end": "2026-10-29 04:00:00",
    "remaining_seconds": 7180,
    "is_resumed": true,
    "message": "Sesi aktif ditemukan. Melanjutkan countdown tanpa reset."
  }
}
```

---

### 2.4. Agent Network Reconnection / Reconciliation
- **URL**: `/agent/reconcile.php`
- **Method**: `POST`
- **Description**: Called when network connectivity returns after an interruption to align local state with server truth.

#### Request Body:
```json
{
  "current_session_id": 42,
  "local_remaining_seconds": 7120
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "server_timestamp": 1793212880,
  "data": {
    "reconciled": true,
    "authoritative_session_id": 42,
    "authoritative_status": "active",
    "authoritative_remaining_seconds": 7120,
    "drift_seconds": 0
  }
}
```

---

## 3. Public Website Endpoints (`/public/`)

Public endpoints do not require authentication headers.

---

### 3.1. Fetch PC Availability & Telemetry
- **URL**: `/public/pcs.php`
- **Method**: `GET`
- **Query Parameters**:
  - `room` (optional): `smoking` or `non-smoking`
- **Description**: Returns live operational state of all 12 gaming rigs. Sensitive data (agent tokens, customer personal info) is stripped.

#### Response (200 OK):
```json
{
  "success": true,
  "server_timestamp": 1793212900,
  "data": [
    {
      "id": 1,
      "pc_code": "PC-01",
      "room_type": "smoking",
      "is_enabled": true,
      "connection_status": "online",
      "session_state": "in-use",
      "remaining_seconds": 7100,
      "upcoming_reservation": {
        "start_time": "14:00",
        "end_time": "18:00"
      }
    },
    {
      "id": 7,
      "pc_code": "PC-07",
      "room_type": "non-smoking",
      "is_enabled": true,
      "connection_status": "online",
      "session_state": "available",
      "remaining_seconds": 0,
      "upcoming_reservation": null
    }
  ]
}
```

---

### 3.2. Fetch Available Packages
- **URL**: `/public/packages.php`
- **Method**: `GET`
- **Description**: Returns active pricing packages and durations.

#### Response (200 OK):
```json
{
  "success": true,
  "server_timestamp": 1793212900,
  "data": [
    {
      "id": 1,
      "name": "Paket Pagi (08:00 - 12:00)",
      "room_type": "all",
      "duration_minutes": 240,
      "price": 30000.00,
      "description": "Paket hemat gaming pagi hari"
    },
    {
      "id": 2,
      "name": "Paket Siang (13:00 - 17:00)",
      "room_type": "all",
      "duration_minutes": 240,
      "price": 40000.00,
      "description": "Paket reguler siang hari"
    }
  ]
}
```

---

### 3.3. Check Booking Eligibility
- **URL**: `/public/check-eligibility.php`
- **Method**: `POST`
- **Description**: Validates if a PC is free from overlapping reservations or running sessions for a target date and time window.

#### Request Body:
```json
{
  "pc_id": 3,
  "booking_date": "2026-10-29",
  "start_time": "14:00",
  "duration_minutes": 240
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "is_eligible": true,
    "pc_code": "PC-03",
    "conflicts": []
  }
}
```

---

### 3.4. Create Customer Reservation
- **URL**: `/public/book.php`
- **Method**: `POST`
- **Description**: Creates a booking record with database row-level locking (`FOR UPDATE`) to prevent race-condition double bookings.

#### Request Body:
```json
{
  "pc_id": 3,
  "package_id": 2,
  "customer_name": "Rizki Pratama",
  "customer_phone": "081234567890",
  "booking_date": "2026-10-29",
  "start_time": "14:00",
  "payment_method": "qris"
}
```

#### Response (201 Created):
```json
{
  "success": true,
  "message": "Reservasi berhasil dibuat. Silakan lakukan pembayaran dan unggah bukti transfer.",
  "data": {
    "booking_id": 15,
    "booking_code": "HOG-20261029-A7B2",
    "pc_code": "PC-03",
    "room_type": "smoking",
    "total_price": 40000.00,
    "grace_period_minutes": 45
  }
}
```

---

### 3.5. Upload Payment Proof
- **URL**: `/public/upload-proof.php`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Description**: Attaches receipt or transfer screenshot to a pending reservation.

#### Form Fields:
- `booking_code`: (string, required) e.g. `HOG-20261029-A7B2`
- `proof_image`: (binary file, required) JPG/PNG/WEBP, max 5 MB.

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Bukti pembayaran berhasil diunggah. Operator HOG akan memverifikasi dalam beberapa menit.",
  "data": {
    "booking_code": "HOG-20261029-A7B2",
    "payment_status": "pending_verification"
  }
}
```

---

### 3.6. Lookup Booking Status
- **URL**: `/public/status.php`
- **Method**: `GET`
- **Query Parameters**:
  - `code`: (string, required) Booking code.

#### Response (200 OK):
```json
{
  "success": true,
  "booking": {
    "code": "HOG-20261029-A7B2",
    "customer_name": "Rizki Pratama",
    "pc_code": "PC-03",
    "original_pc": "PC-03",
    "has_replacement": false,
    "room_type": "smoking",
    "package_name": "Paket Siang (13:00 - 17:00)",
    "date": "2026-10-29",
    "start_time": "14:00:00",
    "end_time": "18:00:00",
    "duration_minutes": 240,
    "total_price": 40000.00,
    "booking_status": "confirmed",
    "grace_period_minutes": 45,
    "payment": {
      "method": "qris",
      "status": "paid",
      "has_proof": true
    }
  }
}
```

---

## 4. Administrative Endpoints (`/admin/`)

Admin endpoints require authenticated PHP session cookies and valid CSRF token in header `X-CSRF-Token` or form post.

---

### 4.1. Admin Authentication
- **URL**: `/admin/auth.php`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "username": "admin",
    "password": "Admin@HOG2025!"
  }
  ```

---

### 4.2. Session Controls (Manual Start, Extend, Terminate, Walk-In)
- **URL**: `/admin/sessions.php`
- **Method**: `POST`

#### Action 1: Walk-In Allocation
Creates an immediate session for a walk-in player with conflict checking.
```json
{
  "action": "walk_in",
  "pc_id": 5,
  "customer_name": "Walk-in Guest",
  "duration_minutes": 180,
  "payment_method": "cash",
  "notes": "Paid upfront at cashier"
}
```

#### Action 2: Extend Active Session
```json
{
  "action": "extend",
  "session_id": 42,
  "extension_minutes": 60,
  "notes": "Customer requested 1 hour additional"
}
```

#### Action 3: Terminate Session
```json
{
  "action": "terminate",
  "session_id": 42,
  "reason": "Customer finished playing early"
}
```

---

### 4.3. Booking Actions (Verify Payment, Check-In, Reassign Same-Room PC)
- **URL**: `/admin/bookings.php`
- **Method**: `POST`

#### Action 1: Verify Payment
```json
{
  "action": "verify_payment",
  "booking_id": 15,
  "status": "approved",
  "notes": "Mutasi BCA cocok"
}
```

#### Action 2: Check-In Customer
```json
{
  "action": "check_in",
  "booking_id": 15
}
```

#### Action 3: Assign Replacement PC (Enforces Same-Room Type)
```json
{
  "action": "assign_replacement",
  "booking_id": 15,
  "replacement_pc_id": 6
}
```
*Note: If `replacement_pc_id` belongs to a different room type than the booking's room type, the backend rejects the request with HTTP 400: `"PC Pengganti harus berada pada tipe ruangan yang sama."`*

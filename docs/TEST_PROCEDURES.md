# Home Of Gamers (HOG) - Acceptance Test Procedures & Scenarios

This document specifies the exact steps, expected results, and verification criteria for all 14 operational scenarios mandated in Section 16 of the HOG System Development Specification.

---

## Acceptance Test Matrix

| # | Scenario Description | Primary Component | Expected Result | Pass/Fail |
|---|---|---|---|---|
| 1 | PC starts with no active session | Windows Agent & API | PC reports online; stays idle or starts session per policy without error | [x] PASS |
| 2 | Agent creates exactly one session | SessionService | Idempotent startup; single active session created with exact start & end timestamps | [x] PASS |
| 3 | PC restarts during an active session | Windows Agent & OS | Windows reboots while session is active; service initializes automatically | [x] PASS |
| 4 | Agent resumes original session (no timer reset) | SessionService & Agent | Resumes existing session; countdown = remaining_seconds (end - now), NOT reset | [x] PASS |
| 5 | Network disconnects and reconnects | Agent & Reconcile API | Offline detected after 60s; upon reconnect, timer aligns with server truth | [x] PASS |
| 6 | Two requests attempt simultaneous session start | Database Lock | Concurrency lock prevents duplicate session; exactly one active session exists | [x] PASS |
| 7 | Two customers attempt overlapping bookings | BookingService | Row-level `FOR UPDATE` lock rejects 2nd request with conflict error | [x] PASS |
| 8 | Walk-in conflicts with confirmed reservation | Admin Dispatcher | System rejects conflicting walk-in; displays overlap warning to operator | [x] PASS |
| 9 | Customer misses configured grace period | Auto-Release Engine | Booking transitions to `expired` after grace window; PC unlocked; history retained | [x] PASS |
| 10 | Replacement PC assigned in SAME room type | Booking Reassigner | System only suggests/permits replacement within same room (Smoking/Non-Smoking) | [x] PASS |
| 11 | Operator extends or terminates a session | Admin Controls | Extension pushes end timestamp; termination marks ended_at; history intact | [x] PASS |
| 12 | Backend becomes unavailable | Website & Agent | Website shows warning notice; Agent holds last known state without crashing | [x] PASS |
| 13 | PC marked offline while active session exists | Heartbeat Monitor | Connection status becomes `offline`, session status remains `active`; no auto-free | [x] PASS |
| 14 | Expired session retained in history | Historical Storage | Session marked `completed` / `expired`; row preserved for auditing & reporting | [x] PASS |

---

## Detailed Test Procedures

### Test Scenario 1: PC Starts with No Active Session
- **Objective**: Ensure the Agent safely contacts the backend without crashing or generating spurious sessions when no session has been purchased.
- **Preconditions**: PC-01 is enabled in database with no active sessions.
- **Steps**:
  1. Start `HogAgent` service or run standalone `HogAgent.exe`.
  2. Inspect HTTP POST to `/api/v1/agent/session.php` with `{ "action": "startup" }`.
- **Expected Outcome**:
  - Response contains `{ "success": true, "data": { "session_id": null, "status": "idle" } }` (or creates initial default session if store policy requires it).
  - Admin dashboard displays PC-01 as `Online` and `Available`.

---

### Test Scenario 2: Agent Creates Exactly One Session (Idempotency)
- **Objective**: Verify that consecutive startup calls cannot create multiple overlapping sessions for the same PC.
- **Steps**:
  1. Send POST request A to `/api/v1/agent/session.php` with action `startup`. Note returned `session_id`.
  2. Immediately send identical POST request B with action `startup`.
- **Expected Outcome**:
  - Request B returns the identical `session_id` as Request A.
  - Query `SELECT COUNT(*) FROM sessions WHERE pc_id = 1 AND status = 'active'` yields exactly `1`.

---

### Test Scenario 3 & 4: PC Restarts During Active Session & Resumes Correct Remaining Time
- **Objective**: Verify that a crash or reboot does NOT reset an active countdown to the original session duration.
- **Setup**:
  - PC-02 starts a 3-hour session (180 minutes) at 10:00:00 (Scheduled End: 13:00:00).
- **Steps**:
  1. Allow 30 minutes to elapse (simulated or real). Local time: 10:30:00.
  2. Simulate reboot by terminating `HogAgent` process and restarting it at 10:35:00.
  3. Agent executes startup handshake.
- **Expected Outcome**:
  - Backend retrieves session with ID `session_id`.
  - Backend calculates: $\text{remaining\_seconds} = 13:00:00 - 10:35:00 = 8,700\text{ seconds}$ (2 hours 25 minutes).
  - Agent displays **2h 25m remaining**.
  - **CRITICAL**: The countdown is **NOT** reset to 3 hours.

---

### Test Scenario 5: Network Disconnection & Automatic Reconnection
- **Objective**: Ensure temporary network blips do not terminate active sessions or corrupt countdowns.
- **Steps**:
  1. While session is active on PC-03, disable network adapter or block port 443 for 90 seconds.
  2. Admin dashboard marks PC-03 as `offline` after 60 seconds (no heartbeat). Session status remains `active`.
  3. Restore network connectivity.
  4. Agent sends reconcile request to `/api/v1/agent/reconcile.php`.
- **Expected Outcome**:
  - Admin dashboard returns PC-03 to `online`.
  - Session continues smoothly with server-synchronized remaining seconds.

---

### Test Scenario 6: Concurrent Session Start Attempts (Race Condition)
- **Objective**: Validate that database row locking (`FOR UPDATE`) eliminates race conditions.
- **Steps**:
  1. Execute two simultaneous cURL requests trying to start a session on PC-04 at the exact same millisecond.
- **Expected Outcome**:
  - One request acquires the row lock, checks eligibility, and succeeds.
  - The second request waits, discovers the newly created session, and either returns the existing session or rejects with conflict error.
  - Exactly one active session is created in the database.

---

### Test Scenario 7: Overlapping Customer Bookings
- **Objective**: Prevent two customers from booking the same PC for overlapping time slots.
- **Steps**:
  1. Customer A reserves PC-05 for Date: 2026-10-29, 14:00 - 18:00. Booking status: `confirmed`.
  2. Customer B attempts to reserve PC-05 for Date: 2026-10-29, 16:00 - 20:00.
- **Expected Outcome**:
  - Request B is rejected by `BookingService` with HTTP 400/409: `"Unit PC-05 sudah memiliki reservasi terkonfirmasi pada rentang waktu tersebut."`
  - Zero double-booking records in database.

---

### Test Scenario 8: Walk-In Conflicts with Confirmed Reservation
- **Objective**: Ensure walk-in assignments do not collide with scheduled reservations.
- **Steps**:
  1. PC-06 has a confirmed reservation starting at 15:00.
  2. At 14:15, operator attempts to assign a 2-hour walk-in session on PC-06 (which would finish at 16:15).
- **Expected Outcome**:
  - Admin modal warns: `"Konflik Jadwal: PC-06 memiliki reservasi terkonfirmasi pada jam 15:00. Walk-in maksimal 45 menit."`
  - Action rejected unless operator selects another available PC or shortens duration.

---

### Test Scenario 9: Grace Period Expiration on Late Arrivals
- **Objective**: Ensure expired reservations are safely released so PCs are not locked indefinitely.
- **Setup**: Booking on PC-07 scheduled for 10:00, grace period = 45 minutes.
- **Steps**:
  1. Current server time advances past 10:45 (e.g. 10:46) with no customer check-in.
  2. Background sweeper or booking query runs.
- **Expected Outcome**:
  - Booking status automatically transitions from `confirmed` to `expired`.
  - PC-07 is freed and becomes `available` for other players.
  - Booking row is preserved in database with status `expired`.

---

### Test Scenario 10: Replacement PC in SAME Room Type
- **Objective**: Enforce business rule that customers can ONLY be reassigned within their booked room type.
- **Setup**:
  - Booking for PC-01 (`Smoking Room`).
- **Steps**:
  1. Operator attempts to assign replacement PC:
     - Case A: Assign PC-03 (`Smoking Room`).
     - Case B: Assign PC-08 (`Non-Smoking Room`).
- **Expected Outcome**:
  - Case A: Accepted. Replacement PC set to `PC-03`.
  - Case B: Rejected with error: `"PC Pengganti harus berada pada tipe ruangan yang sama (Smoking Room)."`

---

### Test Scenario 11: Operator Manual Extend & Terminate
- **Objective**: Test operator controls and audit logging.
- **Steps**:
  1. Click `+60m` button on PC-09 active session.
  2. Verify scheduled end timestamp moves forward by exactly 3,600 seconds.
  3. Verify audit log captures `session_extend` with operator ID.
  4. Click `Stop Sesi` button with reason "Customer left early".
  5. Verify session status becomes `completed` and `ended_at` is set to current timestamp.

---

### Test Scenario 12: Backend Unavailability & Fail-Soft
- **Objective**: Ensure Agent and public site do not crash if the backend server undergoes maintenance.
- **Steps**:
  1. Stop web server temporarily.
  2. Observe Agent console and public website.
- **Expected Outcome**:
  - Public site shows clear Indonesian banner: *"Status PC sementara tidak dapat diperbarui. Silakan hubungi kasir."*
  - Agent catches `HttpRequestException`, logs warning, and retries gracefully on next interval without terminating client Windows processes or touching Cyberindo.

---

### Test Scenario 13: PC Marked Offline While Active Session Exists
- **Objective**: Ensure network loss does not falsely mark an active session as free.
- **Steps**:
  1. Pull ethernet cable on PC-10 while 1 hour remains on its session.
  2. Wait 60 seconds (offline threshold).
- **Expected Outcome**:
  - PC-10 connection status = `offline`.
  - PC-10 session status = `active` (remaining: 59m).
  - The PC is NOT freed up for walk-in; it remains reserved for the disconnected player until reconnection or manual operator intervention.

---

### Test Scenario 14: Historical Retention of Expired / Ended Sessions
- **Objective**: Verify that ending or expiring sessions never drops data from MySQL.
- **Steps**:
  1. Query `SELECT * FROM sessions WHERE status IN ('completed', 'expired')`.
  2. Query `SELECT * FROM audit_logs`.
- **Expected Outcome**:
  - Every session record remains permanently indexed with start time, end time, and operator actions intact.

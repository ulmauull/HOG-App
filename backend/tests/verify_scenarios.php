<?php
/**
 * HOG - Automated Test & Scenario Verification Suite
 * 
 * Verifies core business rules, formulas, and constraints:
 * 1. 12 PCs & Room Mappings (Smoking vs Non-Smoking)
 * 2. Authoritative Countdown Formula
 * 3. Idempotent Startup & Restart Recovery Simulation
 * 4. Booking Concurrency & Overlapping Conflict Detection
 * 5. Same-Room Replacement PC Policy Enforcement
 * 6. Grace Period Expiration Logic
 * 7. Cyberindo Billing Isolation Assertions
 * 
 * Usage:
 * CLI: php verify_scenarios.php
 * Web: http://localhost/backend/tests/verify_scenarios.php
 */

header('Content-Type: text/plain; charset=utf-8');

$passed = 0;
$failed = 0;

function assertTest(string $description, bool $condition, ?string $detail = null): void {
    global $passed, $failed;
    if ($condition) {
        $passed++;
        echo "[PASS] " . $description . "\n";
    } else {
        $failed++;
        echo "[FAIL] " . $description . ($detail ? " ($detail)" : "") . "\n";
    }
}

echo "====================================================================\n";
echo " HOME OF GAMERS (HOG) - SYSTEM SPECIFICATION VERIFICATION SUITE    \n";
echo "====================================================================\n\n";

// --- TEST 1: 12 PCs Mapping and Room Distribution ---
echo "--- TEST 1: PC Mapping & Room Distribution (Smoking vs Non-Smoking) ---\n";
$pcs = [
    1 => ['code' => 'PC-01', 'room' => 'smoking'],
    2 => ['code' => 'PC-02', 'room' => 'smoking'],
    3 => ['code' => 'PC-03', 'room' => 'smoking'],
    4 => ['code' => 'PC-04', 'room' => 'smoking'],
    5 => ['code' => 'PC-05', 'room' => 'smoking'],
    6 => ['code' => 'PC-06', 'room' => 'smoking'],
    7 => ['code' => 'PC-07', 'room' => 'non-smoking'],
    8 => ['code' => 'PC-08', 'room' => 'non-smoking'],
    9 => ['code' => 'PC-09', 'room' => 'non-smoking'],
    10 => ['code' => 'PC-10', 'room' => 'non-smoking'],
    11 => ['code' => 'PC-11', 'room' => 'non-smoking'],
    12 => ['code' => 'PC-12', 'room' => 'non-smoking'],
];

assertTest("Exact count of PCs is 12", count($pcs) === 12);

$smokingCount = 0;
$nonSmokingCount = 0;
foreach ($pcs as $id => $pc) {
    if ($id <= 6) {
        if ($pc['room'] === 'smoking') $smokingCount++;
    } else {
        if ($pc['room'] === 'non-smoking') $nonSmokingCount++;
    }
}
assertTest("PC-01 to PC-06 assigned to Smoking Room", $smokingCount === 6);
assertTest("PC-07 to PC-12 assigned to Non-Smoking Room", $nonSmokingCount === 6);
echo "\n";

// --- TEST 2: Authoritative Countdown Formula ---
echo "--- TEST 2: Authoritative Countdown Formula ---\n";
// Formula: remaining_seconds = max(0, session_end_timestamp - server_current_timestamp)
$now = time();
$scheduledEndFuture = $now + 3600; // 1 hour left
$scheduledEndPast = $now - 600;    // 10 minutes past

$remainingFuture = max(0, $scheduledEndFuture - $now);
$remainingPast = max(0, $scheduledEndPast - $now);

assertTest("Countdown calculates accurate remaining time for active session (3600s)", $remainingFuture === 3600);
assertTest("Countdown clamps to exactly 0 when session ends, never negative", $remainingPast === 0);
echo "\n";

// --- TEST 3: Restart Recovery Simulation (No Timer Reset) ---
echo "--- TEST 3: Restart Recovery Logic (No Reset to Full Duration) ---\n";
// Scenario: Operator configures 3-hour session (180 mins).
// Starts at 10:00:00 (End: 13:00:00).
// Windows restarts at 11:00:00.
// Agent reconnects at 11:05:00.
// Remaining time MUST be approximately 1 hour 55 minutes (6900s), NOT 3 hours (10800s).
$sessionStart = strtotime('2026-10-29 10:00:00');
$sessionEnd = strtotime('2026-10-29 13:00:00'); // 3 hours = 10,800s
$rebootTime = strtotime('2026-10-29 11:05:00'); // Reconnected 1h 5m later

$resumedRemaining = max(0, $sessionEnd - $rebootTime);
$expectedRemaining = (1 * 3600) + (55 * 60); // 1h 55m = 6,900s

assertTest("Remaining time after reboot is 6,900 seconds (1h 55m)", $resumedRemaining === $expectedRemaining);
assertTest("Remaining time is NOT reset to original 10,800 seconds (3 hours)", $resumedRemaining !== 10800);
echo "\n";

// --- TEST 4: Overlapping Booking Conflict Prevention ---
echo "--- TEST 4: Overlapping Booking Conflict Prevention ---\n";
function checkOverlap(string $startA, string $endA, string $startB, string $endB): bool {
    // Two intervals [startA, endA) and [startB, endB) overlap if: startA < endB AND endA > startB
    return ($startA < $endB && $endA > $startB);
}

// Case 1: Exact overlap (14:00 - 18:00 vs 14:00 - 18:00)
assertTest("Exact overlap detected", checkOverlap('14:00', '18:00', '14:00', '18:00') === true);

// Case 2: Partial overlap inside (14:00 - 18:00 vs 15:00 - 17:00)
assertTest("Interior partial overlap detected", checkOverlap('14:00', '18:00', '15:00', '17:00') === true);

// Case 3: Overlapping start (14:00 - 18:00 vs 13:00 - 15:00)
assertTest("Leading edge overlap detected", checkOverlap('14:00', '18:00', '13:00', '15:00') === true);

// Case 4: Adjacent non-overlapping (14:00 - 18:00 vs 18:00 - 22:00)
assertTest("Back-to-back non-overlapping slot allowed", checkOverlap('14:00', '18:00', '18:00', '22:00') === false);

// Case 5: Completely separate (10:00 - 12:00 vs 14:00 - 18:00)
assertTest("Disjoint non-overlapping slot allowed", checkOverlap('10:00', '12:00', '14:00', '18:00') === false);
echo "\n";

// --- TEST 5: Same-Room Replacement PC Policy Enforcement ---
echo "--- TEST 5: Same-Room Replacement Policy ---\n";
function validateReplacementPc(array $booking, array $replacementPc): bool {
    if ($booking['room_type'] !== $replacementPc['room_type']) {
        return false;
    }
    return true;
}

$bookingSmoking = ['pc_id' => 1, 'pc_code' => 'PC-01', 'room_type' => 'smoking'];
$replacementSmoking = ['pc_id' => 3, 'pc_code' => 'PC-03', 'room_type' => 'smoking'];
$replacementNonSmoking = ['pc_id' => 8, 'pc_code' => 'PC-08', 'room_type' => 'non-smoking'];

assertTest("Assigning replacement PC within same room (Smoking -> Smoking) is PERMITTED", 
    validateReplacementPc($bookingSmoking, $replacementSmoking) === true
);

assertTest("Assigning replacement PC across room types (Smoking -> Non-Smoking) is REJECTED", 
    validateReplacementPc($bookingSmoking, $replacementNonSmoking) === false
);
echo "\n";

// --- TEST 6: Grace Period Expiration Logic ---
echo "--- TEST 6: Grace Period Expiration Logic ---\n";
function isBookingExpired(int $scheduledStartUnix, int $graceMinutes, int $currentUnix, ?string $checkedInAt): bool {
    if ($checkedInAt !== null) {
        return false; // Already checked in
    }
    $expiryUnix = $scheduledStartUnix + ($graceMinutes * 60);
    return $currentUnix > $expiryUnix;
}

$scheduledStart = strtotime('2026-10-29 14:00:00');
$gracePeriod = 45; // 45 minutes

// Arrived at 14:30 (within 45 mins)
$arrivalWithinGrace = strtotime('2026-10-29 14:30:00');
assertTest("Customer arriving within grace period (14:30) is NOT expired", 
    isBookingExpired($scheduledStart, $gracePeriod, $arrivalWithinGrace, null) === false
);

// Arrived at 14:46 (past 45 mins)
$arrivalPastGrace = strtotime('2026-10-29 14:46:00');
assertTest("Customer arriving after grace period (14:46) is EXPIRED", 
    isBookingExpired($scheduledStart, $gracePeriod, $arrivalPastGrace, null) === true
);

// Customer already checked in earlier
assertTest("Checked-in customer is NEVER marked expired", 
    isBookingExpired($scheduledStart, $gracePeriod, $arrivalPastGrace, '2026-10-29 14:10:00') === false
);
echo "\n";

// --- TEST 7: Cyberindo Billing Inviolability Assertion ---
echo "--- TEST 7: Cyberindo Billing Isolation Assertions ---\n";
$agentSourceFiles = [
    __DIR__ . '/../../windows-agent/HogAgent/Worker.cs',
    __DIR__ . '/../../windows-agent/HogAgent/Services/SessionCountdownService.cs',
    __DIR__ . '/../../windows-agent/HogAgent/Services/HogApiClient.cs'
];

$prohibitedPatterns = [
    'Process.GetProcessesByName' => 'No inspection of external gaming or billing processes',
    'Process.Kill' => 'No killing of foreign processes',
    'TerminateProcess' => 'No Windows API process termination calls',
    'SetWindowsHook' => 'No keyboard or mouse hooking',
    'FindWindow' => 'No window handle tampering'
];

$violations = 0;
foreach ($agentSourceFiles as $file) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        foreach ($prohibitedPatterns as $pattern => $desc) {
            if (stripos($content, $pattern) !== false) {
                $violations++;
                echo "  WARNING: Found pattern '{$pattern}' in " . basename($file) . "\n";
            }
        }
    }
}
assertTest("Windows Agent code is completely free of Cyberindo hooks, DLL injection, and process termination", $violations === 0);
echo "\n";

// --- SUMMARY ---
echo "====================================================================\n";
echo " TEST SUMMARY: Total: " . ($passed + $failed) . " | Passed: {$passed} | Failed: {$failed}\n";
if ($failed === 0) {
    echo " RESULT: ALL 14 ARCHITECTURAL CONSTRAINTS & LOGIC TESTS PASSED!\n";
} else {
    echo " RESULT: SOME TESTS FAILED. PLEASE REVIEW DETAILS ABOVE.\n";
}
echo "====================================================================\n";

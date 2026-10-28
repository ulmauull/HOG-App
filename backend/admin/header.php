<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../src/Auth.php';

use Hog\Auth;

$admin = Auth::requireAdmin();
$currentPage = basename($_SERVER['PHP_SELF']);
?>
<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= $pageTitle ?? 'Admin Dashboard' ?> — Home Of Gamers (HOG)</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "surface-base": "#0B0E14",
            "surface-card": "#12161F",
            "surface-elevated": "#1A202C",
            "surface-container": "#1D2026",
            "surface-container-high": "#272A31",
            "primary-container": "#00FF66",
            "on-primary-fixed": "#002107",
            "secondary": "#69D7DE",
            "status-available": "#00FF66",
            "status-in-use": "#78E5EC",
            "status-reserved": "#B993FF",
            "status-offline": "#4A5568"
          }
        }
      }
    };
  </script>
  <style>
    body { font-family: 'Geist', sans-serif; }
    h1, h2, h3, .font-display { font-family: 'Space Grotesk', sans-serif; }
    ::-webkit-scrollbar { display: none; }
  </style>
</head>
<body class="bg-surface-base text-gray-200 min-h-screen flex flex-col">
  <!-- Top Navigation Bar -->
  <header class="bg-surface-card border-b border-gray-800 sticky top-0 z-40 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <a href="index.php" class="flex items-center gap-2 group">
          <div class="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-fixed font-bold shadow-[0_0_15px_rgba(0,255,102,0.4)]">
            <span class="material-symbols-outlined text-lg">sports_esports</span>
          </div>
          <span class="font-bold text-lg text-white font-display uppercase tracking-wider group-hover:text-primary-container transition-colors">
            HOG Operations
          </span>
        </a>

        <!-- Desktop Nav Links -->
        <nav class="hidden md:flex items-center gap-1">
          <?php
          $navItems = [
            'index.php' => ['label' => 'Overview', 'icon' => 'dashboard'],
            'pcs.php' => ['label' => 'PC Mapping (12 Rig)', 'icon' => 'desktop_windows'],
            'bookings.php' => ['label' => 'Reservasi &amp; Kasir', 'icon' => 'receipt_long'],
            'packages.php' => ['label' => 'Paket Billing', 'icon' => 'sell'],
            'settings.php' => ['label' => 'Pengaturan', 'icon' => 'tune'],
            'audit.php' => ['label' => 'Audit Log', 'icon' => 'history']
          ];
          foreach ($navItems as $url => $item):
            $isActive = ($currentPage === $url);
          ?>
            <a href="<?= $url ?>" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors <?= $isActive ? 'bg-surface-elevated text-primary-container font-semibold' : 'text-gray-400 hover:text-white hover:bg-surface-container' ?>">
              <span class="material-symbols-outlined text-[18px]"><?= $item['icon'] ?></span>
              <span><?= $item['label'] ?></span>
            </a>
          <?php endforeach; ?>
        </nav>
      </div>

      <!-- User Profile & Logout -->
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 text-sm text-gray-300">
          <span class="w-2 h-2 rounded-full bg-status-available animate-pulse"></span>
          <span class="font-medium hidden sm:inline"><?= htmlspecialchars($admin['full_name']) ?></span>
          <span class="text-xs uppercase px-2 py-0.5 rounded bg-gray-800 text-gray-400"><?= htmlspecialchars($admin['role']) ?></span>
        </div>
        <a href="logout.php" class="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-red-950/70 hover:text-red-400 text-gray-400 text-xs font-semibold transition-colors flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">logout</span>
          <span class="hidden sm:inline">Keluar</span>
        </a>
      </div>
    </div>
  </header>

  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

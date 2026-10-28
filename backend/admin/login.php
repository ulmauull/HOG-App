<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../src/Auth.php';

use Hog\Auth;

$admin = Auth::getAuthenticatedAdmin();
if ($admin) {
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Admin Login — Home Of Gamers (HOG)</title>
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
            "primary-container": "#00ff66",
            "on-primary-fixed": "#002107",
            "secondary": "#69d7de"
          }
        }
      }
    };
  </script>
</head>
<body class="bg-surface-base text-gray-200 min-h-screen flex items-center justify-center p-4">
  <div class="w-full max-w-md bg-surface-card rounded-2xl shadow-2xl p-8 border border-gray-800 relative overflow-hidden">
    <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="flex flex-col items-center gap-3 text-center mb-8 relative z-10">
      <div class="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary-fixed shadow-[0_0_25px_rgba(0,255,102,0.4)]">
        <span class="material-symbols-outlined text-[32px]">sports_esports</span>
      </div>
      <div>
        <h1 class="font-bold text-2xl text-white tracking-tight" style="font-family: 'Space Grotesk', sans-serif;">HOG Admin Portal</h1>
        <p class="text-sm text-gray-400 mt-1">Sistem Manajemen PC &amp; Billing Lounge</p>
      </div>
    </div>

    <div id="errorAlert" class="hidden mb-6 p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-sm flex items-center gap-2">
      <span class="material-symbols-outlined text-lg">error</span>
      <span id="errorMessage">Error</span>
    </div>

    <form id="loginForm" class="flex flex-col gap-5 relative z-10">
      <div>
        <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Username</label>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-3 text-gray-500 text-lg">person</span>
          <input type="text" id="username" required autofocus placeholder="admin"
            class="w-full pl-10 pr-4 py-2.5 bg-surface-base border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-container transition-colors font-medium">
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Password</label>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-3 text-gray-500 text-lg">lock</span>
          <input type="password" id="password" required placeholder="••••••••"
            class="w-full pl-10 pr-4 py-2.5 bg-surface-base border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-container transition-colors font-medium">
        </div>
      </div>

      <button type="submit" id="btnSubmit"
        class="w-full py-3 rounded-lg bg-primary-container text-on-primary-fixed font-bold hover:shadow-[0_0_25px_rgba(0,255,102,0.4)] transition-all flex items-center justify-center gap-2 mt-2">
        <span>Masuk ke Dashboard</span>
        <span class="material-symbols-outlined text-lg">login</span>
      </button>
    </form>

    <div class="mt-8 pt-6 border-t border-gray-800/80 text-center text-xs text-gray-500">
      Default Access: <code class="text-primary-container font-mono">admin</code> / <code class="text-primary-container font-mono">Admin@HOG2025!</code>
    </div>
  </div>

  <script>
    const form = document.getElementById('loginForm');
    const alertBox = document.getElementById('errorAlert');
    const alertMsg = document.getElementById('errorMessage');
    const btn = document.getElementById('btnSubmit');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      alertBox.classList.add('hidden');
      btn.disabled = true;
      btn.innerHTML = '<span class="material-symbols-outlined text-lg animate-spin">progress_activity</span> Memverifikasi...';

      try {
        const res = await fetch('../api/v1/admin/auth.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
          })
        });
        const data = await res.json();
        if (data.success) {
          window.location.href = 'index.php';
        } else {
          alertMsg.textContent = data.error || 'Login gagal.';
          alertBox.classList.remove('hidden');
        }
      } catch (err) {
        alertMsg.textContent = 'Gagal terhubung ke server backend API.';
        alertBox.classList.remove('hidden');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>Masuk ke Dashboard</span><span class="material-symbols-outlined text-lg">login</span>';
      }
    });
  </script>
</body>
</html>

# Home Of Gamers (HOG) - Production Deployment & Operations Guide

This guide walks through deploying the HOG PC Management & Booking System on shared hosting / VPS and installing the Windows Agent across all 12 client gaming PCs (`PC-01` through `PC-12`).

---

## 1. Environment Requirements

### Server / Hosting
- **Operating System**: Linux (Ubuntu, Debian, AlmaLinux) or Windows Server.
- **Web Server**: Apache with `mod_rewrite` enabled OR Nginx.
- **PHP**: PHP 8.1, 8.2, or 8.3 with extensions:
  - `pdo` and `pdo_mysql`
  - `json`
  - `mbstring`
  - `curl`
  - `fileinfo` (for MIME-type validation)
- **Database**: MySQL 8.0+ or MariaDB 10.4+.
- **SSL / HTTPS**: Mandatory for secure Agent telemetry and payment proof uploads.
- **Node.js**: **NOT REQUIRED** for production runtime.

### Gaming Client PCs (12 Units)
- **Operating System**: Windows 10 (64-bit) or Windows 11 (64-bit).
- **Runtime**: [.NET 8 Desktop Runtime (x64)](https://dotnet.microsoft.com/download/dotnet/8.0) or run self-contained binary.
- **Network**: Outbound HTTPS (port 443) access to the HOG server.

---

## 2. Step 1: Database Setup

1. Log into phpMyAdmin or MySQL CLI on your database server.
2. Create a new database with `utf8mb4` encoding:
   ```sql
   CREATE DATABASE hog_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Import the schema script located at `database/schema.sql`:
   ```bash
   mysql -u hog_user -p hog_db < database/schema.sql
   ```
4. Verify that 11 tables are created:
   - `admins`, `pcs`, `pc_agents`, `packages`, `customers`, `bookings`, `payments`, `sessions`, `heartbeat_logs`, `audit_logs`, `system_settings`.
5. Verify default seeded data:
   - 12 PCs: `PC-01` to `PC-06` (Smoking Room), `PC-07` to `PC-12` (Non-Smoking Room).
   - 4 Packages: Paket Pagi (Rp 30.000), Paket Siang (Rp 40.000), Paket Malam (Rp 45.000), Custom 2 Jam (Rp 20.000).
   - Default Administrator: `admin` / `Admin@HOG2025!`
   - Pre-hashed agent keys for `PC-01` through `PC-12`.

---

## 3. Step 2: Backend Configuration

1. Copy or edit `backend/config/config.php`:
   ```php
   define('HOG_DB_HOST', 'localhost');
   define('HOG_DB_NAME', 'hog_db');
   define('HOG_DB_USER', 'hog_user');
   define('HOG_DB_PASS', 'YourSecurePasswordHere!');
   define('HOG_TIMEZONE', 'Asia/Jakarta');
   ```

2. Configure Upload Permissions:
   Create an `uploads` directory inside `backend/` and set write permissions:
   ```bash
   mkdir -p backend/uploads
   chmod 775 backend/uploads
   ```

3. Web Server Configuration:

   **For Apache (`.htaccess` is included in `backend/`):**
   ```apache
   RewriteEngine On
   # Allow direct file access
   RewriteCond %{REQUEST_FILENAME} -f
   RewriteRule ^ - [L]
   ```

   **For Nginx:**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name hog.example.com;

       root /var/www/hog/backend;
       index index.php index.html;

       client_max_body_size 10M;

       location / {
           try_files $uri $uri/ /index.php?$query_string;
       }

       location ~ \.php$ {
           include snippets/fastcgi-php.conf;
           fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
       }

       location /uploads/ {
           # Prevent script execution inside uploads
           location ~ \.(php|phtml|sh|py)$ {
               deny all;
           }
       }
   }
   ```

---

## 4. Step 3: Windows Agent Compilation & Deployment

The Windows Agent runs as a native Windows Background Service independently from Cyberindo Billing.

### 4.1. Compile the Agent Binary
From the developer machine with .NET 8 SDK installed:
```powershell
cd windows-agent\HogAgent
dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -o ..\dist
```
This produces a single, self-contained executable `HogAgent.exe` in `windows-agent\dist\` that runs on any 64-bit Windows machine without requiring prior .NET installations.

### 4.2. Agent Configuration Table for 12 PCs

Deploy the compiled files to each PC at `C:\Program Files\HogAgent\`. Configure `appsettings.json` on each individual PC with its assigned identity:

| PC Identifier | Room Assignment | Raw Secret Key |
|---|---|---|
| **PC-01** | Smoking Room | `HOG_SECRET_TOKEN_PC01` |
| **PC-02** | Smoking Room | `HOG_SECRET_TOKEN_PC02` |
| **PC-03** | Smoking Room | `HOG_SECRET_TOKEN_PC03` |
| **PC-04** | Smoking Room | `HOG_SECRET_TOKEN_PC04` |
| **PC-05** | Smoking Room | `HOG_SECRET_TOKEN_PC05` |
| **PC-06** | Smoking Room | `HOG_SECRET_TOKEN_PC06` |
| **PC-07** | Non-Smoking Room | `HOG_SECRET_TOKEN_PC07` |
| **PC-08** | Non-Smoking Room | `HOG_SECRET_TOKEN_PC08` |
| **PC-09** | Non-Smoking Room | `HOG_SECRET_TOKEN_PC09` |
| **PC-10** | Non-Smoking Room | `HOG_SECRET_TOKEN_PC10` |
| **PC-11** | Non-Smoking Room | `HOG_SECRET_TOKEN_PC11` |
| **PC-12** | Non-Smoking Room | `HOG_SECRET_TOKEN_PC12` |

Sample `appsettings.json` for **PC-03**:
```json
{
  "HogAgent": {
    "ApiBaseUrl": "https://hog.example.com/backend/api/v1",
    "PcCode": "PC-03",
    "AgentKey": "HOG_SECRET_TOKEN_PC03",
    "HeartbeatIntervalSeconds": 15,
    "OfflineThresholdSeconds": 60,
    "AutoStartSessionOnStartup": false,
    "DefaultSessionMinutes": 180
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  }
}
```

### 4.3. Installing as a Windows Service

Open **PowerShell as Administrator** on the gaming PC and execute:
```powershell
cd "C:\Program Files\HogAgent"
powershell -ExecutionPolicy Bypass -File install-service.ps1
```

This registers the service with `sc.exe`, configures automatic startup (`StartType=Automatic`), and sets restart recovery policies so the service restarts immediately if interrupted.

To verify service status:
```powershell
Get-Service HogAgent
```

---

## 5. Step 4: Verification Checklist

1. **Public Website**: Open `https://hog.example.com/backend/public/index.php`. Confirm the 12-rig availability grid is displaying live status without console errors.
2. **Admin Portal**: Open `https://hog.example.com/backend/admin/login.php`. Log in with `admin` / `Admin@HOG2025!`. Verify the dashboard overview cards render 12 PCs.
3. **Agent Connectivity**: Once the service is started on a test PC (e.g. `PC-01`), refresh the admin PC mapping. `PC-01` status should transition from `offline` to `online` with a recent heartbeat timestamp (< 15 seconds ago).
4. **Immediate Password Rotation**: Change the default administrator password in `backend/admin/settings.php`.

---

## 6. Troubleshooting & Operational FAQ

### Q1: The Admin Dashboard shows "Status PC sementara tidak dapat diperbarui"?
- Check database connection credentials in `backend/config/config.php`.
- Check web server error logs (`error.log`).

### Q2: Agent logs show `HttpRequestException: The SSL connection could not be established`?
- Verify that your server's SSL certificate is valid and issued by a recognized CA (e.g., Let's Encrypt). Self-signed certificates without local root CA trust will be rejected by .NET `HttpClient`.

### Q3: How do I test the Agent in console mode without installing the Windows Service?
- Execute `run-standalone.bat` from the `windows-agent\` folder. The agent will run interactively in the command prompt with real-time logging output.

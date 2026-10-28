# Home Of Gamers (HOG) — Windows Session Agent

Agen Windows Service berbasis .NET 8 untuk 12 Gaming PC (PC-01 s/d PC-12) di Home Of Gamers lounge.

> **PENTING: Independen dari Cyberindo Billing**  
> Agen ini beroperasi mandiri dan **TIDAK** memodifikasi, menginjeksi, mematikan proses, atau mengganggu aplikasi Cyberindo Billing yang sudah terpasang.

---

## 1. Arsitektur & Perilaku Agen

- **Startup Otomatis**: Berjalan sebagai Windows Service otomatis saat PC dinyalakan.
- **Autentikasi Aman**: Setiap PC memiliki identitas unik (`pc_code`) dan API key rahasia yang dicocokkan dengan hash SHA-256 di backend.
- **Restart Recovery**: Jika PC restart di tengah sesi aktif, agen **TIDAK** mereset hitungan timer ke awal. Agen menyelaraskan dengan end-timestamp otoritatif dari server:
  $$\text{remaining\_seconds} = \max(0, \text{session\_end\_timestamp} - \text{server\_current\_timestamp})$$
- **Heartbeat & Telemetri**: Mengirim sinyal detak jantung berkala setiap 15 detik (dapat dikonfigurasi) untuk melaporkan konektivitas dan kesehatan rig.
- **Reconciliation Pasca Offline**: Jika jaringan internet sempat putus, countdown lokal tetap berjalan dan otomatis rekonsiliasi saat koneksi pulih kembali.

---

## 2. Kredensial Registrasi 12 PC

Setiap PC dipasang dengan file `appsettings.json` yang berisi kode PC dan API key masing-masing:

| PC Code | Ruangan | Default API Key |
|---|---|---|
| **PC-01** | Smoking Room | `HOG_SECRET_AGENT_KEY_PC01_2025` |
| **PC-02** | Smoking Room | `HOG_SECRET_AGENT_KEY_PC02_2025` |
| **PC-03** | Smoking Room | `HOG_SECRET_AGENT_KEY_PC03_2025` |
| **PC-04** | Smoking Room | `HOG_SECRET_AGENT_KEY_PC04_2025` |
| **PC-05** | Smoking Room | `HOG_SECRET_AGENT_KEY_PC05_2025` |
| **PC-06** | Smoking Room | `HOG_SECRET_AGENT_KEY_PC06_2025` |
| **PC-07** | Non-Smoking VIP | `HOG_SECRET_AGENT_KEY_PC07_2025` |
| **PC-08** | Non-Smoking VIP | `HOG_SECRET_AGENT_KEY_PC08_2025` |
| **PC-09** | Non-Smoking VIP | `HOG_SECRET_AGENT_KEY_PC09_2025` |
| **PC-10** | Non-Smoking VIP | `HOG_SECRET_AGENT_KEY_PC10_2025` |
| **PC-11** | Non-Smoking VIP | `HOG_SECRET_AGENT_KEY_PC11_2025` |
| **PC-12** | Non-Smoking VIP | `HOG_SECRET_AGENT_KEY_PC12_2025` |

---

## 3. Konfigurasi (`appsettings.json`)

Contoh konfigurasi pada PC-01:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "HogAgent": {
    "BackendUrl": "https://billing.homeofgamers.id",
    "PcCode": "PC-01",
    "ApiKey": "HOG_SECRET_AGENT_KEY_PC01_2025",
    "HeartbeatIntervalSeconds": 15,
    "AutoStartSessionOnBoot": true,
    "DefaultDurationMinutes": 120,
    "AgentVersion": "1.0.0"
  }
}
```

---

## 4. Cara Pengujian & Pemasangan

### A. Mode Pengujian (Standalone Console)
Untuk menguji coba tanpa menginstal service:
1. Masuk ke folder agen:
   ```cmd
   cd windows-agent\HogAgent
   dotnet run -c Release
   ```
2. Atau jalankan file: `run-standalone.bat`.
3. Periksa log konsol untuk memastikan koneksi heartbeat berhasil diterima oleh server.

### B. Mode Produksi (Windows Service Otomatis)
1. Buka PowerShell sebagai **Administrator**.
2. Jalankan perintah instalasi:
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process
   .\windows-agent\install-service.ps1 -PcCode "PC-01"
   ```
3. Layanan `HogSessionAgent` akan terdaftar dan otomatis menyala setiap kali komputer di-boot.

### C. Menghapus Service
Jika ingin uninstall layanan:
```powershell
.\windows-agent\uninstall-service.ps1
```

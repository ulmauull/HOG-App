const { createClient } = require('@supabase/supabase-js');

const url = 'https://hslleuuyfmaqpajjmwie.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzbGxldXV5Zm1hcXBhamptd2llIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzIxNTU1NywiZXhwIjoyMTA4NzkxNTU3fQ.8eA5rtz8ZUust_twA8MMyjSRnabdpnZEC2YFkkZLNxo';
const supabase = createClient(url, serviceKey);

async function syncAll() {
  console.log('--- 1. Syncing 12 PCs ---');
  const pcSpecs = [
    { code: 'PC-01', room: 'smoking', gpu: 'RTX 4060 Ti', cpu: 'i7 Gen 14', display: '360 (OC 390) Hz', cooling: 'FAN', smoke: 'YA' },
    { code: 'PC-02', room: 'smoking', gpu: 'RTX 4060 Ti', cpu: 'i5 Gen 12', display: '300 Hz', cooling: 'FAN', smoke: 'YA' },
    { code: 'PC-03', room: 'smoking', gpu: 'RX 6600', cpu: 'i5 Gen 12', display: '240 (OC 270) Hz', cooling: 'FAN', smoke: 'YA' },
    { code: 'PC-04', room: 'smoking', gpu: 'RTX 3070', cpu: 'i5 Gen 12', display: '240 (OC 270) Hz', cooling: 'FAN', smoke: 'YA' },
    { code: 'PC-05', room: 'smoking', gpu: 'RTX 4060 Ti', cpu: 'i5 Gen 12', display: '360 (OC 390) Hz', cooling: 'FAN', smoke: 'YA' },
    { code: 'PC-06', room: 'smoking', gpu: 'RTX 4060 Ti', cpu: 'i5 Gen 12', display: '360 (OC 390) Hz', cooling: 'FAN', smoke: 'YA' },
    { code: 'PC-07', room: 'smoking', gpu: 'RTX 4060 Ti', cpu: 'i5 Gen 12', display: '240 (OC 270) Hz', cooling: 'FAN', smoke: 'FLEXIBLE' },
    { code: 'PC-08', room: 'non-smoking', gpu: 'RTX 4060 Ti', cpu: 'i5 Gen 12', display: '360 (OC 390) Hz', cooling: 'AC', smoke: 'NO' },
    { code: 'PC-09', room: 'non-smoking', gpu: 'RTX 4060 Ti', cpu: 'i5 Gen 13', display: '240 (OC 270) Hz', cooling: 'AC', smoke: 'NO' },
    { code: 'PC-10', room: 'non-smoking', gpu: 'RTX 4070 SU', cpu: 'i7 Gen 14', display: '300 Hz', cooling: 'AC', smoke: 'NO' },
    { code: 'PC-11', room: 'non-smoking', gpu: 'RTX 4070 SU', cpu: 'i7 Gen 14', display: '300 Hz', cooling: 'AC', smoke: 'NO' },
    { code: 'PC-12', room: 'non-smoking', gpu: 'RTX 4070 SU', cpu: 'i7 Gen 14', display: '300 Hz', cooling: 'AC', smoke: 'NO' }
  ];

  const peripherals = 'Gamen III, MXRSKEY Rapid Trigger & Leobog A80 HE Rapid Trigger • Logitech G 203 / G 102 • HyperX';

  for (const pc of pcSpecs) {
    const { error } = await supabase.from('pcs').update({
      room_type: pc.room,
      specs_gpu: `${pc.gpu} • ${pc.cpu}`,
      specs_display: `${pc.display} • ${pc.cooling} (${pc.smoke === 'YA' ? 'Smoking' : pc.smoke === 'NO' ? 'Non-Smoking' : 'Flexible'})`,
      specs_peripherals: peripherals
    }).eq('pc_code', pc.code);
    if (error) console.error(`Error updating ${pc.code}:`, error.message);
    else console.log(`✓ ${pc.code} synced.`);
  }

  console.log('\n--- 2. Syncing 13 Packages ---');
  // First clean old packages
  const { error: delError } = await supabase.from('packages').delete().neq('id', 0);
  if (delError) console.error('Error clearing packages:', delError.message);

  const packages = [
    { name: '30 Menit Regular', room_type: 'all', duration_minutes: 30, price: 5000, description: 'Waktu: 30 Menit | Bonus: - | Expired: 3 Bulan', is_active: 1 },
    { name: '1 Jam Regular', room_type: 'all', duration_minutes: 60, price: 10000, description: 'Waktu: 1 Jam | Bonus: - | Expired: 3 Bulan', is_active: 1 },
    { name: '2 Jam Regular', room_type: 'all', duration_minutes: 120, price: 20000, description: 'Waktu: 2 Jam | Bonus: - | Expired: 3 Bulan', is_active: 1 },
    { name: '3 Jam Regular', room_type: 'all', duration_minutes: 180, price: 30000, description: 'Waktu: 3 Jam | Bonus: 30 Menit | Expired: 3 Bulan', is_active: 1 },
    { name: '4 Jam Regular', room_type: 'all', duration_minutes: 240, price: 40000, description: 'Waktu: 4 Jam | Bonus: 40 Menit | Expired: 3 Bulan', is_active: 1 },
    { name: '5 Jam Regular', room_type: 'all', duration_minutes: 300, price: 50000, description: 'Waktu: 5 Jam | Bonus: 50 Menit | Expired: 3 Bulan', is_active: 1 },
    { name: 'Paket Mabar 2 PC', room_type: 'all', duration_minutes: 300, price: 70000, description: 'Waktu: 5 Jam Masing-Masing PC | Bonus: - | Exp Ketika Waktu Selesai', is_active: 1 },
    { name: 'Paket 12 Jam', room_type: 'all', duration_minutes: 720, price: 90000, description: 'Waktu: 12 Jam Marathon | Bonus: - | Exp Ketika Waktu Selesai', is_active: 1 },
    { name: 'Paket 24 Jam', room_type: 'all', duration_minutes: 1440, price: 150000, description: 'Waktu: 24 Jam Seharian Penuh | Bonus: - | Exp Ketika Waktu Selesai', is_active: 1 },
    { name: 'Paket Pagi*', room_type: 'all', duration_minutes: 360, price: 40000, description: 'Datang jam 05:00 - 10:00 dapat 6 Jam | Exp Ketika Waktu Selesai', is_active: 1 },
    { name: 'Paket Siang**', room_type: 'all', duration_minutes: 360, price: 40000, description: 'Datang jam 11:00 - 15:00 dapat 6 Jam | Exp Ketika Waktu Selesai', is_active: 1 },
    { name: 'Paket Malam***', room_type: 'all', duration_minutes: 540, price: 50000, description: 'Datang jam 20:00 - 02:00 dapat 9 Jam | Exp Ketika Waktu Selesai', is_active: 1 },
    { name: 'War Tiket', room_type: 'all', duration_minutes: 300, price: 45000, description: 'Waktu: 5 Jam | Prioritas Speed 1 Gbps | Exp Ketika Waktu Selesai', is_active: 1 }
  ];

  const { data: insertedPkgs, error: insertError } = await supabase.from('packages').insert(packages).select();
  if (insertError) console.error('Error inserting packages:', insertError.message);
  else console.log(`✓ Inserted ${insertedPkgs.length} packages into Supabase.`);

  console.log('\n--- 3. Syncing System Settings ---');
  const settings = [
    { setting_key: 'network_speed', setting_value: '1 Gbps (Backup 500 Mbps)', description: 'Kecepatan internet resmi HOG' },
    { setting_key: 'free_download_policy', setting_value: 'BEBAS DOWNLOAD GAME YANG KAMU MAU TANPA REQUEST DARI OPERATOR', description: 'Ketentuan bebas download game' },
    { setting_key: 'booking_whatsapp', setting_value: '0878-7867-2111', description: 'Kontak WhatsApp resmi reservasi HOG' },
    { setting_key: 'min_booking_hours', setting_value: '3', description: 'Minimal reservasi booking PC via WhatsApp/Website' }
  ];

  for (const s of settings) {
    const { error } = await supabase.from('system_settings').upsert(s, { onConflict: 'setting_key' });
    if (error) console.error(`Error upserting setting ${s.setting_key}:`, error.message);
    else console.log(`✓ Setting ${s.setting_key} synced.`);
  }

  console.log('\n=== ALL SUPABASE DATA SYNCED SUCCESSFULLY! ===');
}

syncAll().catch(console.error);


import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

interface PCRow {
  id: number
  pc_code: string
  room_type: string
  specs_gpu: string
  specs_cpu: string
  specs_display: string
  is_enabled: number
  current_session_id: number | null
  scheduled_end_time?: string | null
  session_status?: string | null
}

interface PendingBooking {
  id: number
  booking_code: string
  customer_name: string
  customer_phone: string
  pc_code: string
  room_type: string
  booking_date: string
  start_time: string
  end_time: string
  total_price: number
  payment_method: string
}

interface WalkinForm {
  pc_id: string
  customer_name: string
  customer_phone: string
  duration_minutes: string
  notes: string
}

export default function Dashboard() {
  const [pcs, setPcs] = useState<PCRow[]>([])
  const [pending, setPending] = useState<PendingBooking[]>([])
  const [availablePcs, setAvailablePcs] = useState<PCRow[]>([])
  const [stats, setStats] = useState({ total: 0, available: 0, active: 0, reserved: 0, offline: 0, pendingCount: 0 })
  const [showWalkin, setShowWalkin] = useState(false)
  const [walkinForm, setWalkinForm] = useState<WalkinForm>({ pc_id: '', customer_name: '', customer_phone: '', duration_minutes: '120', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const load = useCallback(async () => {
    // Fetch PCs with active sessions
    const { data: pcData } = await supabase
      .from('pcs')
      .select(`
        id, pc_code, room_type, specs_gpu, specs_cpu, specs_display, is_enabled, current_session_id,
        sessions!pcs_current_session_id_fkey(scheduled_end_time, status)
      `)
      .order('id')

    const pcList: PCRow[] = (pcData || []).map((p: any) => ({
      ...p,
      scheduled_end_time: p.sessions?.scheduled_end_time ?? null,
      session_status: p.sessions?.status ?? null,
    }))
    setPcs(pcList)
    setAvailablePcs(pcList.filter(p => p.is_enabled === 1 && !p.current_session_id))

    // Stats
    const now = new Date().toISOString()
    const total = pcList.length
    const active = pcList.filter(p => p.current_session_id && p.scheduled_end_time && p.scheduled_end_time > now).length
    const offline = pcList.filter(p => p.is_enabled !== 1 || (!p.current_session_id)).length
    const available = Math.max(0, total - active - offline + pcList.filter(p => p.is_enabled !== 1).length)

    const { count: pendingCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending_payment')

    const { count: reservedCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'confirmed')
      .eq('booking_date', new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }))

    setStats({ total, available: pcList.filter(p => p.is_enabled === 1 && !p.current_session_id).length, active, reserved: reservedCount ?? 0, offline: pcList.filter(p => p.is_enabled !== 1).length, pendingCount: pendingCount ?? 0 })

    // Pending payments
    const { data: pendingData } = await supabase
      .from('bookings')
      .select(`id, booking_code, booking_date, start_time, end_time, total_price, room_type,
               customers!bookings_customer_id_fkey(name, phone),
               pcs!bookings_pc_id_fkey(pc_code),
               payments!payments_booking_id_fkey(payment_method)`)
      .eq('status', 'pending_payment')
      .order('id', { ascending: false })
      .limit(5)

    const pendingList: PendingBooking[] = (pendingData || []).map((b: any) => ({
      id: b.id,
      booking_code: b.booking_code,
      customer_name: b.customers?.name ?? '-',
      customer_phone: b.customers?.phone ?? '-',
      pc_code: b.pcs?.pc_code ?? '-',
      room_type: b.room_type,
      booking_date: b.booking_date,
      start_time: b.start_time,
      end_time: b.end_time,
      total_price: b.total_price,
      payment_method: b.payments?.payment_method ?? '-',
    }))
    setPending(pendingList)
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, 10000)
    return () => clearInterval(interval)
  }, [load])

  const approvePayment = async (id: number) => {
    if (!confirm('Setujui pembayaran dan konfirmasi reservasi ini?')) return
    await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', id)
    await supabase.from('payments').update({ payment_status: 'paid' }).eq('booking_id', id)
    showToast('Pembayaran dikonfirmasi!')
    load()
  }

  const rejectPayment = async (id: number) => {
    const reason = prompt('Alasan penolakan:')
    if (reason === null) return
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
    await supabase.from('payments').update({ payment_status: 'failed', rejection_reason: reason }).eq('booking_id', id)
    showToast('Pembayaran ditolak.', 'error')
    load()
  }

  const handleWalkin = async () => {
    if (!walkinForm.pc_id || !walkinForm.customer_name) {
      showToast('PC dan nama customer wajib diisi!', 'error')
      return
    }
    setSubmitting(true)
    try {
      // Upsert customer
      const cleanPhone = walkinForm.customer_phone.replace(/\D/g, '')
      let customerId: number | null = null
      if (cleanPhone) {
        const { data: existing } = await supabase.from('customers').select('id').eq('phone', cleanPhone).limit(1)
        if (existing && existing.length > 0) {
          customerId = existing[0].id
        } else {
          const { data: newCust } = await supabase.from('customers').insert({ name: walkinForm.customer_name, phone: cleanPhone }).select('id')
          customerId = newCust?.[0]?.id ?? null
        }
      } else {
        const { data: newCust } = await supabase.from('customers').insert({ name: walkinForm.customer_name, phone: '0000000000' }).select('id')
        customerId = newCust?.[0]?.id ?? null
      }

      const pcId = parseInt(walkinForm.pc_id)
      const durationMin = parseInt(walkinForm.duration_minutes)
      const now = new Date()
      const startISO = now.toISOString()
      const endISO = new Date(now.getTime() + durationMin * 60000).toISOString()
      const today = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' })

      // Insert booking (walk-in)
      const { data: bookingData } = await supabase.from('bookings').insert({
        booking_code: `HOG-WALKIN-${Date.now()}`,
        customer_id: customerId,
        pc_id: pcId,
        package_id: 1,
        room_type: pcs.find(p => p.id === pcId)?.room_type ?? 'smoking',
        booking_date: today,
        start_time: timeStr,
        end_time: new Date(now.getTime() + durationMin * 60000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' }),
        duration_minutes: durationMin,
        total_price: 0,
        status: 'checked_in',
        notes: walkinForm.notes,
      }).select('id')

      const bookingId = bookingData?.[0]?.id
      if (!bookingId) throw new Error('Gagal membuat booking')

      // Insert session
      const { data: sessionData } = await supabase.from('sessions').insert({
        booking_id: bookingId,
        pc_id: pcId,
        session_code: `S-${Date.now()}`,
        scheduled_start_time: startISO,
        scheduled_end_time: endISO,
        duration_minutes: durationMin,
        status: 'active',
        start_type: 'walkin',
      }).select('id')

      const sessionId = sessionData?.[0]?.id
      if (sessionId) {
        await supabase.from('pcs').update({ current_session_id: sessionId }).eq('id', pcId)
      }

      showToast(`Sesi walk-in ${walkinForm.customer_name} berhasil dimulai!`)
      setShowWalkin(false)
      setWalkinForm({ pc_id: '', customer_name: '', customer_phone: '', duration_minutes: '120', notes: '' })
      load()
    } catch (err: any) {
      showToast('Gagal: ' + err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const now = new Date().toISOString()
  const statCards = [
    { label: 'Total PC', value: `${stats.total} Rig`, sub: '12 Unit Terdaftar', color: 'border-gray-800', textColor: 'text-white' },
    { label: 'Tersedia', value: `${stats.available} PC`, sub: 'Siap Digunakan', color: 'border-green-900 bg-green-950/10', textColor: 'text-status-available', dot: 'bg-status-available animate-pulse' },
    { label: 'Sesi Aktif', value: `${stats.active} PC`, sub: 'Sedang Berlangsung', color: 'border-cyan-900 bg-cyan-950/10', textColor: 'text-status-in-use', dot: 'bg-status-in-use' },
    { label: 'Dipesan', value: `${stats.reserved} PC`, sub: 'Reservasi Hari Ini', color: 'border-purple-900 bg-purple-950/10', textColor: 'text-status-reserved', dot: 'bg-status-reserved' },
    { label: 'Offline', value: `${stats.offline} PC`, sub: 'Dinonaktifkan', color: 'border-gray-800', textColor: 'text-gray-400', dot: 'bg-status-offline' },
    { label: 'Verifikasi', value: `${stats.pendingCount}`, sub: 'Menunggu Kasir', color: 'border-amber-900 bg-amber-950/10', textColor: 'text-amber-400', icon: '⏳' },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold transition-all ${toast.type === 'success' ? 'bg-green-900 text-status-available border border-green-700' : 'bg-red-900 text-red-300 border border-red-700'}`}>
          {toast.msg}
        </div>
      )}

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">Monitoring Operasional Real-Time</h1>
          <p className="text-sm text-gray-400 mt-0.5">Ringkasan status 12 PC gaming rig, sesi aktif, dan verifikasi kasir.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowWalkin(true)}
            className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-fixed font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,102,0.4)] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>➕</span>
            <span>Tambah Walk-In</span>
          </button>
          <button
            onClick={load}
            className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-elevated text-gray-200 text-sm font-semibold transition-colors flex items-center gap-1.5 border border-gray-700"
          >
            <span>🔄</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className={`p-4 rounded-xl bg-surface-card border ${s.color} flex flex-col justify-between`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{s.label}</span>
              {s.dot && <span className={`w-2 h-2 rounded-full ${s.dot}`} />}
              {s.icon && <span className="text-sm">{s.icon}</span>}
            </div>
            <span className={`text-2xl font-display font-bold ${s.textColor} mt-2`}>{s.value}</span>
            <span className="text-[11px] text-gray-500 mt-1">{s.sub}</span>
          </div>
        ))}
      </div>

      {/* PC Status Grid */}
      <div className="bg-surface-card rounded-2xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-primary-container">🖥</span>
            <h2 className="text-lg font-display font-bold text-white">Status Live 12 Gaming Rig</h2>
          </div>
          <span className="text-xs text-gray-400">Auto-refresh setiap 10 detik</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {pcs.map((pc) => {
            const hasSession = !!pc.current_session_id && !!pc.scheduled_end_time && pc.scheduled_end_time > now
            const isDisabled = pc.is_enabled !== 1
            let statusText = 'Tersedia'
            let dotClass = 'bg-status-available animate-pulse'
            let textClass = 'text-status-available'
            if (isDisabled) { statusText = 'Disabled'; dotClass = 'bg-status-offline'; textClass = 'text-gray-500' }
            else if (hasSession) { statusText = 'Digunakan'; dotClass = 'bg-status-in-use'; textClass = 'text-status-in-use' }

            const remSec = hasSession ? Math.max(0, Math.floor((new Date(pc.scheduled_end_time!).getTime() - Date.now()) / 1000)) : 0
            const remStr = `${String(Math.floor(remSec / 3600)).padStart(2, '0')}:${String(Math.floor((remSec % 3600) / 60)).padStart(2, '0')}:${String(remSec % 60).padStart(2, '0')}`

            return (
              <div key={pc.id} className="p-3.5 rounded-xl bg-surface-base border border-gray-800 flex flex-col justify-between gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-white">{pc.pc_code}</span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
                    {pc.room_type === 'smoking' ? 'Smk' : 'Non'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${dotClass}`} />
                    <span className={`text-xs font-semibold ${textClass}`}>{statusText}</span>
                  </div>
                  {hasSession ? (
                    <span className="text-[11px] font-mono text-status-in-use font-bold mt-1">{remStr}</span>
                  ) : (
                    <span className="text-[11px] text-gray-500 mt-1">{pc.specs_gpu?.substring(0, 14)}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pending Payments */}
      <div className="bg-surface-card rounded-2xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-amber-400">⏳</span>
            <h2 className="text-lg font-display font-bold text-white">Antrean Pembayaran Menunggu Konfirmasi</h2>
          </div>
        </div>
        {pending.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            <div className="text-3xl mb-2">✅</div>
            Tidak ada pembayaran menunggu verifikasi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs uppercase bg-surface-base text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3">Kode Booking</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">PC / Ruangan</th>
                  <th className="px-4 py-3">Jadwal</th>
                  <th className="px-4 py-3">Total Tagihan</th>
                  <th className="px-4 py-3 text-right">Aksi Kasir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {pending.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-elevated/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-white">{b.booking_code}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{b.customer_name}</div>
                      <div className="text-xs text-gray-500">{b.customer_phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-primary-container">{b.pc_code}</span>
                      <span className="text-xs text-gray-400 block capitalize">{b.room_type}</span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div>{b.booking_date}</div>
                      <div className="text-gray-400">{b.start_time?.substring(0,5)} - {b.end_time?.substring(0,5)}</div>
                    </td>
                    <td className="px-4 py-3 font-bold text-white">
                      Rp {Number(b.total_price).toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button onClick={() => approvePayment(b.id)} className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer">
                          Setujui
                        </button>
                        <button onClick={() => rejectPayment(b.id)} className="px-3 py-1 rounded bg-red-800 hover:bg-red-700 text-white text-xs font-semibold transition-colors cursor-pointer">
                          Tolak
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Walk-In Modal */}
      {showWalkin && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-surface-card border border-gray-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-5">
              <h3 className="text-lg font-display font-bold text-white">Mulai Sesi Walk-In (Langsung Main)</h3>
              <button onClick={() => setShowWalkin(false)} className="text-gray-400 hover:text-white cursor-pointer">✕</button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Pilih PC Rig</label>
                <select
                  value={walkinForm.pc_id}
                  onChange={e => setWalkinForm(f => ({ ...f, pc_id: e.target.value }))}
                  className="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium focus:border-primary-container focus:outline-none"
                >
                  <option value="">-- Pilih PC --</option>
                  {availablePcs.map(p => (
                    <option key={p.id} value={p.id}>{p.pc_code} ({p.room_type} – {p.specs_gpu})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Nama Customer</label>
                  <input
                    type="text"
                    value={walkinForm.customer_name}
                    onChange={e => setWalkinForm(f => ({ ...f, customer_name: e.target.value }))}
                    placeholder="Contoh: Budi Gaming"
                    className="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium focus:border-primary-container focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">No. WA (Opsional)</label>
                  <input
                    type="tel"
                    value={walkinForm.customer_phone}
                    onChange={e => setWalkinForm(f => ({ ...f, customer_phone: e.target.value }))}
                    placeholder="08123456789"
                    className="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium focus:border-primary-container focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Durasi Bermain</label>
                <select
                  value={walkinForm.duration_minutes}
                  onChange={e => setWalkinForm(f => ({ ...f, duration_minutes: e.target.value }))}
                  className="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium focus:border-primary-container focus:outline-none"
                >
                  <option value="60">1 Jam</option>
                  <option value="120">2 Jam</option>
                  <option value="180">3 Jam</option>
                  <option value="240">4 Jam</option>
                  <option value="300">5 Jam</option>
                  <option value="360">6 Jam</option>
                  <option value="540">9 Jam (Paket Malam)</option>
                  <option value="720">12 Jam</option>
                  <option value="1440">24 Jam</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Catatan Operator</label>
                <input
                  type="text"
                  value={walkinForm.notes}
                  onChange={e => setWalkinForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Bayar Tunai di kasir"
                  className="w-full px-3 py-2 bg-surface-base border border-gray-700 rounded-lg text-white font-medium focus:border-primary-container focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                <button onClick={() => setShowWalkin(false)} className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold cursor-pointer">
                  Batal
                </button>
                <button
                  onClick={handleWalkin}
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-primary-container text-on-primary-fixed text-sm font-bold hover:shadow-[0_0_20px_rgba(0,255,102,0.4)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Memproses...' : 'Aktifkan Sesi Sekarang'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


import { HashRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import PcMapping from './pages/PcMapping'
import Bookings from './pages/Bookings'
import Packages from './pages/Packages'
import Settings from './pages/Settings'
import AuditLog from './pages/AuditLog'

const navItems = [
  { to: '/', label: 'Overview', icon: '⊞' },
  { to: '/pcs', label: 'PC Mapping (12 Rig)', icon: '🖥' },
  { to: '/bookings', label: 'Reservasi & Kasir', icon: '🧾' },
  { to: '/packages', label: 'Paket Billing', icon: '💳' },
  { to: '/settings', label: 'Pengaturan', icon: '⚙' },
  { to: '/audit', label: 'Audit Log', icon: '📋' },
]

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-surface-base text-gray-200">
        {/* Top Navbar */}
        <header className="bg-surface-card border-b border-gray-800 sticky top-0 z-40">
          <div className="px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shadow-[0_0_15px_rgba(0,255,102,0.4)]">
                  <span className="text-on-primary-fixed font-bold text-sm">HOG</span>
                </div>
                <span className="font-display font-bold text-base text-white uppercase tracking-wider">
                  HOG Operations
                </span>
              </div>

              {/* Nav Links */}
              <nav className="flex items-center gap-0.5">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-surface-elevated text-primary-container font-semibold'
                          : 'text-gray-400 hover:text-white hover:bg-surface-container'
                      }`
                    }
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Right side — live indicator */}
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="w-2 h-2 rounded-full bg-status-available animate-pulse" />
              <span className="font-medium text-xs text-gray-400">Live · Supabase Cloud</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pcs" element={<PcMapping />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/audit" element={<AuditLog />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}


import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-card border-t border-surface-container-high/50">
      <div className="w-full px-margin py-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {/* Col 1 */}
          <div className="flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-fixed font-bold">
                <span className="material-symbols-outlined text-[20px]">sports_esports</span>
              </div>
              <span className="font-headline-sm text-headline-sm uppercase text-primary tracking-wider">
                Home Of Gamers
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Your Game. Your Space. Your Home.
            </p>
            <div className="inline-flex items-center gap-space-xs font-label-sm text-label-sm text-status-available uppercase">
              <span className="w-2 h-2 rounded-full bg-status-available animate-pulse"></span>
              <span>Buka 24 Jam Setiap Hari</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-space-sm">
            <span className="font-headline-sm text-headline-sm text-primary">Quick Links</span>
            <ul className="flex flex-col gap-space-xs">
              <li>
                <Link href="/" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/#fasilitas" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">
                  Fasilitas
                </Link>
              </li>
              <li>
                <Link href="/#paket-harga" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">
                  Paket &amp; Harga
                </Link>
              </li>
              <li>
                <Link href="/booking" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">
                  Ketersediaan PC
                </Link>
              </li>
              <li>
                <Link href="/booking-status" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">
                  Status Reservasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-space-sm">
            <span className="font-headline-sm text-headline-sm text-primary">Layanan &amp; Lokasi</span>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Pusat Gaming Esports Terbesar dengan Koneksi Dedicated 1 Gbps &amp; Hardware Turnamen.
            </p>
            <a
              className="inline-flex items-center gap-space-xs font-label-md text-label-md text-secondary hover:text-secondary-fixed transition-colors"
              href="https://wa.me/6287878672111"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              WhatsApp: 0878-7867-2111
            </a>
          </div>

          {/* Col 4 */}
          <div className="flex flex-col gap-space-sm">
            <span className="font-headline-sm text-headline-sm text-primary">Metode Pembayaran</span>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Dukungan QRIS, Virtual Account BCA/Mandiri, E-Wallet (GoPay, OVO, Dana), dan Tunai di Kasir.
            </p>
            <div className="flex items-center gap-space-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
              <span className="material-symbols-outlined text-[24px]">account_balance</span>
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </div>
          </div>
        </div>

        <div className="mt-space-xl pt-space-lg border-t border-surface-container-high/40 flex flex-col md:flex-row items-center justify-between gap-space-md font-body-sm text-body-sm text-on-surface-variant">
          <p>© 2025 Home Of Gamers (HOG) Indonesia. All rights reserved. Professional Warnet &amp; Gaming Lounge.</p>
          <div className="flex items-center gap-space-md">
            <span className="hover:text-on-surface cursor-pointer transition-colors">Kebijakan Privasi</span>
            <span className="hover:text-on-surface cursor-pointer transition-colors">Syarat &amp; Ketentuan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

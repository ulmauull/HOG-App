---
name: Esports Sanctuary
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#191c22'
  surface-container: '#1d2026'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2eb'
  on-surface-variant: '#b9ccb5'
  inverse-surface: '#e1e2eb'
  inverse-on-surface: '#2e3037'
  outline: '#849581'
  outline-variant: '#3b4b3a'
  surface-tint: '#00e55b'
  primary: '#edffe8'
  on-primary: '#003911'
  primary-container: '#00ff66'
  on-primary-container: '#007128'
  inverse-primary: '#006e27'
  secondary: '#69d7de'
  on-secondary: '#003739'
  secondary-container: '#22a0a6'
  on-secondary-container: '#002f32'
  tertiary: '#fef8ff'
  on-tertiary: '#3e127e'
  tertiary-container: '#e7d6ff'
  on-tertiary-container: '#714cb3'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6bff83'
  primary-fixed-dim: '#00e55b'
  on-primary-fixed: '#002107'
  on-primary-fixed-variant: '#00531b'
  secondary-fixed: '#87f3fa'
  secondary-fixed-dim: '#69d7de'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f53'
  tertiary-fixed: '#ebdcff'
  tertiary-fixed-dim: '#d4bbff'
  on-tertiary-fixed: '#260058'
  on-tertiary-fixed-variant: '#563096'
  background: '#10131a'
  on-background: '#e1e2eb'
  surface-variant: '#32353c'
  surface-base: '#0B0E14'
  surface-card: '#12161F'
  surface-elevated: '#1A202C'
  status-available: '#00FF66'
  status-in-use: '#78E5EC'
  status-reserved: '#B993FF'
  status-offline: '#4A5568'
  accent-emerald: '#10B981'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Geist
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system defines the digital flagship experience for an elite esports lounge and internet gaming cafe tailored for the Indonesian gaming community. The visual direction balances the precision of competitive hardware with the refined hospitality of an upscale lounge. The experience should evoke focused adrenaline, technological authority, and exclusivity—moving deliberately away from chaotic, oversaturated gaming tropes toward a polished, midnight-lounge atmosphere.

The design movement combines **Dark-Mode Minimalism** with **Refined Cyber-Glass**. Dark charcoal and near-black surfaces layer subtly beneath razor-sharp geometric typography, crisp white micro-copy, and hyper-targeted electric green neon accents. Light is treated with strict discipline: glow is reserved exclusively for system statuses, active competitive stations, and final call-to-action steps.

## Colors

The palette operates on absolute darkness punctuated by surgical luminescent cues. 

- **Primary (`#00FF66`)**: Electric neon lime. Denotes primary forward actions, live station availability, active timer status, and primary confirmational CTAs.
- **Secondary (`#78E5EC`)**: Cool cyan/ice. Applied to in-session stations ("Digunakan"), live network metrics, and active gaming rig performance tiers.
- **Tertiary (`#B993FF`)**: Deep neon violet. Reserved for advanced bookings ("Dipesan"), VIP suite upgrades, and premium tournament reservations.
- **Neutral (`#0B0E14`)**: Deepest midnight carbon. Serves as the canvas foundation, flanked by `#12161F` (standard component cards) and `#1A202C` (hover states, modal overlays, sticky interaction bars).
- **Status Tones**:
  - `status-available` (`#00FF66`): "Tersedia"
  - `status-in-use` (`#78E5EC`): "Digunakan"
  - `status-reserved` (`#B993FF`): "Dipesan"
  - `status-offline` (`#4A5568`): "Offline / Perawatan"

Avoid flood fills of vibrant colors. Neon colors must live primarily as border highlights, indicator pips, icon accents, and high-priority button surfaces against deep dark backdrops.

## Typography

The type system blends the computational, technical presence of **Space Grotesk** with the neutral, hyper-legible precision of **Geist**.

- **Space Grotesk** provides immediate architectural authority for marketing headlines, station callouts, pricing titles, and numeric countdowns. Tight tracking (`-0.02em`) is applied to large sizes for a condensed, engineered aesthetic.
- **Geist** manages data density, station telemetry, spec lists (CPU, GPU, Hz), interactive input fields, and Indonesian booking steps.

All pricing labels and Indonesian Rupiah tokens (e.g., `Rp 25.000 / jam`) must maintain tabular numeric alignment with strict weight contrast: bold denominations alongside subtle uppercase currency specifiers.

## Layout & Spacing

The layout is built upon a 12-column responsive fluid grid designed to display telemetry and seat arrangements efficiently across all devices.

- **Desktop (>= 1280px)**: 12-column layout with 24px (`1.5rem`) gutters and 32px (`2rem`) container margins. Used for visual floorplans, wide PC station grids (4 columns per row), and persistent split-screen booking sidebars.
- **Tablet (768px - 1279px)**: 8-column layout with 24px gutters. Seat layouts reflow into 2-column card structures, and booking bars dock cleanly to the bottom.
- **Mobile (< 768px)**: 4-column layout with 16px (`1rem`) gutters and 16px outer safe margins. Station listings collapse into single-column vertical cards, with booking summaries anchored to an elevated sticky bottom sheet.

## Elevation & Depth

Depth is established via deep structural glassmorphism and stacked charcoal planes rather than traditional cast shadows.

- **Level 0 (Floor/Base)**: `#0B0E14` solid background with a faint, non-distracting isometric dot-grid background (2% opacity).
- **Level 1 (Card/Container)**: `#12161F` fill with a subtle 1px border (`rgba(255, 255, 255, 0.08)`).
- **Level 2 (Hover & Active Components)**: `#1A202C` surface fill with an illuminated border accent (`rgba(0, 255, 102, 0.35)` for primary interactive surfaces) and a soft ambient glow: `box-shadow: 0 0 20px -5px rgba(0, 255, 102, 0.2)`.
- **Level 3 (Sticky Booking Panel / Floating Modals)**: `#12161F` with 85% opacity, `backdrop-filter: blur(16px)`, and a 1px border (`rgba(255, 255, 255, 0.12)`).

## Shapes

The design uses balanced, modern geometry (`roundedness: 2`). Standard interactive elements, input fields, and hardware badges feature an 8px (`0.5rem`) corner radius. Larger pricing panels, station map nodes, and modal containers scale up to 16px (`1rem`) corner radius. Pill shapes are reserved strictly for status pills and category filter badges to contrast against structural card frames.

## Components

### Buttons
- **Primary Action (CTA / Bayar Sekarang)**: Background `#00FF66`, text `#0B0E14` (semi-bold), 8px border radius. Hover introduces a subtle scale (1.02) and an electric glow (`box-shadow: 0 0 24px rgba(0, 255, 102, 0.4)`).
- **Secondary (Detail Rig / Ganti Jadwal)**: Transparent background, 1px border in `rgba(255, 255, 255, 0.15)`, text `#FFFFFF`. Hover transitions surface to `#1A202C` with border `rgba(255, 255, 255, 0.3)`.
- **Ghost (Batal / Kembali)**: Unbordered, muted text `#A0AEC0`, hover text `#FFFFFF`.

### Status Badges
Pill-shaped containers (`rounded-full`), padded with 4px vertical and 10px horizontal space, using uppercase tracking (`label-sm`).
- **Tersedia**: Background `rgba(0, 255, 102, 0.12)`, border `rgba(0, 255, 102, 0.3)`, text `#00FF66`, with a pulsing 6px circular neon pip.
- **Digunakan**: Background `rgba(120, 229, 236, 0.12)`, border `rgba(120, 229, 236, 0.3)`, text `#78E5EC`.
- **Dipesan**: Background `rgba(185, 147, 255, 0.12)`, border `rgba(185, 147, 255, 0.3)`, text `#B993FF`.
- **Offline**: Background `rgba(74, 85, 104, 0.2)`, border `rgba(74, 85, 104, 0.4)`, text `#A0AEC0`.

### PC Station Cards
Structured cards constructed from `#12161F` with 1px border `rgba(255, 255, 255, 0.08)`.
- Header: Station designation (e.g., `VIP-04`) in Space Grotesk alongside the real-time Status Badge.
- Body: Integrated schematic silhouette of the curved monitor, listing core hardware specs (RTX 4080, 240Hz, Mechanical Keeb). If "Digunakan", displays a live elapsed countdown timer in Geist.
- Footer: Quick action button ("Pilih PC") or dynamic indicator of remaining session time.

### Pricing Package Cards
Vertical tiered containers highlighting hourly rates and package bonuses (e.g., "Paket Begadang 6 Jam"). 
- Featured tier features a top gradient border running from `#00FF66` to `#78E5EC`.
- Large monetary amounts formatted clearly in Indonesian currency (`Rp 45.000`), accompanied by subtext breakdowns of perks (Free Soft Drink, VIP Billing Seat).

### Sticky Booking Summary Panel
Persistent desktop sidebar or anchored mobile bottom drawer.
- Backed by blurred obsidian glass (`rgba(18, 22, 31, 0.85)`).
- Breakdown includes: Selected station, duration slider (Jam), add-ons (FnB / Peripheral upgrades), and total calculated price with clear Indonesian VAT breakdown (`PPN 11%`).
- Concludes with full-width primary button: `Lanjut Pembayaran`.

### Form Steps & Inputs
Inputs use a `#0B0E14` inset background with 1px border `rgba(255, 255, 255, 0.12)`, shifting to `#00FF66` border focus. Stepper bars feature numbered circular badges connected by glowing traces indicating current booking phase (1. Pilih Area -> 2. Pilih Rig -> 3. Pembayaran).
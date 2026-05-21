import type React from 'react'
import {
  BarChart3,
  CalendarCheck,
  CarFront,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  ShieldCheck,
  Smartphone,
  Wrench,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppLogo } from '../../components/ui/AppLogo'

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f6f8f7] text-[#10231c]">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/brand/fleetrackr-logo.png"
              alt="Fleetrackr"
              className="h-12 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-2xl px-4 py-2 text-sm font-bold text-[#1f3d32]"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-2xl bg-[#1f3d32] px-4 py-2 text-sm font-bold text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="px-5 pb-12 pt-10">
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#e8f0ec] px-4 py-2 text-sm font-bold text-[#1f3d32]">
              <Smartphone size={16} />
              Mobile-first PWA for car rentals
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-[#10231c] sm:text-5xl lg:text-6xl">
              Smart tracking for modern car rental businesses.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
              Fleetrackr helps rental businesses manage cars, bookings,
              customers, payments, expenses, maintenance, reports, and team
              access in one secure app.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="rounded-2xl bg-[#1f3d32] px-6 py-4 text-center text-sm font-bold text-white shadow-sm"
              >
                Start Free
              </Link>

              <Link
                to="/login"
                className="rounded-2xl bg-white px-6 py-4 text-center text-sm font-bold text-[#1f3d32] shadow-sm"
              >
                Login to App
              </Link>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <TrustItem label="No Google Sheets" />
              <TrustItem label="Secure Database" />
              <TrustItem label="Installable PWA" />
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-white p-5 shadow-xl">
            <div className="rounded-[2rem] bg-[#1f3d32] p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Today Overview</p>
                  <h2 className="mt-1 text-2xl font-bold">Dashboard</h2>
                </div>

                <div className="rounded-2xl bg-white/10 p-3">
                  <BarChart3 size={26} />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <HeroMetric label="Available Cars" value="12" />
                <HeroMetric label="Ongoing Trips" value="5" />
                <HeroMetric label="Collected" value="₱48K" />
                <HeroMetric label="Receivables" value="₱13K" />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <HeroListItem
                icon={<CalendarCheck size={18} />}
                title="Booking validation"
                description="Prevent overlapping car rentals."
              />
              <HeroListItem
                icon={<CircleDollarSign size={18} />}
                title="Payment tracking"
                description="Track down payments and balances."
              />
              <HeroListItem
                icon={<ShieldCheck size={18} />}
                title="Secure records"
                description="Private files with signed URL access."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#416b57]">
              Features
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#10231c]">
              Everything your rental business needs
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Replace scattered spreadsheets with one organized business system.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<CarFront size={24} />}
              title="Fleet Management"
              description="Manage cars, photos, plate numbers, rates, and vehicle status."
            />
            <FeatureCard
              icon={<CalendarCheck size={24} />}
              title="Booking System"
              description="Create bookings, validate availability, and avoid date conflicts."
            />
            <FeatureCard
              icon={<CircleDollarSign size={24} />}
              title="Payments"
              description="Record customer payments, balances, receipts, and payment status."
            />
            <FeatureCard
              icon={<FileText size={24} />}
              title="Customer Documents"
              description="Store customer records, valid IDs, and licenses securely."
            />
            <FeatureCard
              icon={<Wrench size={24} />}
              title="Maintenance Tracker"
              description="Track repairs, service schedules, costs, and next maintenance dates."
            />
            <FeatureCard
              icon={<BarChart3 size={24} />}
              title="Reports"
              description="Monitor revenue, expenses, profit, fleet usage, and availability."
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-14">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-[#10231c] p-8 text-white sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-black">
                Built for real car rental operations.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                Fleetrackr is designed for owners who need visibility over their
                vehicles, customers, bookings, collections, and operating costs.
              </p>
            </div>

            <div className="grid gap-3">
              <Benefit label="Mobile-first and installable" />
              <Benefit label="Role-based access control" />
              <Benefit label="Private customer document storage" />
              <Benefit label="Super admin ready for SaaS use" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <AppLogo size="lg" showText={false} className="mb-5" />

          <h2 className="text-3xl font-black text-[#10231c]">
            Ready to organize your car rental business?
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Create your account, set up your business, and start tracking your
            fleet in minutes.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="rounded-2xl bg-[#1f3d32] px-6 py-4 text-sm font-bold text-white"
            >
              Create Account
            </Link>

            <Link
              to="/login"
              className="rounded-2xl bg-[#e8f0ec] px-6 py-4 text-sm font-bold text-[#1f3d32]"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white px-5 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center text-sm text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Fleetrackr. All rights reserved.</p>
          <p>Smart Tracking for Modern Car Rentals</p>
        </div>
      </footer>
    </main>
  )
}

function TrustItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#10231c] shadow-sm">
      <CheckCircle2 size={17} className="text-[#1f3d32]" />
      {label}
    </div>
  )
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-xs text-white/70">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  )
}

function HeroListItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-[#f6f8f7] p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f0ec] text-[#1f3d32]">
        {icon}
      </div>

      <div>
        <p className="text-sm font-bold text-[#10231c]">{title}</p>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-[2rem] bg-[#f6f8f7] p-6">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f0ec] text-[#1f3d32]">
        {icon}
      </div>

      <h3 className="text-lg font-bold text-[#10231c]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
    </div>
  )
}

function Benefit({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
      <CheckCircle2 size={18} className="shrink-0 text-green-300" />
      <p className="text-sm font-semibold">{label}</p>
    </div>
  )
}
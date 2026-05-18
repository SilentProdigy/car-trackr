import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  NavLink,
  Link,
} from 'react-router-dom'
import {
  Home,
  Car,
  CalendarDays,
  BarChart3,
  Settings,
} from 'lucide-react'

import { ProfilePage } from './features/profile/ProfilePage'

import { DashboardPage } from './features/dashboard/DashboardPage'

import { TeamPage } from './features/team/TeamPage'
import { ActivityLogsPage } from './features/activity/ActivityLogsPage'

// import { useQuery } from '@tanstack/react-query'
// import { getReportsData } from './features/reports/reportsApi'


import { LoginPage } from './features/auth/LoginPage'
import { RegisterPage } from './features/auth/RegisterPage'
import { BusinessSetupPage } from './features/auth/BusinessSetupPage'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { PublicRoute } from './routes/PublicRoute'
import { supabase } from './lib/supabase'
import { CarsPage } from './features/cars/CarsPage'
import { CustomersPage } from './features/customers/CustomersPage'
import { BookingsPage } from './features/bookings/BookingPage'
import { PaymentsPage } from './features/payments/PaymentsPage'
import { ExpensesPage } from './features/expenses/ExpensesPage'
import { MaintenancePage } from './features/maintenance/MaintenancePage'
import { ReportsPage } from './features/reports/ReportsPage'

import { BusinessRequiredRoute } from './routes/BusinessRequiredRoute'

import { SuperAdminRoute } from './routes/SuperAdminRoute'
import { SuperAdminDashboardPage } from './features/super-admin/SuperAdminDashboardPage'
import { AdminBusinessesPage } from './features/super-admin/AdminBusinessesPage'
import { AdminUsersPage } from './features/super-admin/AdminUsersPage'
import { usePermissions } from './features/auth/usePermissions'
import { ChooseAccessPage } from './features/auth/ChooseAccessPage'
import { AppEntryRoute } from './routes/AppEntryRoute'

function SettingsPage() {

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const { data: permissions } = usePermissions()

  const menuItems = [
     ...(permissions?.isSuperAdmin
    ? [
        {
          label: 'Super Admin Panel',
          description: 'Manage the entire application',
          path: '/admin',
        },
      ]
    : []),
    {
      label: 'Profile Management',
      description: 'Update owner profile and business details',
      path: '/profile',
    },
    {
      label: 'Team Management',
      description: 'Manage staff roles and access',
      path: '/team',
    },
    {
      label: 'Activity Logs',
      description: 'View audit trail and system changes',
      path: '/activity-logs',
    },
    {
      label: 'Customers',
      description: 'Manage renter profiles and documents',
      path: '/customers',
    },
    {
      label: 'Payments',
      description: 'Track customer payments',
      path: '/payments',
    },
    {
      label: 'Expenses',
      description: 'Track operating and vehicle expenses',
      path: '/expenses',
    },
    {
      label: 'Maintenance',
      description: 'Track repairs and service schedules',
      path: '/maintenance',
    },
  ]

  return (
    <main className="min-h-screen bg-[#f6f8f7] pb-24">
      <header className="bg-[#1f3d32] px-5 py-6 text-white">
        <h1 className="text-2xl font-bold">More</h1>
        <p className="mt-1 text-sm opacity-80">Manage other modules</p>
      </header>

      <section className="space-y-4 px-5 py-5">
        <div className="rounded-3xl bg-white p-3 shadow-sm">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block rounded-2xl px-4 py-4 transition hover:bg-[#f6f8f7]"
            >
              <p className="text-sm font-bold text-[#10231c]">{item.label}</p>
              <p className="mt-1 text-xs text-gray-500">{item.description}</p>
            </Link>
          ))}
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#10231c]">Account</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your session and business account.
          </p>

          <button
            onClick={handleLogout}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-3 text-sm font-bold text-red-700"
          >
            Logout
          </button>
        </div>
      </section>

      <BottomNav />
    </main>
  )
}


function BottomNav() {
  const items = [
    {
      label: 'Home',
      path: '/dashboard',
      icon: Home,
    },
    {
      label: 'Cars',
      path: '/cars',
      icon: Car,
    },
    {
      label: 'Bookings',
      path: '/bookings',
      icon: CalendarDays,
    },
    {
      label: 'Reports',
      path: '/reports',
      icon: BarChart3,
    },
    {
      label: 'More',
      path: '/settings',
      icon: Settings,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-3 py-2">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  'flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-xs font-medium transition',
                  isActive
                    ? 'bg-[#e8f0ec] text-[#1f3d32]'
                    : 'text-[#416b57]',
                ].join(' ')
              }
            >
              <Icon size={20} />
              <span className="mt-1">{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppEntryRoute />} />

        <Route
          path="/choose-access"
          element={
            <ProtectedRoute>
              <ChooseAccessPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          path="/business-setup"
          element={
            <ProtectedRoute>
              <BusinessSetupPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <SuperAdminRoute>
              <SuperAdminDashboardPage />
            </SuperAdminRoute>
          }
        />

        <Route
          path="/admin/businesses"
          element={
            <SuperAdminRoute>
              <AdminBusinessesPage />
            </SuperAdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <SuperAdminRoute>
              <AdminUsersPage />
            </SuperAdminRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <BusinessRequiredRoute>
              <DashboardPage />
            </BusinessRequiredRoute>
          }
        />

        <Route
          path="/cars"
          element={
            <BusinessRequiredRoute>
              <CarsPage />
            </BusinessRequiredRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <BusinessRequiredRoute>
              <ProfilePage />
            </BusinessRequiredRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <BusinessRequiredRoute>
              <BookingsPage />
            </BusinessRequiredRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <BusinessRequiredRoute>
              <CustomersPage />
            </BusinessRequiredRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <BusinessRequiredRoute>
              <PaymentsPage />
            </BusinessRequiredRoute>
          }
        />

        <Route
          path="/expenses"
          element={
            <BusinessRequiredRoute>
              <ExpensesPage />
            </BusinessRequiredRoute>
          }
        />

        <Route
          path="/maintenance"
          element={
            <BusinessRequiredRoute>
              <MaintenancePage />
            </BusinessRequiredRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <BusinessRequiredRoute>
              <ReportsPage />
            </BusinessRequiredRoute>
          }
        />
        
        <Route
          path="/team"
          element={
            <BusinessRequiredRoute>
              <TeamPage />
            </BusinessRequiredRoute>
          }
        />

        <Route
          path="/activity-logs"
          element={
            <BusinessRequiredRoute>
              <ActivityLogsPage />
            </BusinessRequiredRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <BusinessRequiredRoute>
              <SettingsPage />
            </BusinessRequiredRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
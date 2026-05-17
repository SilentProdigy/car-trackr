import { NavLink } from 'react-router-dom'
import { Home, Car, CalendarDays, BarChart3, Settings } from 'lucide-react'

export function BottomNav() {
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
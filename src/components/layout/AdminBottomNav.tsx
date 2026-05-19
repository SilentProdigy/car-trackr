import { NavLink } from 'react-router-dom'
import {
  Activity,
  Building2,
  LayoutDashboard,
  Settings,
  UserRound,
} from 'lucide-react'

export function AdminBottomNav() {
  const items = [
    {
      label: 'Admin',
      path: '/admin',
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: 'Business',
      path: '/admin/businesses',
      icon: Building2,
      end: false,
    },
    {
      label: 'Users',
      path: '/admin/users',
      icon: UserRound,
      end: false,
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white px-3 py-2">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-1">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                [
                  'flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-xs font-medium transition',
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600',
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
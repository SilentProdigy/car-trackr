import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { usePermissions } from '../features/auth/usePermissions'

type SuperAdminRouteProps = {
  children: ReactNode
}

export function SuperAdminRoute({ children }: SuperAdminRouteProps) {
  const { data: permissions, isLoading } = usePermissions()

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8f7]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#d7e5dd] border-t-[#1f3d32]" />
          <p className="text-sm font-semibold text-[#1f3d32]">
            Checking admin access...
          </p>
        </div>
      </main>
    )
  }

  if (!permissions?.isSuperAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
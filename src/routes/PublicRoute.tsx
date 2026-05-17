import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'

type PublicRouteProps = {
  children: ReactNode
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8f7]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#d7e5dd] border-t-[#1f3d32]" />
          <p className="text-sm font-semibold text-[#1f3d32]">Loading...</p>
        </div>
      </main>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
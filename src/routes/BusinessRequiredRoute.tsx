import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCurrentBusiness } from '../lib/business'
import { useAuth } from '../features/auth/useAuth'
import { usePermissions } from '../features/auth/usePermissions'

type BusinessRequiredRouteProps = {
  children: ReactNode
}

export function BusinessRequiredRoute({
  children,
}: BusinessRequiredRouteProps) {
  const { user, loading: authLoading } = useAuth()
  const { data: permissions, isLoading: permissionsLoading } = usePermissions()
  const {
    data: business,
    isLoading: businessLoading,
  } = useQuery({
    queryKey: ['current-business'],
    queryFn: getCurrentBusiness,
    enabled: Boolean(user),
    retry: false,
  })

  if (authLoading || businessLoading || permissionsLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8f7]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#d7e5dd] border-t-[#1f3d32]" />
          <p className="text-sm font-semibold text-[#1f3d32]">
            Checking business setup...
          </p>
        </div>
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (permissions?.isSuperAdmin && !business) {
    return <Navigate to="/admin" replace />
    }

    if (!business) {
    return <Navigate to="/business-setup" replace />
    }

    return children
}
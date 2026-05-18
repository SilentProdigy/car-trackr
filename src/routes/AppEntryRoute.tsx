import { Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../features/auth/useAuth'
import { getUserAccessInfo, resolveAccessRedirect } from '../features/auth/accessApi'

export function AppEntryRoute() {
  const { user, loading: authLoading } = useAuth()

  const {
    data: access,
    isLoading: accessLoading,
  } = useQuery({
    queryKey: ['user-access-info'],
    queryFn: getUserAccessInfo,
    enabled: Boolean(user),
    retry: false,
  })

  if (authLoading || accessLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8f7]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#d7e5dd] border-t-[#1f3d32]" />
          <p className="text-sm font-semibold text-[#1f3d32]">
            Loading app...
          </p>
        </div>
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!access) {
    return <Navigate to="/business-setup" replace />
  }

  return <Navigate to={resolveAccessRedirect(access)} replace />
}
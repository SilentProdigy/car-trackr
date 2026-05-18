import { useQuery } from '@tanstack/react-query'
import { getCurrentUserPermissions } from '../../lib/permissions'

export function usePermissions() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: getCurrentUserPermissions,
  })
}
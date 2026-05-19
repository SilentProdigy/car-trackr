const ADMIN_BUSINESS_ACCESS_KEY = 'fleetrackr_admin_business_access'

export function enableAdminBusinessAccess() {
  sessionStorage.setItem(ADMIN_BUSINESS_ACCESS_KEY, 'true')
}

export function disableAdminBusinessAccess() {
  sessionStorage.removeItem(ADMIN_BUSINESS_ACCESS_KEY)
}

export function hasAdminBusinessAccess() {
  return sessionStorage.getItem(ADMIN_BUSINESS_ACCESS_KEY) === 'true'
}
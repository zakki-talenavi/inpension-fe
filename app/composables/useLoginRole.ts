import { useRuntimeConfig } from 'nuxt/app'
import { computed } from 'vue'

/**
 * Selected login role from scope: uses key (dplk, company, personal) in cookie and query, not roleId.
 * roleKey: for display / URL (?access=company). roleId: resolve from config when calling API.
 */
export function useLoginRole() {
  const route = useRoute()
  const loginRoleCookie = useCookie<string | null>('login_role', { default: () => null })
  const config = useRuntimeConfig()
  const roleIds = (config.public.scopeRoleIds || {}) as Record<string, string>

  const roleKey = computed(() => {
    const fromQuery = route.query.access
    if (typeof fromQuery === 'string' && fromQuery) return fromQuery
    return loginRoleCookie.value ?? null
  })
  const roleId = computed(() => {
    const key = roleKey.value
    return key && roleIds[key] ? roleIds[key]! : null
  })

  return { roleKey, roleId }
}

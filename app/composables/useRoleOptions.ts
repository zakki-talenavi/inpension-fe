import { useRuntimeConfig } from 'nuxt/app'
import type { RoleOption } from '~/types/scope'
import { SCOPE_ROLE_DEFINITIONS, type ScopeRoleDefinition } from '../config/scopeRoles'

/**
 * Returns role options for the scope (PILIH TIPE USER) page.
 * Definitions (key, title, subtitle, routing, icon, actions) are in app/config/scopeRoles.ts.
 * Only roleId comes from runtime config (NUXT_PUBLIC_SCOPE_ROLE_IDS).
 */
export function useRoleOptions(): RoleOption[] {
  const config = useRuntimeConfig()
  const roleIds = (config.public.scopeRoleIds || {}) as Record<string, string>
  return SCOPE_ROLE_DEFINITIONS
    .filter((def: ScopeRoleDefinition) => roleIds[def.key])
    .map((def: ScopeRoleDefinition): RoleOption => ({
      ...def,
      roleId: roleIds[def.key]!,
    }))
}

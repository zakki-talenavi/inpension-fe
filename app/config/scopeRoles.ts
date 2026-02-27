import type { RoleAction } from '~/types/scope'

/** Role definition (key, title, subtitle, routing, icon, image, actions). roleId comes from env. */
export interface ScopeRoleDefinition {
  key: string
  title: string
  subtitle: string
  routing: string
  icon: string
  /** Optional image path for card icon (overrides icon when set). */
  image?: string
  actions: RoleAction[]
}

/** Hardcoded scope role definitions. Only roleId is injected from runtime config. */
export const SCOPE_ROLE_DEFINITIONS: ScopeRoleDefinition[] = [
  {
    key: 'dplk',
    title: 'ADMIN',
    subtitle: 'DPLK',
    routing: '/dashboard',
    icon: 'pi-desktop',
    image: '/assets/layout/images/lp/admin.png',
    actions: [
      { type: 'login', label: 'Log In' },
      { type: 'with_inventory', label: 'With Investpro' },
    ],
  },
  {
    key: 'company',
    title: 'PERUSAHAAN',
    subtitle: 'PESERTA',
    routing: '/dashboard',
    icon: 'pi-building',
    image: '/assets/layout/images/lp/company.png',
    actions: [{ type: 'login', label: 'Log In' }],
  },
  {
    key: 'personal',
    title: 'INDIVIDU',
    subtitle: 'PESERTA',
    routing: '/dashboard',
    icon: 'pi-user',
    image: '/assets/layout/images/lp/avatar.png',
    actions: [
      { type: 'register', label: 'Daftar', route: '/register' },
      { type: 'login', label: 'Log In' },
    ],
  },
]

/**
 * Role option for scope (PILIH TIPE USER) page.
 * Loaded from runtime config so roles are not hardcoded.
 */
export type RoleActionType = 'login' | 'register' | 'with_inventory'

export interface RoleAction {
  type: RoleActionType
  label: string
  /** Route for link (e.g. /register). For login, roleId is used. */
  route?: string
  /** Override button style: 'outlined' for secondary look (e.g. Log In on Individu card). */
  variant?: 'filled' | 'outlined'
}

export interface RoleOption {
  key: string
  roleId: string
  title: string
  subtitle: string
  routing: string
  icon: string
  /** Optional image path for card (e.g. /assets/layout/images/lp/admin.png). Used instead of icon when set. */
  image?: string
  actions: RoleAction[]
}

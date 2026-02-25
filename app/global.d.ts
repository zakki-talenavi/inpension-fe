/**
 * Nuxt/Vue compiler macros - available at build time, no runtime import needed.
 */
declare function definePageMeta(meta: Record<string, unknown>): void
declare function defineOptions(options: { name?: string }): void

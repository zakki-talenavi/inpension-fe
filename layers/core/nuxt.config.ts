// Core Layer Configuration
// https://nuxt.com/docs/guide/going-further/layers

export default defineNuxtConfig({
    // Layer metadata
    $meta: {
        name: 'core',
        description: 'Core infrastructure layer - API client, logging, error handling, and shared services',
    },

    // Disable component auto-imports to maintain explicit imports
    components: {
        dirs: [],
    },

    // Disable auto-imports
    imports: {
        autoImport: false,
    },
})

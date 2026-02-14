export default defineNuxtConfig({
    $meta: {
        name: 'auth',
        description: 'User authentication and authorization',
    },

    components: {
        dirs: [], // Auto-imports disabled
    },

    imports: {
        autoImport: false, // Explicit imports only
    },
})

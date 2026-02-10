export default defineNuxtConfig({
    components: {
        dirs: [
            {
                path: '~/app/components',
                pathPrefix: false
            }
        ]
    },

    imports: {
        dirs: [
            'app/composables',
            'app/stores'
        ]
    }
})

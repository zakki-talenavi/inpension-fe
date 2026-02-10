import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BaseBadge from '../baseBadge.vue'

describe('BaseBadge', () => {
    it('should render badge with value', async () => {
        const wrapper = await mountSuspended(BaseBadge, {
            props: {
                value: 5,
            },
        })

        expect(wrapper.text()).toBe('5')
    })

    it('should render badge with string value', async () => {
        const wrapper = await mountSuspended(BaseBadge, {
            props: {
                value: 'New',
            },
        })

        expect(wrapper.text()).toBe('New')
    })

    it('should apply primary variant by default', async () => {
        const wrapper = await mountSuspended(BaseBadge, {
            props: {
                value: 1,
            },
        })

        expect(wrapper.html()).toContain('bg-blue-500')
        expect(wrapper.html()).toContain('text-white')
    })

    it('should apply success variant', async () => {
        const wrapper = await mountSuspended(BaseBadge, {
            props: {
                value: 1,
                variant: 'success',
            },
        })

        expect(wrapper.html()).toContain('bg-green-500')
        expect(wrapper.html()).toContain('text-white')
    })

    it('should apply warning variant', async () => {
        const wrapper = await mountSuspended(BaseBadge, {
            props: {
                value: 1,
                variant: 'warning',
            },
        })

        expect(wrapper.html()).toContain('bg-yellow-500')
        expect(wrapper.html()).toContain('text-black')
    })

    it('should apply danger variant', async () => {
        const wrapper = await mountSuspended(BaseBadge, {
            props: {
                value: 1,
                variant: 'danger',
            },
        })

        expect(wrapper.html()).toContain('bg-red-500')
        expect(wrapper.html()).toContain('text-white')
    })

    it('should apply secondary variant', async () => {
        const wrapper = await mountSuspended(BaseBadge, {
            props: {
                value: 1,
                variant: 'secondary',
            },
        })

        expect(wrapper.html()).toContain('bg-gray-500')
        expect(wrapper.html()).toContain('text-white')
    })

    it('should have correct base classes', async () => {
        const wrapper = await mountSuspended(BaseBadge, {
            props: {
                value: 1,
            },
        })

        const span = wrapper.find('span')
        expect(span.classes()).toContain('inline-flex')
        expect(span.classes()).toContain('items-center')
        expect(span.classes()).toContain('justify-center')
        expect(span.classes()).toContain('rounded-full')
    })

    it('should render zero value', async () => {
        const wrapper = await mountSuspended(BaseBadge, {
            props: {
                value: 0,
            },
        })

        expect(wrapper.text()).toBe('0')
    })

    it('should render large numbers', async () => {
        const wrapper = await mountSuspended(BaseBadge, {
            props: {
                value: 999,
            },
        })

        expect(wrapper.text()).toBe('999')
    })
})

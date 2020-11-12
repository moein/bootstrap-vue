import { mount } from '@vue/test-utils'
import { waitNT, waitRAF } from '../../../tests/utils'
import { h } from '../../vue'
import { BNavbarToggle } from './navbar-toggle'

describe('navbar-toggle', () => {
  it('default has tag "button"', async () => {
    const wrapper = mount(BNavbarToggle, {
      props: {
        target: 'target-1'
      }
    })

    expect(wrapper.element.tagName).toBe('BUTTON')

    wrapper.unmount()
  })

  it('default has class "navbar-toggler"', async () => {
    const wrapper = mount(BNavbarToggle, {
      props: {
        target: 'target-2'
      }
    })

    expect(wrapper.classes()).toContain('navbar-toggler')
    // Class added by v-b-toggle
    expect(wrapper.classes()).toContain('collapsed')
    expect(wrapper.classes().length).toBe(2)

    wrapper.unmount()
  })

  it('default has default attributes', async () => {
    const wrapper = mount(BNavbarToggle, {
      props: {
        target: 'target-3'
      }
    })

    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.attributes('aria-controls')).toBe('target-3')
    expect(wrapper.attributes('aria-expanded')).toBe('false')
    expect(wrapper.attributes('aria-label')).toBe('Toggle navigation')

    wrapper.unmount()
  })

  it('default has inner button-close', async () => {
    const wrapper = mount(BNavbarToggle, {
      props: {
        target: 'target-4'
      }
    })

    expect(wrapper.find('span.navbar-toggler-icon')).toBeDefined()

    wrapper.unmount()
  })

  it('accepts custom label when label prop is set', async () => {
    const wrapper = mount(BNavbarToggle, {
      props: {
        target: 'target-5',
        label: 'foobar'
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('foobar')

    wrapper.unmount()
  })

  it('default slot scope works', async () => {
    let scope = null
    const wrapper = mount(BNavbarToggle, {
      props: {
        target: 'target-6'
      },
      slots: {
        default(ctx) {
          scope = ctx
          return h('div', 'foobar')
        }
      }
    })

    expect(scope).not.toBe(null)
    expect(scope.expanded).toBe(false)

    wrapper.vm.$root.$emit('bv::collapse::state', 'target-6', true)
    await waitNT(wrapper.vm)
    expect(scope).not.toBe(null)
    expect(scope.expanded).toBe(true)

    wrapper.vm.$root.$emit('bv::collapse::state', 'target-6', false)
    await waitNT(wrapper.vm)
    expect(scope).not.toBe(null)
    expect(scope.expanded).toBe(false)

    wrapper.unmount()
  })

  it('emits click event', async () => {
    const wrapper = mount(BNavbarToggle, {
      props: {
        target: 'target-7'
      }
    })

    await waitRAF()
    await waitNT(wrapper.vm)

    let rootClicked = false
    const onRootClick = () => {
      rootClicked = true
    }
    wrapper.vm.$root.$on('bv::toggle::collapse', onRootClick)

    expect(wrapper.emitted('click')).toBeUndefined()
    expect(rootClicked).toBe(false)

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeDefined()
    expect(rootClicked).toBe(true)

    wrapper.vm.$root.$off('bv::toggle::collapse', onRootClick)

    wrapper.unmount()
  })

  it('sets aria-expanded when receives root emit for target', async () => {
    const wrapper = mount(BNavbarToggle, {
      props: {
        target: 'target-8'
      }
    })

    // Private state event
    wrapper.vm.$root.$emit('bv::collapse::state', 'target-8', true)
    await waitNT(wrapper.vm)
    expect(wrapper.attributes('aria-expanded')).toBe('true')

    wrapper.vm.$root.$emit('bv::collapse::state', 'target-8', false)
    await waitNT(wrapper.vm)
    expect(wrapper.attributes('aria-expanded')).toBe('false')

    wrapper.vm.$root.$emit('bv::collapse::state', 'foo', true)
    await waitNT(wrapper.vm)
    expect(wrapper.attributes('aria-expanded')).toBe('false')

    // Private sync event
    wrapper.vm.$root.$emit('bv::collapse::sync::state', 'target-8', true)
    await waitNT(wrapper.vm)
    expect(wrapper.attributes('aria-expanded')).toBe('true')

    wrapper.vm.$root.$emit('bv::collapse::sync::state', 'target-8', false)
    await waitNT(wrapper.vm)
    expect(wrapper.attributes('aria-expanded')).toBe('false')

    wrapper.vm.$root.$emit('bv::collapse::sync::state', 'foo', true)
    await waitNT(wrapper.vm)
    expect(wrapper.attributes('aria-expanded')).toBe('false')

    wrapper.unmount()
  })

  it('disabled prop works', async () => {
    const wrapper = mount(BNavbarToggle, {
      props: {
        target: 'target-9',
        disabled: true
      }
    })

    expect(wrapper.emitted('click')).toBeUndefined()
    expect(wrapper.element.hasAttribute('disabled')).toBe(true)
    expect(wrapper.classes()).toContain('disabled')

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()

    wrapper.unmount()
  })
})

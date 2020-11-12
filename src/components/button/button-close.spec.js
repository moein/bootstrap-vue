import { mount } from '@vue/test-utils'
import { BButtonClose } from './button-close'

describe('button-close', () => {
  it('has root element "button"', async () => {
    const wrapper = mount(BButtonClose)

    expect(wrapper.element.tagName).toBe('BUTTON')

    wrapper.unmount()
  })

  it('has class "close"', async () => {
    const wrapper = mount(BButtonClose)

    expect(wrapper.classes()).toContain('close')
    expect(wrapper.classes().length).toBe(1)

    wrapper.unmount()
  })

  it('has attribute type="button"', async () => {
    const wrapper = mount(BButtonClose)

    expect(wrapper.attributes('type')).toBe('button')

    wrapper.unmount()
  })

  it('does not have attribute "disabled" by default', async () => {
    const wrapper = mount(BButtonClose)

    expect(wrapper.attributes('disabled')).toBeUndefined()

    wrapper.unmount()
  })

  it('has attribute "disabled" when prop "disabled" is set', async () => {
    const wrapper = mount(BButtonClose, {
      props: { disabled: true }
    })

    expect(wrapper.attributes('disabled')).toBeDefined()

    wrapper.unmount()
  })

  it('has attribute aria-label="Close" by default', async () => {
    const wrapper = mount(BButtonClose)

    expect(wrapper.attributes('aria-label')).toBe('Close')

    wrapper.unmount()
  })

  it('has custom attribute "aria-label" when prop "aria-label" set', async () => {
    const wrapper = mount(BButtonClose, {
      props: { ariaLabel: 'foobar' }
    })

    expect(wrapper.attributes('aria-label')).toBe('foobar')

    wrapper.unmount()
  })

  it('has text variant class when "variant" prop set', async () => {
    const wrapper = mount(BButtonClose, {
      props: { textVariant: 'primary' }
    })

    expect(wrapper.classes()).toContain('close')
    expect(wrapper.classes()).toContain('text-primary')
    expect(wrapper.classes().length).toBe(2)

    wrapper.unmount()
  })

  it('should have default content', async () => {
    const wrapper = mount(BButtonClose)

    // '&times;' gets converted to '×'
    expect(wrapper.text()).toContain('×')

    wrapper.unmount()
  })

  it('should have custom content from "content" prop', async () => {
    const wrapper = mount(BButtonClose, {
      props: { content: 'Close' }
    })

    expect(wrapper.text()).toContain('Close')

    wrapper.unmount()
  })

  it('should have custom content from default slot', async () => {
    const wrapper = mount(BButtonClose, {
      slots: {
        default: '<i>foobar</i>'
      }
    })

    expect(wrapper.text()).toContain('foobar')

    wrapper.unmount()
  })

  it('should emit "click" event when clicked', async () => {
    let event = null
    const spy1 = jest.fn(e => {
      event = e
    })
    const wrapper = mount(BButtonClose, {
      attrs: { onClick: spy1 },
      slots: {
        default: '<i>some <span>text</span></i>'
      }
    })

    expect(spy1).not.toHaveBeenCalled()

    const btn = wrapper.find('button')
    expect(btn).toBeDefined()
    await btn.trigger('click')

    expect(spy1).toHaveBeenCalled()
    expect(spy1.mock.calls.length).toBe(1)
    expect(event).toBeInstanceOf(MouseEvent)

    // Works when clicking on an inner element
    const span = wrapper.find('span')
    expect(span).toBeDefined()
    await span.trigger('click')

    expect(spy1.mock.calls.length).toBe(2)

    wrapper.unmount()
  })

  it('should not emit "click" event when disabled and clicked', async () => {
    const spy1 = jest.fn()
    const wrapper = mount(BButtonClose, {
      props: {
        disabled: true
      },
      attrs: { onClick: spy1 },
      slots: {
        default: '<i>some <span>text</span></i>'
      }
    })

    expect(spy1).not.toHaveBeenCalled()

    const btn = wrapper.find('button')
    expect(btn).toBeDefined()
    await btn.trigger('click')

    expect(spy1).not.toHaveBeenCalled()

    // For some reason, JSDOM emits a click on button when clicking inner element
    // Although testing in docs, this click is not emitted when disabled
    // Appears to be a bug in JSDOM
    //
    // // Does not emit click on inner element clicks
    // const span = wrapper.find('span')
    // expect(span).toBeDefined()
    // await span.trigger('click')
    //
    // expect(spy1).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('handles multiple click listeners', async () => {
    const spy1 = jest.fn()
    const spy2 = jest.fn()
    const wrapper = mount(BButtonClose, {
      attrs: { onClick: [spy1, spy2] }
    })

    expect(spy1).not.toHaveBeenCalled()
    expect(spy2).not.toHaveBeenCalled()

    const btn = wrapper.find('button')
    expect(btn).toBeDefined()
    await btn.trigger('click')

    expect(spy1).toHaveBeenCalled()
    expect(spy2).toHaveBeenCalled()
    expect(spy1.mock.calls.length).toBe(1)
    expect(spy2.mock.calls.length).toBe(1)

    wrapper.unmount()
  })
})

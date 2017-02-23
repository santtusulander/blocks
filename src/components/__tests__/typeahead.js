import React from 'react'
import { mount } from 'enzyme'

jest.unmock('../typeahead')
import Typeahead from '../typeahead'

describe('Typeahead', () => {
  let subject, error, props = null
  const onChangeMock = jest.fn()

  beforeEach(() => {
    subject = () => {
      props = {
        allowNew: true,
        onChange: onChangeMock,
        options: [],
        multiple: true
      }
      return mount(
        <Typeahead {...props}/>
      )
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
    const component = subject()
    component.setProps({ allowNew: false })
    expect(component.length).toBe(1)
  })

  it('should add new token with ENTER press', () => {
    const component = subject()
    component.instance().handleKeyDown({
      keyCode: 13,
      target: {
        value: 'foo'
      }
    })
    expect(component.find('.token').length).toBe(1)
    expect(component.find('.token').text()).toContain('foo')
  })

  it('should not add new token if value is too short', () => {
    const component = subject()
    component.setProps({ minLength: 5 })
    component.instance().handleKeyDown({
      keyCode: 13,
      target: {
        value: 'foo'
      }
    })
    expect(component.find('.token').length).toBe(0)
  })

  it('should not add new token other than ENTER key pressed', () => {
    const component = subject()
    component.instance().handleKeyDown({
      keyCode: 20,
      target: {
        value: 'foo'
      }
    })
    expect(component.find('.token').length).toBe(0)
  })

  it('should call addEventListener on focus', () => {
    const component = subject()
    const addEventListenerMock = jest.fn()
    component.instance().handleFocus({
      target: {
        addEventListener: addEventListenerMock
      }
    })
    expect(addEventListenerMock.mock.calls.length).toBe(1)
  })

  it('should call removeEventListener on blur', () => {
    const component = subject()
    const removeEventListenerMock = jest.fn()
    component.instance().handleBlur({
      target: {
        removeEventListener: removeEventListenerMock
      }
    })
    expect(removeEventListenerMock.mock.calls.length).toBe(1)
  })
})

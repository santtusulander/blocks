import React from 'react'
import { shallow } from 'enzyme'
import { Button } from 'react-bootstrap'

jest.unmock('../network-item')
import NetworkItem from '../network-item'

describe('NetworkItem', () => {
  let subject, error, props = null
  const onEdit = jest.fn()
  const onSelect = jest.fn()

  beforeEach(() => {
    subject = () => {
      props = {
        onEdit,
        onSelect,
        status: 'enabled',
        isAllowedToConfigure: true
      }
      return shallow(<NetworkItem {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should not show status if not defined', () => {
    const component = subject()
    expect(component.find('.status-indicator').length).toBe(1)
    component.setProps({ status: null })
    expect(component.find('.status-indicator').length).toBe(0)
  })

  it('should call select function on item click', () => {
    const component = subject()
    component.find('div').at(0).simulate('click', {
      isDefaultPrevented: () => false
    })
    expect(onSelect.mock.calls.length).toBe(1)
  })

  it('should call edit function on button click', () => {
    const component = subject()
    component.find('Button').simulate('click', {
      preventDefault: jest.fn()
    })
    expect(onEdit.mock.calls.length).toBe(1)
  })
})

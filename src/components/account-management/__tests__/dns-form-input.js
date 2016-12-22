import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../dns-form-input')
import Input from '../dns-form-input'

// id, required = true, addonAfter, labelID, children, isVisible = true, ...inputProps

const component = visible =>
  <Input id="test" required={true} addonAfter={'test'} labelID="" isVisible={visible}>
    <span id="child"/>
  </Input>

  const nullContent = component(false)
  const input = component()

describe('DnsFormInput', () => {
  it('should exist', () => {
    expect(shallow(input).length).toBe(1)
  })

  it('should show addon after input', () => {
    expect(shallow(input).find('InputGroupAddon').length).toBe(1)
  })

  it('should pass id to FormGroup as controlId', () => {
    expect(shallow(input).find('FormGroup').props().controlId).toBe('test')
  })

  it('should be null', () => {
    expect(shallow(nullContent).find('FormGroup').length).toBe(0)
  })

  it('should show children', () => {
    expect(shallow(input).find('#child').length).toBe(1)
  })
})

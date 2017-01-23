import React from 'react'
import { shallow } from 'enzyme'
import { Button, FormControl } from 'react-bootstrap'

jest.unmock('../number-input.jsx')
import NumberInput from '../number-input'

describe('NumberInput', () => {
  let subject, error, props = null
  const onChange = jest.fn()

  beforeEach(() => {
    subject = () => {
      props = {
        max: 200,
        min: 10,
        onChange,
        value: 100
      }
      return shallow(
        <NumberInput {...props}/>
      )
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should increase the value', () => {
    subject().find('Button').at(0).simulate('click')
    expect(onChange.mock.calls[0][0]).toBe(101)
  })

  it('should decrease the value', () => {
    subject().find('Button').at(1).simulate('click')
    expect(onChange.mock.calls[1][0]).toBe(99)
  })

  it('should not go above max', () => {
    const component = subject()
    component.setProps({ value: 200 })
    component.find('Button').at(0).simulate('click')
    expect(onChange.mock.calls[2][0]).toBe(200)
  })

  it('should not go below min', () => {
    const component = subject()
    component.setProps({ value: 10 })
    component.find('Button').at(1).simulate('click')
    expect(onChange.mock.calls[3][0]).toBe(10)
  })
})

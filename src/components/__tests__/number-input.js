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

  it('should handle non-numeric values properly', () => {
    const component = subject()
    component.find('FormControl').simulate('change', { target: { value: 'foo' } })
    expect(onChange.mock.calls[4][0]).toBe(100)
    component.find('FormControl').simulate('change', { target: { value: '' } })
    expect(onChange.mock.calls[5][0]).toBe(null)
    component.find('FormControl').simulate('change', { target: { value: '25' } })
    expect(onChange.mock.calls[6][0]).toBe(25)
  })

  it('should handle up key presses', () => {
    const component = subject()
    const input = component.find('FormControl')
    input.simulate('keyDown', { keyCode: 38, preventDefault: jest.fn() })
    expect(onChange.mock.calls[7][0]).toBe(101)
  })

  it('should handle down key presses', () => {
    const component = subject()
    const input = component.find('FormControl')
    input.simulate('keyDown', { keyCode: 40, preventDefault: jest.fn() })
    expect(onChange.mock.calls[8][0]).toBe(99)
  })
})

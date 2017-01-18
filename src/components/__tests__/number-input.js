import React from 'react'
import { shallow } from 'enzyme'
import { Button } from 'react-bootstrap'

jest.unmock('../number-input.jsx')
import NumberInput from '../number-input'

describe('NumberInput', () => {
  let subject, error, props = null
  const onChange = jest.fn()

  beforeEach(() => {
    subject = () => {
      props = {
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
})

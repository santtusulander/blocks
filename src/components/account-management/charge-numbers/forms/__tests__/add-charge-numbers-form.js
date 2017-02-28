import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../add-charge-numbers-form')

import AddChargeNumbersForm from '../add-charge-numbers-form'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('AddChargeNumbersForm', () => {
  let subject, error, props, handleSubmit

  beforeEach(() => {
    handleSubmit = jest.fn()

    subject = () => {
      props = {
        handleSubmit,
        hasFlowDirection: false,
        hasGlobalBilling: true,
        hasRegionalBilling: false,
        intl: intlMaker()
      }
      return shallow(<AddChargeNumbersForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should handle onEnable click', () => {
    subject()
      .find('#submit-button')
      .simulate('click')
    expect(handleSubmit.mock.calls.length).toBe(1)
  })

  it('should contain 1 Field', () => {
    expect(subject().find('Field').length).toBe(1)
  })

  it('should contain 2 Fields', () => {
    const props = {
      handleSubmit,
      hasFlowDirection: true,
      hasGlobalBilling: true,
      hasRegionalBilling: true
    }
    const component = shallow(<AddChargeNumbersForm {...props}/>)

    expect(component.find('Field').length).toBe(2)
  })
})

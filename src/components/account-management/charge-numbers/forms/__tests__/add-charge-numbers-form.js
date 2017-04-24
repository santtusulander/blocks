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

    subject = (isEnabled = false, hasGlobalBilling = true, hasRegionalBilling = false) => {
      props = {
        handleSubmit,
        isEnabled: isEnabled,
        hasFlowDirection: false,
        hasGlobalBilling: hasGlobalBilling,
        hasRegionalBilling: hasRegionalBilling,
        intl: intlMaker()
      }
      return shallow(<AddChargeNumbersForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should render 2 Buttons', () => {
    expect(subject().find('Button').length).toBe(2)
  })

  it('should render 3 Buttons when isEnabled equals to true', () => {
    expect(subject(true).find('Button').length).toBe(3)
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

  it('should contain 2 Fields when all billing props euqals to true', () => {
    const props = {
      handleSubmit,
      hasFlowDirection: true,
      hasGlobalBilling: true,
      hasRegionalBilling: true
    }
    const component = shallow(<AddChargeNumbersForm {...props}/>)

    expect(component.find('Field').length).toBe(2)
  })

  it('should contain FieldArray when all regional billing props euqal to true', () => {
    const props = {
      handleSubmit,
      hasFlowDirection: true,
      hasGlobalBilling: false,
      hasRegionalBilling: true
    }
    const component = shallow(<AddChargeNumbersForm {...props}/>)

    expect(component.find('FieldArray').length).toBe(1)
  })

  it('should not contain FieldArray when all regional billing props euqal to true and global billing also euqal to true ', () => {
    const props = {
      handleSubmit,
      hasFlowDirection: true,
      hasGlobalBilling: true,
      hasRegionalBilling: true
    }
    const component = shallow(<AddChargeNumbersForm {...props}/>)

    expect(component.find('FieldArray').length).toBe(0)
  })
})

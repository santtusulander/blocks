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
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        handleSubmit: jest.genMockFunction(),
        intl: intlMaker()
      }
      return shallow(<AddChargeNumbersForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})

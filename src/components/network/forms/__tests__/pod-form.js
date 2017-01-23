import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../pod-form')
import PodForm from '../pod-form'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('PodForm', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        accountIsServiceProviderType: false,
        handleSubmit: jest.genMockFunction(),
        intl: intlMaker()
      }
      return shallow(<PodForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})

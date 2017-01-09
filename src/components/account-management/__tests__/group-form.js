import React from 'react'
import { shallow } from 'enzyme'

import { List } from 'Immutable';

jest.unmock('../group-form')
import GroupForm from '../group-form'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('GroupForm', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        accountIsServiceProviderType: false,
        handleSubmit: jest.genMockFunction(),
        intl: intlMaker()
      }
      return shallow(<GroupForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})

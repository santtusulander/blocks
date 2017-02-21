import React from 'react'
import { shallow } from 'enzyme'

import { List } from 'immutable';

jest.unmock('../group-form')
import GroupForm from '../group-form'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('GroupForm', () => {
  let subject, error, props = null
  let locationPermissions = {}

  beforeEach(() => {
    subject = (permissions = {}) => {
      locationPermissions = {createAllowed: true, deleteAllowed: true, modifyAllowed: true, ...permissions}
      props = {
        accountIsServiceProviderType: false,
        handleSubmit: jest.genMockFunction(),
        intl: intlMaker(),
        locationPermissions
      }
      return shallow(<GroupForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})

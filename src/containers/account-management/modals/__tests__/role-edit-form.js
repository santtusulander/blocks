import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../role-edit-form')
import RolesEditForm from '../role-edit-form'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

const fieldMock = {
  touched: 'foo',
  error: 'bar'
}

const fieldsMock = {
  roleName: fieldMock
}

describe('RolesEditForm', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        handleSubmit: jest.genMockFunction(),
        editRole: Immutable.Map(),
        editPermsUI: Immutable.Map(),
        fields: fieldsMock,
        intl: intlMaker(),
        params: { brand: 'foo', account: 'bar', group: 'zyx', property: 'qwe' },
        initialValues: {
          roleName: ''
        }
      }
      return shallow(<RolesEditForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})

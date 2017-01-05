import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../group-form')
import GroupForm from '../group-form'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

function hostActionsMaker() {
  return {
    fetchHosts: jest.fn(),
    startFetching: jest.fn()
  }
}

const fieldMock = {
  touched: 'foo',
  error: 'bar'
}

const fieldsMock = {
  name: fieldMock,
  charge_id: fieldMock,
  charge_model: fieldMock
}

describe('GroupForm', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        fields: fieldsMock,
        intl: intlMaker(),
        hostActions: hostActionsMaker(),
        params: { brand: 'foo', account: 'bar', group: 'zyx', property: 'qwe' }
      }
      return shallow(<GroupForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})

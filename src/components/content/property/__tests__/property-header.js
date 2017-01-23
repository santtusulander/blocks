import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../property-header.jsx')
import PropertyHeader from '../property-header'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

function routerMaker() {
  return {
    isActive: val => val
  }
}

const params = { brand: 'foo', account: 'bar', group: 'zyx', property: 'qwe' }

describe('PropertyHeader', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        currentUser: Immutable.Map(),
        deleteProperty: jest.fn(),
        intl: intlMaker(),
        params,
        router: routerMaker(),
        togglePurge: jest.fn()
      }
      return shallow(<PropertyHeader {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})

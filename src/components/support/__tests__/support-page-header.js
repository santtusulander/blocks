import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../support-page-header')
import SupportPageHeader from '../support-page-header'

jest.mock('../../../util/routes', () => { return {
  getSupportUrlFromParams: () => 'foo'
}})

function routerMaker(location) {
  return {
    isActive: route => route === location
  }
}

describe('SupportPageHeader', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = (location) => {
      props = {
        activeAccount: Immutable.Map(),
        params: { brand: 'foo' },
        router: routerMaker(`foo/${location}`)
      }
      return shallow(<SupportPageHeader {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
    expect(subject('tickets').length).toBe(1)
    expect(subject('tools').length).toBe(1)
    expect(subject('documentation').length).toBe(1)
  })
})

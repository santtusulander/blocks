import React from 'react'
import { shallow } from 'enzyme'
import { Map, List } from 'immutable'

jest.unmock('../navigation.jsx')
import Navigation from '../navigation.jsx'

function fakeRouterMaker() {
  return {
    isActive: jest.fn()
  }
}

describe('Navigation', () => {
  let subject = null

  const currentUser = new Map()
  const params = {account: "1", brand: "udn"}
  const roles = new List()
  const router = fakeRouterMaker()
  const activeAccount = new Map()

  beforeEach(() => {
    subject = () => {
      let props = {
        currentUser,
        params,
        roles,
        router,
        activeAccount
      }

      return shallow(<Navigation {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should have ul tag', () => {
    expect(subject().find('ul').length).toBe(1)
  })
})

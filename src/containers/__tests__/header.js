import React from 'react';
import { shallow } from 'enzyme'
import { Map, List } from 'immutable'

jest.unmock('../header.jsx');
import Header from '../header.jsx'

function fakeRouterMaker() {
  return {
    push: jest.fn(),
    isActive: jest.fn()
  }
}

describe('Header', function() {
  let subject = null
  const activeAccount = new Map()
  const activeGroup = new Map()
  const className = ""
  const fetching = false
  const handleThemeChange = jest.genMockFunction()
  const logOut = jest.genMockFunction()
  const params = {account: "1", brand: "udn"}
  const pathname = ""
  const roles = new List()
  const router = fakeRouterMaker()
  const theme = ""
  const user = new Map()

  beforeEach(() => {
    subject = () => {
      let props = {
        activeAccount,
        activeGroup,
        className,
        fetching,
        handleThemeChange,
        logOut,
        params,
        pathname,
        roles,
        router,
        theme,
        user
      }

      return shallow(<Header {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})

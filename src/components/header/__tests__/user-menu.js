import React from 'react';
import { shallow } from 'enzyme'
import { Map } from 'immutable'

jest.unmock('../user-menu.jsx');
import UserMenu from '../user-menu.jsx'

describe('UserMenu', function() {
  let subject = null

  const open = false
  const onToggle = jest.genMockFunction()
  const handleThemeChange = jest.genMockFunction()
  const logout = jest.genMockFunction()
  const params = {account: "1", brand: "udn"}
  const theme = ""
  const user = new Map()

  beforeEach(() => {
    subject = () => {
      let props = {
        open,
        onToggle,
        theme,
        handleThemeChange,
        logout,
        user,
        params
      }

      return shallow(<UserMenu {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})

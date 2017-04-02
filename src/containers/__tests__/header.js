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
  const handleThemeChange = jest.fn()
  const logOut = jest.fn()
  const params = {account: "1", brand: "udn"}
  const pathname = ""
  const roles = new Map()
  const router = fakeRouterMaker()
  const theme = ""
  const user = new Map()

  beforeEach(() => {
    subject = (props = {}) => {
      let defaultProps = {
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

      const finalProps = Object.assign({}, defaultProps, props)

      return shallow(<Header {...finalProps} />)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should accept a className', () => {
    expect(subject({className: 'test'}).at(0).hasClass('test')).toBe(true)
  })

  it('should handle theme changes', () => {
    const handleThemeChange = jest.fn()
    const component = subject({ handleThemeChange })
    component.instance().handleThemeChange('light')

    expect(handleThemeChange.mock.calls.length).toBe(1)
  })

  it('should toggle the user menu', () => {
    const component = subject()
    expect(component.state().userMenuOpen).toBe(false)
    component.instance().toggleUserMenu()
    expect(component.state().userMenuOpen).toBe(true)
  })

  it('should have a loading bar', () => {
    expect(subject().find('GlobalLoadingBar').length).toBe(1)
  })

  it('should have a logo', () => {
    expect(subject().find('LogoItem').length).toBe(1)
  })

  it('should have an account selector', () => {
    expect(subject().find('AccountSelectorItem').length).toBe(1)
  })

  it('should have breadcrumbs', () => {
    expect(subject().find('BreadcrumbsItem').length).toBe(1)
  })

  it('should have a user menu', () => {
    expect(subject().find('UserMenu').length).toBe(1)
  })
})

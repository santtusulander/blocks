import React from 'react';
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../logo-item.jsx')
jest.unmock('../../../util/routes')
jest.unmock('../../../util/helpers')
jest.unmock('../../../constants/account-management-options')
jest.unmock('../../../constants/provider-types.js')
import LogoItem from '../logo-item.jsx'

describe('LogoItem', function() {
  let subject = null

  const defaultUser = new Immutable.Map({roles: [1]})

  beforeEach(() => {
    subject = (props) => {
      let defaultProps = {
        user: defaultUser
      }

      const finalProps = Object.assign({}, defaultProps, props)
      return shallow(<LogoItem {...finalProps}/>)
    }
  })

  it('should exist', () => {
    const component = subject()
    expect(component).toBeDefined()
  })

  it('should have a link', () => {
    const component = subject()
    expect(component.find('Link').length).toBeGreaterThan(0)
  })

  it('should set link on mount and update', () => {
    const component = subject()
    const updateMock = jest.fn()
    component.instance().updateLogoLink = updateMock

    component.instance().componentDidMount()
    component.instance().componentWillReceiveProps({user: defaultUser})

    expect(updateMock.mock.calls.length).toBe(2)
  })

  it('should link SPs to the dashboard section', () => {
    const serviceProvider = Immutable.Map({account_id: 1, roles: Immutable.List([3])})
    const component = subject({user: serviceProvider})
    component.instance().componentDidMount()
    expect(component.state().logoLink).toBe('/dashboard/udn/1')
  })

  it('should link non-SPs to the content section', () => {
    const nonServiceProvider = Immutable.Map({account_id: 1, roles: Immutable.List([1])})
    const component = subject({user: nonServiceProvider})
    component.instance().componentDidMount()
    expect(component.state().logoLink).toBe('/content/udn/1')
  })

  it('should only update when the link changes', () => {
    const component = subject()
    let shouldUpdate = component.instance().shouldComponentUpdate({}, {logoLink: 'abc'})
    expect(shouldUpdate).toBeTruthy()

    shouldUpdate = component.instance().shouldComponentUpdate({}, {logoLink: '', someOtherState: 'abc'})
    expect(shouldUpdate).toBeFalsy()
  })
})

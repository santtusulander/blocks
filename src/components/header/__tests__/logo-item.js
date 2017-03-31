import React from 'react';
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../logo-item.jsx')
jest.unmock('../../../util/routes')
//jest.unmock('../../../util/helpers')
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
})

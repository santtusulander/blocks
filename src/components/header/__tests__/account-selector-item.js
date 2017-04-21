import React from 'react';
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../account-selector-item.jsx')
import AccountSelectorItem from '../account-selector-item.jsx'

describe('AccountSelectorItem', function() {
  let subject = null

  const defaultUser = new Immutable.Map()

  beforeEach(() => {
    subject = (props) => {
      let defaultProps = {
        user: defaultUser
      }

      const finalProps = Object.assign({}, defaultProps, props)
      return shallow(<AccountSelectorItem {...finalProps}/>)
    }
  })

  it('should exist', () => {
    const component = subject({ params: { account: 1 } })
    expect(component).toBeDefined()
  })
})

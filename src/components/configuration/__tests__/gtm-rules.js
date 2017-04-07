import React from 'react'
import { fromJS } from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../gtm-rules')
import ConfigurationGTMTrafficRules from '../gtm-rules'

describe('ConfigurationGTMTrafficRules', () => {

  let subject = null

  const intlMaker = () => {
    return {
      formatMessage: jest.fn()
    }
  }

  beforeEach(() => {
    subject = (props) => {
      let defaultProps = Object.assign({}, {
        cancelDeletePolicyRoute: () => {},
        intl: intlMaker()
      }, props)
      return shallow(<ConfigurationGTMTrafficRules {...defaultProps}/>)
    }
  })


  it('should exist', () => {
    expect(subject()).toBeDefined()
  });
})

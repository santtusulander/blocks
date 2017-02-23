import React from 'react';
import { fromJS } from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../token-authentication.jsx');
import TabTokenAuthentication from '../token-authentication.jsx'

const params = { brand: 'foo', account: 'bar', group: 'zyx' }

describe('TabTokenAuthentication', function() {
  let error, subject, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        fetchProperties: jest.fn(),
        params,
        properties: fromJS([{id: 1}])
      }
      return shallow(<TabTokenAuthentication {...props} />)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('shows loading spinner', () => {
    const component = subject()
    component.setProps({ isFetching: true })
    expect(component.find('LoadingSpinner').length).toBe(1)
  })
})

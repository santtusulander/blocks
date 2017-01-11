import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../cache-key-query-string-form.jsx')
import CacheKeyQueryStringForm from '../cache-key-query-string-form.jsx'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

const set = (field_name) => {
  return Immutable.fromJS({
    name: [{
      field: field_name,
      field_detail: ['bar']
    }]
  })
}

describe('CacheKeyQueryStringForm', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = (field_name) => {
      props = {
        intl: intlMaker(),
        set: set(field_name || 'request_query')
      }
      return shallow(<CacheKeyQueryStringForm {...props}/>)
    }
  })

  it('should exist', () => {
    const component = subject()
    expect(component.length).toBe(1)
    expect(subject('request_query_arg').length).toBe(1)
    component.setProps({ horizontal: true })
    component.setState({ activeFilter: 'include_some_parameters' })
    expect(component.length).toBe(1)
  })
})

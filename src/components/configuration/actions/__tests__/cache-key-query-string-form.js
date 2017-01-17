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
      field_detail: ''
    }]
  })
}

describe('CacheKeyQueryStringForm', () => {
  let subject, error, props = null

  beforeEach(() => {
    const updateSet = jest.fn()

    subject = (field_name) => {
      props = {
        intl: intlMaker(),
        set: set(field_name),
        updateSet
      }
      return shallow(<CacheKeyQueryStringForm {...props}/>)
    }
  })

  it('should exist', () => {
    const component = subject()

    expect(component.length).toBe(1)
  })

  it('should update state with "ignore_all_query_parameters" filter value', () => {
    const component = subject()

    component.setProps({ horizontal: true })
    expect(component.state('activeFilter')).toBe('ignore_all_query_parameters')
    expect(component.state('queryArgs').size).toBe(0)
  })

  it('should update state with "include_all_query_parameters" filter', () => {
    const component = subject('request_query')
    
    component.setProps({ horizontal: true })
    expect(component.state('activeFilter')).toBe('include_all_query_parameters')
    expect(component.state('queryArgs').size).toBe(0)
  })

  it('should update state with "include_some_parameters" filter', () => {
    const component = subject('request_query_arg')

    component.setProps({ horizontal: true })
    expect(component.state('activeFilter')).toBe('include_some_parameters')
    expect(component.state('queryArgs').size).toBe(1)
  })

  it('should update set with 2 items', () => {
    const component = subject()

    const mock = {
      name: [
        {field: 'request_host'},
        {field: 'request_path'}
      ]}

    component.instance().handleSelectChange('ignore_all_query_parameters')

    expect(component.instance().props.updateSet.mock.calls[0][0]).toEqual(Immutable.fromJS(mock))
  })

  it('should update set with 3 items', () => {
    const component = subject()
    const mock = {
      name: [
        {field: 'request_host'},
        {field: 'request_path'},
        {field: 'request_query'}
      ]}

    component.instance().handleSelectChange('include_all_query_parameters')

    expect(component.instance().props.updateSet.mock.calls[0][0]).toEqual(Immutable.fromJS(mock))
  })

  it('should update set with 5 items', () => {
    const component = subject()
    const mock = {
      name: [
        {field: 'request_host'},
        {field: 'request_path'},
        {field: 'request_query_arg', field_detail: ''},
        {field: 'request_query_arg', field_detail: 'aaa'},
        {field: 'request_query_arg', field_detail: 'bbb'}
      ]}

    component.setState({
      activeFilter: 'include_some_parameters',
      queryArgs: ['aaa', 'bbb']
    })

    component.instance().updateSet()

    expect(component.instance().props.updateSet.mock.calls[0][0]).toEqual(Immutable.fromJS(mock))
  })
})

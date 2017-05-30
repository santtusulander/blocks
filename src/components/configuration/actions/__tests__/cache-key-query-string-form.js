jest.unmock('../cache-key-query-string-form.jsx')

import React from 'react'
import { shallow } from 'enzyme'
import { fromJS, Map } from 'immutable'

import CacheKeyQueryStringForm from '../cache-key-query-string-form.jsx'

describe('CacheKeyQueryStringForm', () => {
  let handleSubmit, saveAction, close, dispatch, component, changeValue
  const intlMaker = () => { return { formatMessage: jest.fn() } }

  beforeEach(() => {
    handleSubmit = jest.fn()
    changeValue = jest.fn()
    dispatch = jest.fn()
    close = jest.fn()
    saveAction = jest.fn()
 
    const props = {
      dispatch,
      handleSubmit,
      changeValue,
      saveAction,
      close,
      invalid: false,
      intl: intlMaker()
    }
    component = shallow(<CacheKeyQueryStringForm {...props}/>)
  })

  it('should exist', () => {
    expect(component.length).toBe(1)
  })

  it('should have 1 Fields', () => {
    expect(component.find('Field').length).toBe(1)
  })

  it('should call saveAction', () => {
    component.instance().saveChanges({
      activeFilter: 'include_all_query_parameters',
      queryArgs: ['123']
    })

    expect(saveAction.mock.calls.length).toBe(1)
  })

  it('should call saveAction with "Include all" params', () => {
    component.instance().saveChanges({
      activeFilter: 'include_all_query_parameters',
      queryArgs: ['123']
    })

    const result = {
      name: [
        {field: 'request_host'}, 
        {field: 'request_path'},
        {field: 'request_query'}
      ]
    }

    expect(saveAction.mock.calls[0][2]).toEqual(result)
  })

  it('should call saveAction with "Ignore all" params', () => {
    component.instance().saveChanges({
      activeFilter: 'ignore_all_query_parameters',
      queryArgs: ['123']
    })

    const result = {
      name: [
        {field: 'request_host'}, 
        {field: 'request_path'}
      ]
    }

    expect(saveAction.mock.calls[0][2]).toEqual(result)
  })

  it('should call saveAction with "Include some" params', () => {
    component.instance().saveChanges({
      activeFilter: 'include_some_parameters',
      queryArgs: ['123']
    })

    const result = {
      name: [
        {field: 'request_host'}, 
        {field: 'request_path'},
        {field: 'request_query_arg', field_detail:'123'}
      ]
    }

    expect(saveAction.mock.calls[0][2]).toEqual(result)
  })

  it('should call saveAction and avoid empty fields', () => {
    component.instance().saveChanges({
      activeFilter: 'include_some_parameters',
      queryArgs: ['123', '']
    })

    const result = {
      name: [
        {field: 'request_host'}, 
        {field: 'request_path'},
        {field: 'request_query_arg', field_detail:'123'}
      ]
    }

    expect(saveAction.mock.calls[0][2]).toEqual(result)
  })

  it('should handle cancel click', () => {
    component.find('Button').at(0).simulate('click')

    expect(close.mock.calls.length).toBe(1)
  })

  it('should handle submit click', () => {
    component.find('Button').at(1).simulate('click')

    expect(handleSubmit.mock.calls.length).toBe(1)
  })
})

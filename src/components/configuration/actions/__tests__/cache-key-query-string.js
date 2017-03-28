jest.unmock('../cache-key-query-string.jsx')

import React from 'react'
import { shallow } from 'enzyme'

import CacheKeyQueryString from '../cache-key-query-string.jsx'

describe('CacheKeyQueryString', () => {
  let subject = null
  let props = {}
  let saveAction = null
  let close = null
  beforeEach(() => {
    saveAction = jest.fn()
    close = jest.fn()
    subject = () => {
      props = {
        saveAction,
        close
      }
      return shallow(<CacheKeyQueryString {...props}/>)
    }
  })
  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
  //TODO-2277

  // it('should handle save-button click', () => {
  //   subject().find('#save-button').simulate('click')
  //   expect(changeValue.mock.calls.length).toBe(1)
  //   expect(close.mock.calls.length).toBe(1)
  // })

  // it('should handle close-button click', () => {
  //   subject().find('#close-button').simulate('click')
  //   expect(close.mock.calls.length).toBe(1)
  // })

  // it('should set correct state', () => {
  //   const component = subject()
  //   component.instance().updateSet('aaa')
  //   expect(component.state().updatedSet).toBe('aaa')

  // })
})

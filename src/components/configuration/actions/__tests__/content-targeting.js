jest.unmock('../content-targeting.jsx')

import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../../../../util/status-codes');
import ContentTargeting from '../content-targeting.jsx'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('ContentTargeting', () => {
  let subject = null
  let props = {}, close, handleSubmit, change
  const fakeConfig = Immutable.fromJS({ "code": 200 })

  const fakePath = Immutable.List(['foo', 'bar'])
  beforeEach(() => {
    handleSubmit = jest.fn()
    close = jest.fn()
    change = jest.fn()
    close = jest.fn()
    subject = () => {
      props = {
        set: fakeConfig,
        path: fakePath,
        handleSubmit,
        change,
        close,
        intl: intlMaker()
      }
      return shallow(<ContentTargeting {...props}/>)
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

  //   component.instance().handleTypeChange()('deny')
  //   expect(component.state('type')).toBe('deny')
  //   expect(component.state('status_code')).toBe(401)
  //   expect(component.state('redirectURL')).toBeUndefined()

  //   component.instance().handleTypeChange()('redirect')
  //   expect(component.state('type')).toBe('redirect')
  //   expect(component.state('status_code')).toBe(302)
  //   expect(component.state('redirectURL')).toBeDefined()

  //   component.instance().handleTypeChange()('allow')
  //   expect(component.state('type')).toBe('allow')
  //   expect(component.state('status_code')).toBe(200)
  //   expect(component.state('redirectURL')).toBeUndefined()
  // })
})

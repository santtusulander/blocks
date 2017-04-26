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
  let props = {}, close, handleSubmit, change, saveAction
  const fakeConfig = Immutable.fromJS({ "code": 200 })

  const fakePath = Immutable.List(['foo', 'bar'])
  beforeEach(() => {
    handleSubmit = jest.fn()
    close = jest.fn()
    change = jest.fn()
    close = jest.fn()
    saveAction = jest.fn()

    subject = () => {
      props = {
        set: fakeConfig,
        path: fakePath,
        handleSubmit,
        saveAction,
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

  it('should handle cancel click', () => {
    subject().find('Button').at(0).simulate('click')

    expect(close.mock.calls.length).toBe(1)
  })

  it('should handle submit click', () => {
    subject().find('Button').at(1).simulate('click')

    expect(handleSubmit.mock.calls.length).toBe(1)
  })

  it('should call saveAction with Allow params', () => {
    const component = subject()

    const values = {
      code: 200
    } 

    const expectedSave = {
      code: 200,
      location: ''
    }

    component.instance().saveChanges(values)

    expect(saveAction).toBeCalled()
    expect(saveAction.mock.calls[0][0].toJS()).toEqual(['foo', 'bar'])
    expect(saveAction.mock.calls[0][2]).toEqual(expectedSave)
  })

  it('should call saveAction with Redirect params', () => {
    const component = subject()

    const values = {
      code: 302,
      location: 'www.qwerty.com'
    } 

    const expectedSave = {
      code: 302,
      location: 'www.qwerty.com'
    }

    component.instance().saveChanges(values)

    expect(saveAction).toBeCalled()
    expect(saveAction.mock.calls[0][0].toJS()).toEqual(['foo', 'bar'])
    expect(saveAction.mock.calls[0][2]).toEqual(expectedSave)
  })

  it('should call saveAction with Deny params', () => {
    const component = subject()

    const values = {
      code: 401
    } 

    const expectedSave = {
      code: 401,
      location: ''
    }

    component.instance().saveChanges(values)

    expect(saveAction).toBeCalled()
    expect(saveAction.mock.calls[0][0].toJS()).toEqual(['foo', 'bar'])
    expect(saveAction.mock.calls[0][2]).toEqual(expectedSave)
  })
})

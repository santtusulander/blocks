import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../negative-cache.jsx')
jest.unmock('../../helpers.js')

import NegativeCache from '../negative-cache.jsx'

const fakeConfig = Immutable.fromJS({
  "value": [["foo"]]
})

const fakePath = Immutable.fromJS(['foo', 'bar'])

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('NegativeCache', () => {
  let handleSubmit, close, change, component, saveAction

  beforeEach(() => {
    handleSubmit = jest.fn()
    close = jest.fn()
    change = jest.fn()
    saveAction = jest.fn()

    let props = {
      change,
      handleSubmit,
      close,
      invalid: false,
      set: Immutable.Map(),
      intl: intlMaker(),
      //saveChanges: jest.fn(),
      path: Immutable.List(['foo', 'bar']),
      setKey: 'negative_cache',
      saveAction
    }

    component = shallow(<NegativeCache {...props} />)
  })

  it('should exist', () => {
    expect(component).toBeTruthy();
  })

  it('should save changes', () => {
    const values = {
      cacheable: true,
      source: 'origin',
      body: 'body',
      ttlValue: 123,
      ttlUnit: 'seconds'
    } 

    const expectedSave = {
      cacheable: true,
      source: 'origin',
      body: 'body',
      max_age: 123
    }

    component.instance().saveChanges(values)

    expect(saveAction).toBeCalled()
    expect(saveAction.mock.calls[0][0].toJS()).toEqual(['foo', 'bar'])
    expect(saveAction.mock.calls[0][2]).toEqual(expectedSave)
  })
})

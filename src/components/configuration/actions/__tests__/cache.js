import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../cache.jsx')
jest.unmock('../../helpers.js')

import Cache from '../cache.jsx'

const fakeConfig = Immutable.fromJS({
  "value": [["foo"]]
})

const fakePath = Immutable.fromJS(['foo', 'bar'])

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('Cache', () => {
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
      path: Immutable.List(['foo', 'bar']),
      setKey: 'cache_name',
      saveAction
    }

    component = shallow(<Cache {...props} />)
  })

  it('should exist', () => {
    expect(component).toBeTruthy();
  })

  it('should save changes', () => {
    const values = {
      noStore: false,
      checkEtag: 'aaa',
      honorOrigin: true,
      ttlValue: 123,
      ttlUnit: 'seconds' } 

    const expectedSave = {
      check_etag: 'aaa',
      honor_origin: true,
      max_age: 123,
      no_store: false
    }

    component.instance().saveChanges(values)

    expect(saveAction).toBeCalled()
    expect(saveAction.mock.calls[0][0].toJS()).toEqual(['foo', 'bar'])
    expect(saveAction.mock.calls[0][2]).toEqual(expectedSave)
  })
})

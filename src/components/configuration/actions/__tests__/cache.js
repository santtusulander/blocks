import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../cache.jsx')
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
  let handleSubmit, close, change, component

  beforeEach(() => {
    handleSubmit = jest.fn()
    close = jest.fn()
    change = jest.fn()

    let props = {
      change,
      handleSubmit,
      close,
      invalid: false,
      set: Immutable.Map(),
      intl: intlMaker(),
      saveAction: jest.fn()
    }

    component = shallow(<Cache {...props} />)
  })

  it('should exist', () => {
    expect(component).toBeTruthy();
  })

  it('should save changes', () => {
    const changeValue = jest.genMockFunction()
    const close = jest.genMockFunction()
    const values = { noStore, checkEtag, honorOrigin, ttlValue, ttlUnit } 
    const expectedSave = Immutable.fromJS({
      check_etag: 'aaa',
      honor_origin: true,
      max_age: 123,
      no_store: false
    })

    component.instance().saveChanges()

    expect(changeValue.mock.calls[0][0].toJS()).toEqual(['foo', 'bar'])
    expect(Immutable.is(changeValue.mock.calls[0][1], expectedSave)).toBeTruthy()
  })
})

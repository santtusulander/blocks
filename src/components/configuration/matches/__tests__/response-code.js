import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../response-code.jsx')
jest.unmock('../../../../util/status-codes')
import ResponseCode from '../response-code.jsx'

const fakeConfig = Immutable.fromJS({
  type: 'regexp',
  value: '200|400|500'
})

const fakePath = Immutable.List(['foo', 'bar'])

describe('ResponseCode', () => {
  let handleSubmit, close, change, changeValue, component, activateMatch

  beforeEach(() => {
    handleSubmit = jest.fn()
    close = jest.fn()
    change = jest.fn()
    changeValue = jest.fn()
    activateMatch = jest.fn()

    let props = {
      change,
      changeValue,
      handleSubmit,
      activateMatch,
      close,
      invalid: false,
      match: fakeConfig,
      path: fakePath
    }

    component = shallow(<ResponseCode {...props} />)
  })

  it('should exist', () => {
    expect(component).toBeDefined()
  })

  it('should handle cancel click', () => {
    component.find('Button').at(0).simulate('click')

    expect(close.mock.calls.length).toBe(1)
  })

  it('should handle submit click', () => {
    component.find('Button').at(1).simulate('click')

    expect(handleSubmit.mock.calls.length).toBe(1)
  })

  it('should call changeValue', () => {
    component.instance().saveChanges({})

    expect(changeValue.mock.calls.length).toBe(1)
  })

  it('should call changeValue with params', () => {
    component.instance().saveChanges({
      codes: Immutable.List([400, 500])
    })

    expect(changeValue.mock.calls.length).toBe(1)

    const result = {
      type: 'regexp',
      value: '400|500'
    }

    expect(changeValue.mock.calls[0][1].toJS()).toEqual(result)
  })
})

import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../matcher.jsx')
import Matcher from '../matcher.jsx'

const fakeConfig = Immutable.fromJS({
  type: 'contains',
  value: '123'
})

const fakePath = Immutable.List(['foo', 'bar'])

describe('Matcher', () => {
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
      path: fakePath,
      hasExists: true,
      hasEquals: true,
      hasContains: true,
      hasEmpty: true,
      hasFieldDetail: true
    }

    component = shallow(<Matcher {...props} />)
  })

  it('should exist', () => {
    expect(component).toBeDefined()
  })

  it('should have 8 filter options', () => {
    expect(component.instance().getFilterOptions().length).toBe(8)
  })

  it('should have 3 Fields', () => {
    expect(component.find('Field').length).toBe(3)
  })

  it('should have 2 Fields', () => {
    component.setProps({ hasFieldDetail: false })

    expect(component.find('Field').length).toBe(2)
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

  it('should call changeValue with contains filter', () => {
    component.instance().saveChanges({
      activeFilter: 'contains',
      containsVal: '123',
      val: 'header'
    })

    expect(changeValue.mock.calls.length).toBe(1)

    const result = {
      type: 'substr',
      value: '123',
      inverted: false,
      field_detail: 'header'
    }

    expect(changeValue.mock.calls[0][1].toJS()).toEqual(result)
  })

  it('should call changeValue with does_not_contain filter', () => {
    component.instance().saveChanges({
      activeFilter: 'does_not_contain',
      containsVal: '123',
      val: 'header'
    })

    expect(changeValue.mock.calls.length).toBe(1)

    const result = {
      type: 'substr',
      value: '123',
      inverted: true,
      field_detail: 'header'
    }

    expect(changeValue.mock.calls[0][1].toJS()).toEqual(result)
  })

  it('should call changeValue with exists filter and return no value', () => {
    component.setProps({ hasFieldDetail: false })
    component.instance().saveChanges({
      activeFilter: 'exists',
      val: '123'
    })

    expect(changeValue.mock.calls.length).toBe(1)

    const result = {
      type: 'exists',
      value: '',
      inverted: false
    }

    expect(changeValue.mock.calls[0][1].toJS()).toEqual(result)
  })

  it('should call changeValue with does_not_exist filter and return no value', () => {
    component.setProps({ hasFieldDetail: false })
    component.instance().saveChanges({
      activeFilter: 'does_not_exist',
      val: '123'
    })

    expect(changeValue.mock.calls.length).toBe(1)

    const result = {
      type: 'exists',
      value: '',
      inverted: true
    }

    expect(changeValue.mock.calls[0][1].toJS()).toEqual(result)
  })

  it('should call changeValue with exists filter and populate field_detail', () => {
    component.instance().saveChanges({
      activeFilter: 'exists',
      val: '123'
    })

    expect(changeValue.mock.calls.length).toBe(1)

    const result = {
      type: 'exists',
      field_detail: '123',
      inverted: false
    }

    expect(changeValue.mock.calls[0][1].toJS()).toEqual(result)
  })

  it('should call changeValue with does_not_exist filter and populate field_detail', () => {
    component.instance().saveChanges({
      activeFilter: 'does_not_exist',
      val: '123'
    })

    expect(changeValue.mock.calls.length).toBe(1)

    const result = {
      type: 'exists',
      field_detail: '123',
      inverted: true
    }

    expect(changeValue.mock.calls[0][1].toJS()).toEqual(result)
  })

  it('should call changeValue with empty filter and return no value', () => {
    component.setProps({ hasFieldDetail: false })
    component.instance().saveChanges({
      activeFilter: 'empty',
      val: '123'
    })

    expect(changeValue.mock.calls.length).toBe(1)

    const result = {
      type: 'empty',
      value: '',
      inverted: false
    }

    expect(changeValue.mock.calls[0][1].toJS()).toEqual(result)
  })

  it('should call changeValue with does_not_empty filter and return no value', () => {
    component.setProps({ hasFieldDetail: false })
    component.instance().saveChanges({
      activeFilter: 'does_not_empty',
      val: '123'
    })

    expect(changeValue.mock.calls.length).toBe(1)

    const result = {
      type: 'empty',
      value: '',
      inverted: true
    }

    expect(changeValue.mock.calls[0][1].toJS()).toEqual(result)
  })

  it('should call changeValue with empty filter and populate field_detail', () => {
    component.instance().saveChanges({
      activeFilter: 'empty',
      val: '123'
    })

    expect(changeValue.mock.calls.length).toBe(1)

    const result = {
      type: 'empty',
      field_detail: '123',
      inverted: false
    }

    expect(changeValue.mock.calls[0][1].toJS()).toEqual(result)
  })

  it('should call changeValue with does_not_empty filter and populate field_detail', () => {
    component.instance().saveChanges({
      activeFilter: 'does_not_empty',
      val: '123'
    })

    expect(changeValue.mock.calls.length).toBe(1)

    const result = {
      type: 'empty',
      field_detail: '123',
      inverted: true
    }

    expect(changeValue.mock.calls[0][1].toJS()).toEqual(result)
  })

})

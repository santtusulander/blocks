import React from 'react'
import { List } from 'immutable'
import { shallow } from 'enzyme'

jest.mock('../../../../../constants/configuration', () => {
  return {
    SCHEMA_OPTIONS: [
      {
        label: 'Value 1',
        value: 1
      },
      {
        label: 'Value 2',
        value: 2
      },
      {
        label: 'Value 3',
        value: 3
      }
    ]
  }
})

jest.unmock('../token-schema.jsx')

import TokenSchema from '../token-schema.jsx'

describe('TokenSchema', () => {
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
      intl: { formatMessage: v => v.id },
      schema: List([1, 3]),
      selectedSchema: List([1, 3])
    }

    component = shallow(<TokenSchema {...props} />)
  })

  it('should exist', () => {
    expect(component).toBeTruthy()
  })

  it('should handle cancel click', () => {
    component.find('Button').at(0).simulate('click')

    expect(close.mock.calls.length).toBe(1)
  })

  it('should handle submit click', () => {
    component.find('Button').at(1).simulate('click')
 
    expect(handleSubmit.mock.calls.length).toBe(1)
  })

  it('should have "Value 1 + Value 3" label', () => {
    expect(component.find('strong').text()).toBe('Value 1 + Value 3')
  })
})

import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../sortable-multi-selector.jsx')

import SortableMultiSelector from '../sortable-multi-selector.jsx'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

const fakeOptions = [
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

describe('SortableMultiSelector', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        onChange: jest.fn(),
        value: Immutable.List([ 1, 2 ]),
        options: fakeOptions
      }
      return shallow(
        <SortableMultiSelector {...props}/>
      )
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should have ButtonDropdown', () => {
    expect(subject().find('ButtonDropdown').length).toBe(1)
  })

  it('should have 3 options in ButtonDropdown', () => {
    expect(subject().find('ButtonDropdown').prop('options').length).toBe(3)
  })

  it('should have 2 options disabled in ButtonDropdown', () => {
    const ButtonDropdown = subject().find('ButtonDropdown')
    const options = ButtonDropdown.prop('options')

    expect(options.filter(opt => opt.disabled).length).toBe(2)
  })

  it('should have 1 sortableList', () => {
    expect(subject().find('sortableList').length).toBe(1)
  })

  it('should have 2 sortable items', () => {
    const myContainerComponentWrapper = subject().find('sortableList')

    expect(myContainerComponentWrapper.prop('items').size).toBe(2)
  })
})

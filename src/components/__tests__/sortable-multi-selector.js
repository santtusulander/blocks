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

})

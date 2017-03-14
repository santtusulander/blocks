import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../field-sortable-multi-selector')
import FieldSortableMultiSelector from '../field-sortable-multi-selector'

describe('FieldSortableMultiSelector', () => {
  let subject = null

  beforeEach(() => {
    subject = (error = '', label = null) => {
      const props = {
        label,
        input: {
          name: 'name'
        },
        meta: {
          error: error,
          touched: error ? true : false
        }
      }

      return shallow(
        <FieldSortableMultiSelector {...props}/>
      )
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('error text should exist when error flags are true', () => {
    expect(subject('error').find('HelpBlock').length).toBe(1)
  })

  it('error text should not exist when error flags are false', () => {
    expect(subject().find('HelpBlock').length).toBe(0)
  })

})

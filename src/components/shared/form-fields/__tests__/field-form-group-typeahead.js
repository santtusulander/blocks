import React from 'react';
import { Field } from 'redux-form'
import { shallow } from 'enzyme'

jest.unmock('../field-form-group-typeahead.jsx');
import FieldFormGroupTypeahead from '../field-form-group-typeahead'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('FieldFormGroupTypeahead', function () {
  let subject = null

  beforeEach(() => {
    subject = (error = '',
               label = null) => {
      const props = {
        label,
        input: {
          name: 'typeahead_field',
        },
        options: [
          { id: 1, label: 'food' },
          { id: 2, label: 'bar' }
        ],
        component: 'FieldFormGroupTypeahead',
        meta: {
          error: error,
          touched: error ? true : false,
          dirty: false
        },
        intl: intlMaker()
      }

      return shallow(
        <FieldFormGroupTypeahead {...props}/>
      )
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('label should exist when it was given', () => {
    expect(subject('', (<div></div>)).find('ControlLabel').length).toBe(1)
  })

  it('label should not exist when it was not given', () => {
    expect(subject().find('ControlLabel').length).toBe(0)
  })

  it('error text should exist when error flags are true', () => {
    expect(subject('error').find('HelpBlock').length).toBe(1)
  })

  it('error text should not exist when error flags are false', () => {
    expect(subject().find('HelpBlock').length).toBe(0)
  })
})

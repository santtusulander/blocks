import React from 'react';
import { Field } from 'redux-form'
import { shallow } from 'enzyme'

jest.unmock('../field-form-group-typeahead.jsx');
import FieldFormGroupTypeahead from '../field-form-group-typeahead'

describe('FieldFormGroupTypeahead', function () {
  let subject = null

  beforeEach(() => {
    subject = () => {
      const props = {
        name: 'typeahead_field',
        options: [
          { id: 1, label: 'food' },
          { id: 2, label: 'bar' }
        ],
        component: 'FieldFormGroupTypeahead'
      }

      return shallow(
        <Field {...props}/>
      )
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
});

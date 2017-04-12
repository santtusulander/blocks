import React from 'react';
import { Field } from 'redux-form'
import { shallow } from 'enzyme'

jest.unmock('../field-form-group-asn-lookup.jsx');
import FieldFormGroupAsnLookup from '../field-form-group-asn-lookup'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('FieldFormGroupAsnLookup', function () {
  let subject = null

  beforeEach(() => {
    subject = (error = '',
               label = null) => {
      const props = {
        label,
        input: {
          name: 'AsnLookup',
        },
        options: [
          { id: 1, label: 'food' },
          { id: 2, label: 'bar' }
        ],
        component: 'FieldFormGroupAsnLookup',
        intl: intlMaker()
      }

      return shallow(
        <FieldFormGroupAsnLookup {...props}/>
      )
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})

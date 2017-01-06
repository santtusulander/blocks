import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../record-form')
import RecordForm from '../record-form'

const fakeFields = {
  type: 'A'
}

describe('RecordForm', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        fields: fakeFields
      }
      return shallow(<RecordForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})

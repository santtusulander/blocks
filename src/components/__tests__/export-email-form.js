import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../export-email-form')
import ExportEmailForm from '../export-email-form'

const subject = shallow(<ExportEmailForm intl={{ formatMessage() {} }} subject="test"/>)

describe('ExportEmailForm', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })
})

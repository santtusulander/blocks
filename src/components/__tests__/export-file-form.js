import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../export-file-form')
import ExportFileForm from '../export-file-form'

const subject = shallow(<ExportFileForm/>)

describe('ExportFileForm', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })

})

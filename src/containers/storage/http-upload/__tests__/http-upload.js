import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../http-upload.jsx')
jest.unmock('../file-dialog.js')
import HTTPUpload from '../http-upload'

describe('HTTPUploadContainer', () => {
  let subject = null

  beforeEach(() => {
    subject = () => {
      let props = {}

      return shallow( < HTTPUpload {...props} />)
    }
  })

  it('should exists', () => expect(subject().length).toBe(1))

  it('should have fileDialog', () => {
    expect(subject().fileDialog).toBeDefined()
  })
    // static



});

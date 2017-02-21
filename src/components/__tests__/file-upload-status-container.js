import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../file-upload-status-container')
import FileUploadStatus from '../file-upload-status-container'

const subject = shallow(
  <FileUploadStatus />
)

describe('FileUploadStatusContainer', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })
})

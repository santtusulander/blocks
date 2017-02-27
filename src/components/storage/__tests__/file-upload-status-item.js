import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../file-upload-status-item')
import FileUploadStatusItem from '../file-upload-status-item'

const subject = shallow(
  <FileUploadStatusItem />
)

describe('FileUploadStatusItem', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })
})

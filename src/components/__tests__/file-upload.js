import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../file-upload')
import FileUploadArea from '../file-upload'

const subject = shallow(
  <FileUploadArea
    contentValidation={() => {
      return true
    }}
    onDropCompleted={(validFiles, rejectedFiles) => {
      return true
    }}
    acceptFileTypes={["text/csv"]}
    uploadModalOnClick={true}/>
)

describe('FileUploadArea', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })
})

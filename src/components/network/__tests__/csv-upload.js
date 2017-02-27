import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../csv-upload')
import CsvUploadArea from '../csv-upload'

const subject = shallow(
  <CsvUploadArea
    contentValidation={() => {
      return true
    }}
    onDropCompleted={(validFiles, rejectedFiles) => {
      return true
    }}
    acceptFileTypes={["text/csv"]}
    uploadModalOnClick={true}/>
)

describe('CsvUploadArea', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })
})

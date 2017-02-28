import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../aspera-upload')
import AsperaUpload from '../aspera-upload'

const subject = shallow(
  <AsperaUpload
    multiple={true}
    uploadModalOnClick={true}/>
)

describe('AsperaUpload', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })
})

import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../aspera-upload')
import AsperaUpload from '../aspera-upload'

function makeUserActions() {
  return {
    getAccessKeyByToken: function () {
      return {
        then: jest.fn()
      }
    }
  }
}

const subject = shallow(
  <AsperaUpload
    multiple={true}
    uploadModalOnClick={true}
    userActions={makeUserActions()}/>
)

describe('AsperaUpload', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })
})

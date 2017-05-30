import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../storage-content-folder-creator')
import NewFolder from '../storage-content-folder-creator'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

const subject = shallow(
  <NewFolder
    intl={intlMaker()}
    handleSubmit={jest.fn()}
    onClose={jest.fn()}
    onSave={jest.fn()} />
)

describe('NewFolder', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })
})

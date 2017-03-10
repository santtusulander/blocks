import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../storage-content-browser')
import StorageContentBrowser from '../storage-content-browser'

const subject = shallow(
  <StorageContentBrowser contents={[]}/>
)

describe('StorageContentBrowser', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })
})

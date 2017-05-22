import React from 'react'
import { shallow } from 'enzyme'
import { List } from 'immutable'

jest.unmock('../storage-content-browser')
import StorageContentBrowser from '../storage-content-browser'

const subject = shallow(
  <StorageContentBrowser contents={List()}/>
)

describe('StorageContentBrowser', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })
})

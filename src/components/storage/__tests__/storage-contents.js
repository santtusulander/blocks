import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../storage-contents.jsx')
import StorageContents from '../storage-contents.jsx'

const subject = () => {
  return shallow(<StorageContents />)
}

describe('StorageContents', () => {
  it('should exist', () => {
    expect(subject().length).toBe(1);
  });
})

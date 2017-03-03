import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../storage-header.jsx')
import StorageHeader from '../storage-header.jsx'

const subject = () => {
  return shallow(<StorageHeader />)
}

describe('StorageHeader', () => {
  it('should exist', () => {
    expect(subject().length).toBe(1);
  });
})

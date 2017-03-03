import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../storage-dropzone.jsx')
import StorageDropzone from '../storage-dropzone.jsx'

const subject = () => {
  return shallow(<StorageDropzone />)
}

describe('StorageDropzone', () => {
  it('should exist', () => {
    expect(subject().length).toBe(1);
  });
})

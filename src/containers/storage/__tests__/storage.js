import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../storage.jsx')
import Storage from '../storage.jsx'

const subject = () => {
  return shallow(<Storage />)
}

describe('Storage', () => {
  it('should exist', () => {
    expect(subject().length).toBe(1);
  });
})

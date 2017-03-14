import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../storage.jsx')
import Storage from '../storage.jsx'

let params = {
  storage: 'storage',
  group: 'group'
}

const subject = () => {
  return shallow(
    <Storage params={params} fetchStorage={jest.fn()} />)
}

describe('Storage', () => {
  it('should exist', () => {
    expect(subject().length).toBe(1);
  });
})

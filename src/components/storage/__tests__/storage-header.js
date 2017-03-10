import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../storage-header.jsx')
import StorageHeader from '../storage-header.jsx'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

const subject = () => {
  return shallow(
    <StorageHeader
      intl={intlMaker()}
      params={{brand: 'foo', account: 'bar', group: 'bar', storage: 'foo'}} />)
}

describe('StorageHeader', () => {
  it('should exist', () => {
    expect(subject().length).toBe(1);
  });
})

import React from 'react'
import { shallow } from 'enzyme'
import { Map, fromJS } from 'immutable'

jest.unmock('../storage-contents.jsx')
import StorageContents from '../storage-contents.jsx'

const asperaInstance = fromJS({
  get: jest.fn()
})
const httpInstance = fromJS({
  get: jest.fn()
})

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

const params = {
  brand: 'udn',
  account: '1',
  group: '2',
  storage: '3'
}

const subject = () => {
  return shallow(<StorageContents
    asperaInstance={asperaInstance}
    httpInstance={httpInstance}
    fetchStorageContents={jest.fn()}
    intl={intlMaker()}
    params={params}
  />)
}

describe('StorageContents', () => {
  it('should exist', () => {
    expect(subject().length).toBe(1);
  });
})

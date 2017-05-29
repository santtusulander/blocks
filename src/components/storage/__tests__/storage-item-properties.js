import React from 'react'
import { shallow } from 'enzyme'
import { List } from 'immutable'

jest.unmock('../storage-item-properties')
import StorageItemProperties from '../storage-item-properties'

const subject = shallow(
  <StorageItemProperties
    urls={List()}
    createUrls={jest.fn()}
    params={{ brand: 'brand', account: 'account', group: 'group', storage: 'storage', splat: 'splat' }}/>
)

describe('StorageItemProperties', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })
})

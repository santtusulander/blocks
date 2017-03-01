import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../storage-item-tooltip')
import StorageItemTooltip from '../storage-item-tooltip'

const subject = shallow(
  <StorageItemTooltip />
)

describe('StorageItemTooltip', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})

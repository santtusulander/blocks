import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../storage-kpi')
import StorageKPI from '../storage-kpi'

const subject = shallow(
  <StorageKPI />
)

describe('StorageKPI', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })
})

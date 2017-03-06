import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../storage-type.jsx')
import FilterStorageType from '../storage-type'

describe('FilterStorageType', () => {
  it('should exist', () => {
    const filter = shallow(
      <FilterStorageType />
    )
    expect(filter.length).toBe(1)
  })
})

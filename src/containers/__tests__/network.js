import React from 'react'
import { Map } from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../network.jsx')
jest.unmock('../../constants/routes')

import Network from '../network.jsx'

import routeConstants from '../../constants/routes'

const mockFetchData = jest.fn()
const mockAccount = Map()
const mockParams = Map()
const mockLocation = {
  pathname: ''
}

const subject = () => {
  return (
    <Network
      params={mockParams}
      location={mockLocation}
      account={mockAccount}
      fetchData={mockFetchData}
    />
  )
}

describe('Network', () => {
  it('URLs should end in "groups" so that navigating and horizontal scrolling work', () => {
    expect(routeConstants.networkGroups).toMatch(/groups$/)
  })

  it('should exist', () => {
    const network = shallow(subject())
    expect(network.length).toBe(1)
  })
})

import React from 'react'
import { Map } from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../network/network.jsx')
jest.unmock('../../constants/routes')

import Network from '../network/network.jsx'

import routeConstants from '../../constants/routes'

const mockFetchData = jest.fn()
const mockIsFetching = jest.fn()
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
      isFetching={mockIsFetching}
      fetchData={mockFetchData}
      fetchNetworks={jest.fn()}
      fetchLocations={jest.fn()}
      fetchPops={jest.fn()}
      fetchPods={jest.fn()}
      fetchNodes={jest.fn()}
      fetchFootprints={jest.fn()}
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

import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../network.jsx')
jest.unmock('../../constants/routes')

import Network from '../network.jsx'

import routeConstants from '../../constants/routes'

describe('Network', () => {
  it('URLs should end in "groups"', () => {
    expect(routeConstants.networkGroups).toMatch(/groups$/)
    // TODO UDNP-2563: This V2 can be removed after all the changes for Network are done.
    expect(routeConstants.networkGroupsV2).toMatch(/groups$/)
  })

  it('URLs should not end in "groups"', () => {
    routeConstants.networkGroups += '/nope'
    expect(routeConstants.networkGroups).not.toMatch(/groups$/)
    // TODO UDNP-2563: This V2 can be removed after all the changes for Network are done.
    routeConstants.networkGroupsV2 += '/nope'
    expect(routeConstants.networkGroupsV2).not.toMatch(/groups$/)
  })
})

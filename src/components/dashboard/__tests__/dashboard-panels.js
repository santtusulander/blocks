import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../dashboard-panels.jsx')
import DashboardPanels from '../dashboard-panels.jsx'

describe('DashboardPanel', () => {

  it('should exist', () => {
    const dashboardPanels = shallow(<DashboardPanels />)
    expect(dashboardPanels.length).toBe(1)
  })
})

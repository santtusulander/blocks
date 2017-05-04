import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('classnames')
jest.unmock('../dashboard-panels.jsx')
import DashboardPanels from '../dashboard-panels.jsx'

describe('DashboardPanel', () => {

  it('should exist', () => {
    const dashboardPanels = shallow(<DashboardPanels />)
    expect(dashboardPanels.length).toBe(1)
  })

  it('should reflect className', () => {
    const dashboardPanels = shallow(<DashboardPanels className="testClass"/>)
    expect(dashboardPanels.find('.testClass').length).toBe(1)
  })

  it('should reflect children', () => {
    const dashboardPanels = shallow(<DashboardPanels className="testClass"> <div className="children">test</div></DashboardPanels>)
    expect(dashboardPanels.find('.children').length).toBe(1)
  })
})

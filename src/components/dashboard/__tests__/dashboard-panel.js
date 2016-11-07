import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../dashboard-panel.jsx')
import DashboardPanel from '../dashboard-panel.jsx'

describe('DashboardPanel', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        title: 'foo'
      }
      return shallow(<DashboardPanel {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should show a title', () => {
    expect(subject().find('.dashboard-panel-header').length).toBe(1)
  })
})

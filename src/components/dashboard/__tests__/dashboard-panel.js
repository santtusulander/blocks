import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('classnames')
jest.unmock('../dashboard-panel.jsx')
import DashboardPanel from '../dashboard-panel.jsx'

describe('DashboardPanel', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = (className, children = <div></div>) => {
      props = {
        title: 'foo',
        className: className
      }
      return shallow(<DashboardPanel {...props}>{children}</DashboardPanel>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should show a title', () => {
    expect(subject().find('.dashboard-panel-header').length).toBe(1)
  })

  it('should reflect className', () => {
    expect(subject('test').find('.test').length).toBe(1)
  })

  it('should reflect children', () => {
    expect(subject('test', <div className="childTest"></div>).find('.childTest').length).toBe(1)
  })
})

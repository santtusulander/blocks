import React from 'react'
import { shallow } from 'enzyme'
import { fromJS } from 'immutable'

jest.unmock('../tabs.jsx')
const Tabs = require('../tabs.jsx')

const tabs = ['tab1', 'tab2']

describe('Tabs', () => {
  it('should exist', () => {
    const tabs = shallow(<Tabs activeKey='Tab1'><li>Tab1</li><li>Tab2</li></Tabs>);
    expect(tabs.length).toBe(1);
  })

  it('should show tabs', () => {
    const tabs = shallow(<Tabs activeKey='Tab1'><li>Tab1</li><li>Tab2</li></Tabs>)
    expect(tabs.find('li').length).toBe(3)
  })

  it('should show dropdown for hidden tabs', () => {
    const tabs = shallow(<Tabs activeKey='Tab1'><li>Tab1</li><li>Tab2</li><li>Tab3</li><li>Tab4</li></Tabs>)
    tabs.setState({ hiddenTabs: [1] })
    expect(tabs.find('#nav-dropdown-within-tab').length).toBe(1)
  })
})

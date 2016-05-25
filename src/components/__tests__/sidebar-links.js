import React from 'react'
import { shallow } from 'enzyme'
import { fromJS } from 'immutable'

jest.dontMock('../sidebar-links.jsx')
const SidebarLinks = require('../sidebar-links.jsx').SidebarLinks
const SidebarLink = require('../sidebar-links.jsx').SidebarLink

const accounts = [
  fromJS({account_name: 'UDN Admin Account', active: false, account_id: 1}),
  fromJS({account_name: 'Account Name #2', active: false, account_id: 2}),
  fromJS({account_name: 'Account Name #3', active: true, account_id: 3})
]

describe('SidebarLinks', () => {
  it('should exist', () => {
    const bar = shallow(<SidebarLinks/>);
    expect(bar.length).toBe(1);
  })

  it('should show links', () => {
    const links = shallow(<SidebarLinks items={accounts} tag="account"/>)
    expect(links.find('SidebarLink').length).toBe(3)
  })

  it('should show message for no content', () => {
    const links = shallow(<SidebarLinks tag="account" emptyMsg="kung-fu"/>)
    expect(links.find('.empty-msg').length).toBe(1)
  })
})

describe('SidebarLink', () => {
  it('should exist', () => {
    const link = shallow(<SidebarLink/>);
    expect(link.length).toBe(1);
  })

  it('should have active class', () => {
    const link = shallow(<SidebarLink active={true}/>)
    expect(link.find('.active').length).toBe(1)
  })

  it('should not have active class', () => {
    const link = shallow(<SidebarLink/>)
    expect(link.find('version-link').length).toBe(0)
  })

  it('should fire activation function on click', () => {
    const activate = jest.genMockFunction()
    activate(1)
    const link = shallow(<SidebarLink activate={activate}/>)
    link.find('a').simulate('click', { stopPropagation() {} })
    expect(activate.mock.calls[0][0]).toBe(1)
  })
})

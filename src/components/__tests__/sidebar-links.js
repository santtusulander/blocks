import React from 'react'
import { shallow } from 'enzyme'
import { fromJS } from 'immutable'

jest.unmock('../sidebar-links.jsx')
import { SidebarLinks } from '../sidebar-links.jsx'

const accounts = fromJS([
  {account_name: 'UDN Admin Account', active: false, account_id: 1},
  {account_name: 'Account Name #2', active: false, account_id: 2},
  {account_name: 'Account Name #3', active: true, account_id: 3}
])

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


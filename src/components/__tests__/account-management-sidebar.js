import React from 'react'
import { shallow } from 'enzyme'

jest.dontMock('../account-management/account-management-sidebar.jsx')
jest.dontMock('../button.jsx')
const AccountManagementSidebar = require('../account-management/account-management-sidebar.jsx').AccountManagementSidebar

describe('AccountManagementSidebar', () => {
  it('should exist', () => {
    const bar = shallow(<AccountManagementSidebar/>);
    expect(bar).toBeDefined();
  })

  it('should call \'add account\' when button is clicked', () => {
    const addAccount = jest.fn()
    const bar = shallow(<AccountManagementSidebar addAccount={addAccount}/>)
    bar.find('ButtonWrapper').simulate('click')
    expect(addAccount.mock.calls[0]).toBeDefined()
  })
})

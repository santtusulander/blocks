import React from 'react'
import { shallow } from 'enzyme'

jest.dontMock('../account-sidebar.jsx')
jest.dontMock('../button.js')
const AccountSidebar = require('../account-sidebar.jsx').AccountSidebar

describe('AccountSidebar', () => {
  it('should exist', () => {
    const bar = shallow(<AccountSidebar/>);
    expect(bar).toBeDefined();
  })

  it('should call \'add account\' when button is clicked', () => {
    const addAccount = jest.genMockFunction()
    const bar = shallow(<AccountSidebar addAccount={addAccount}/>);
    bar.find('ButtonWrapper').simulate('click')
    expect(addAccount.mock.calls[0]).toBeDefined()
  })
})

import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../account-management/account-management-sidebar.jsx')
jest.unmock('../button.jsx')
import { AccountManagementSidebar } from '../account-management/account-management-sidebar.jsx'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('AccountManagementSidebar', () => {
  it('should exist', () => {
    const bar = shallow(<AccountManagementSidebar intl={intlMaker()}/>);
    expect(bar).toBeDefined();
  })

  it('should call \'add account\' when button is clicked', () => {
    const addAccount = jest.fn()
    const bar = shallow(<AccountManagementSidebar addAccount={addAccount}
      intl={intlMaker()}/>)
    bar.find('ButtonWrapper').simulate('click')
    expect(addAccount.mock.calls[0]).toBeDefined()
  })
})

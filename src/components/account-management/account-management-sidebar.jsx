import React, { PropTypes } from 'react'
import { List } from 'immutable'

import UDNButton from '../../components/button'
import Sidebar from '../../components/layout/sidebar'
import { SidebarLinks } from '../sidebar-links'

export const AccountManagementSidebar = props => {
  const { accounts, activate, addAccount, activeAccount } = props
  return (
    <Sidebar>
      <div className="configuration-versions">
        <div className="accounts-sidebar-header">
          <UDNButton id="add" bsStyle="primary" onClick={addAccount}>
            New Account
          </UDNButton>
        </div>
        <div className="sidebar-section-header">
          MANAGE ACCOUNTS
        </div>
        <SidebarLinks
          activeItem={activeAccount}
          activate={activate}
          emptyMsg="No accounts."
          items={accounts}/>
      </div>

    </Sidebar>
  )
}

AccountManagementSidebar.propTypes = {
  accounts: PropTypes.instanceOf(List),
  activate: PropTypes.func,
  activeAccount: PropTypes.number,
  addAccount: PropTypes.func
}

export default AccountManagementSidebar

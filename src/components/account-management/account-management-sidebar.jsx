import React, { PropTypes } from 'react'
import { List } from 'immutable'

import { ButtonWrapper as Button } from '../../components/button.js'
import Sidebar from '../../components/layout/sidebar.jsx'
import { SidebarLinks } from '../sidebar-links.jsx'

export const AccountManagementSidebar = props => {
  const { accounts, activate, addAccount } = props
  return (
    <Sidebar>
      <div className="configuration-versions">
        <div className="accounts-sidebar-header">
          <Button id="add" bsStyle="primary" onClick={addAccount}>
            New Account
          </Button>
        </div>
        <div className="sidebar-section-header">
          MANAGE ACCOUNTS
        </div>
        <SidebarLinks
          activate={activate}
          emptyMsg="No accounts."
          items={accounts}
          tag={'account'}/>
      </div>

    </Sidebar>
  )
}

AccountManagementSidebar.propTypes = {
  accounts: PropTypes.instanceOf(List),
  activate: PropTypes.func,
  addAccount: PropTypes.func
}

export default AccountManagementSidebar

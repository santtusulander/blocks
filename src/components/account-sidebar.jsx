import React, { PropTypes } from 'react'

import { ButtonWrapper as Button } from '../components/button.js'
import Sidebar from '../components/layout/sidebar.jsx'
import { SidebarLinks } from './sidebar-links.jsx'

export const AccountSidebar = props => {
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

AccountSidebar.propTypes = {
  accounts: PropTypes.array,
  activate: PropTypes.func,
  addAccount: PropTypes.func
}

//export default AccountSidebar

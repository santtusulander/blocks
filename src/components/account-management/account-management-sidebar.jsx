import React, { PropTypes } from 'react'
import { List } from 'immutable'

import UDNButton from '../../components/button'
import Sidebar from '../../components/layout/sidebar'
import { SidebarLinks } from '../sidebar-links'

import {formatMessage, injectIntl} from 'react-intl';

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
        <h5>MANAGE ACCOUNTS</h5>
        <SidebarLinks
          activeItem={activeAccount}
          activate={activate}
          emptyMsg={this.props.intl.formatMessage({id: 'portal.account.manage.noAccounts.text'})}
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

export default injectIntl(AccountManagementSidebar)

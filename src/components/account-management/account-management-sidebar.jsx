import React, { PropTypes } from 'react'
import { List } from 'immutable'

import UDNButton from '../../components/button'
import Sidebar from '../../components/shared/layout/section-header'
import { SidebarLinks } from '../shared/sidebar-link/sidebar-links'

import {FormattedMessage, injectIntl} from 'react-intl';

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
        <h5><FormattedMessage id="portal.account.manage.sidebar.title"/></h5>
        <SidebarLinks
          activeItem={activeAccount}
          activate={activate}
          emptyMsg={props.intl.formatMessage({id: 'portal.account.manage.noAccounts.text'})}
          items={accounts}/>
      </div>

    </Sidebar>
  )
}

AccountManagementSidebar.displayName='AccountManagementSidebar'
AccountManagementSidebar.propTypes = {
  accounts: PropTypes.instanceOf(List),
  activate: PropTypes.func,
  activeAccount: PropTypes.number,
  addAccount: PropTypes.func,
  intl: PropTypes.object
}

export default injectIntl(AccountManagementSidebar)

import React, { PropTypes } from 'react'
import { Dropdown } from 'react-bootstrap'
import { List } from 'immutable'

import AccountSelector from '../../containers/global-account-selector.jsx'
import PageHeader from '../layout/page-header'
import { getUrl } from '../../util/helpers.js'


const SecurityPageHeader = ({ params, history, activeAccount }) => {
  const topBarAction = (tier, fetch) => {
    switch(tier) {
      case 'group': fetch('account', 'udn')
        break
      case 'account':
      case 'brand':
        history.pushState(null, getUrl('/security', 'brand', 'udn', {}))
        break
    }
  }
  return (
    <PageHeader>
      <p>Security</p>
      <AccountSelector
        params={{ brand: params.brand, account: params.account, group: params.group }}
        topBarTexts={{ brand: 'UDN Admin', account: 'UDN Admin', group: 'Account report' }}
        topBarAction={topBarAction}
        onSelect={(...params) => history.pushState(null, getUrl('/security', ...params))}
        restrictedTo="group">
        <Dropdown.Toggle bsStyle="link" className="header-toggle">
          <h1>{activeAccount}</h1>
        </Dropdown.Toggle>
      </AccountSelector>
    </PageHeader>
  )
}

SecurityPageHeader.propTypes = {
  accountOptions: PropTypes.array,
  accounts: PropTypes.instanceOf(List),
  activeAccount: PropTypes.string,
  changeActiveAccount: PropTypes.func,
  fetchAccount: PropTypes.func,
  params: PropTypes.object
}

export default SecurityPageHeader

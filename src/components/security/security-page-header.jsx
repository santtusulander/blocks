import React, { PropTypes } from 'react'
import { Dropdown } from 'react-bootstrap'
import { List } from 'immutable'

import { AccountSelector } from '../../containers/global-account-selector.jsx'
import PageHeader from '../layout/page-header'

const topBarAction = (tier, fetch) => {
  switch(tier) {
    case 'group': fetch('account', 'udn')
      break
    case 'account':
    case 'brand': history.pushState(null, getUrl('/security', 'brand', 'udn', {}))
      break
  }
}

const SecurityPageHeader = ({ params, history }) => {
  return (
    <PageHeader>
      <p>Security</p>
      <AccountSelector
        params={params}
        topBarTexts={{ brand: 'UDN Admin', account: 'UDN Admin', group: 'Account report' }}
        topBarAction={topBarAction}
        onSelect={(...params) => history.pushState(null, getUrl('/security', ...params))}
        drillable={!params.group}>
        <Dropdown.Toggle bsStyle="link" className="header-toggle">
          <h1>{activeItem || "select account"}</h1>
        </Dropdown.Toggle>
      </AccountSelector>
    </PageHeader>
  )
}

SecurityPageHeader.propTypes = {
  accountOptions: PropTypes.array,
  accounts: PropTypes.instanceOf(List),
  activeAccount: PropTypes.number,
  changeActiveAccount: PropTypes.func,
  fetchAccount: PropTypes.func
}

export default SecurityPageHeader

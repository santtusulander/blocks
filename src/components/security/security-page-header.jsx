import React, { PropTypes } from 'react'
import { List } from 'immutable'

import PageHeader from '../layout/page-header'
import Select from '../select.jsx'

const SecurityPageHeader = ({ activeAccount, accounts, fetchAccount }) => {
  const changeActiveAccount = brand => id => fetchAccount(brand, id)
  const accountOptions = accounts.map(account => [account.get('id'), account.get('name')]).toJS()
  return (
    <PageHeader>
      <h1 className="security-header-text">Security</h1>
      <div className='dns-filter-wrapper'>
        Account
        <Select
          onSelect={changeActiveAccount('udn')}
          className="dns-dropdowns"
          value={activeAccount}
          options={accountOptions}/>
      </div>
    </PageHeader>
  )}

SecurityPageHeader.propTypes = {
  accountOptions: PropTypes.array,
  accounts: PropTypes.instanceOf(List),
  activeAccount: PropTypes.number,
  changeActiveAccount: PropTypes.func,
  fetchAccount: PropTypes.func
}

export default SecurityPageHeader

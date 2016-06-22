import React from 'react'
import Immutable from 'immutable'

import Select from './select.jsx'

const UdnAdminToolbar = ({accounts, activeAccount, sectionLabel, fetchAccountData}) => {

  const accountOptions = accounts.map( account => {
    return [account.get('id'), account.get('name')]
  })

  return (
    <div className='udn-admin-toolbar'>
      <Select
        options={accountOptions}
        onSelect={(account) => {fetchAccountData(account)}}
        value={activeAccount.get('id')}
      />

      <p>{sectionLabel}</p>
    </div>
  )
}

UdnAdminToolbar.defaultProps = {
  accounts: Immutable.List(),
  activeAccount: Immutable.Map(),
  sectionLabel: ''
}

export default UdnAdminToolbar

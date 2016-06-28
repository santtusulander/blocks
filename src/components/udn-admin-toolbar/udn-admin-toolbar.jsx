import React from 'react'
import Immutable from 'immutable'

import Select from '../select.jsx'
import './udn-admin-toolbar.scss'

const UdnAdminToolbar = ({accounts, activeAccount, fetchAccountData}) => {

  const accountOptions = accounts.map( account => {
    return [account.get('id'), account.get('name')]
  }).sort( (a,b) => {
    if ( a[1].toLowerCase() < b[1].toLowerCase() ) return -1
    if ( a[1].toLowerCase() > b[1].toLowerCase() ) return 1
    return 0
  })


  return (
    <div className='udn-admin-toolbar'>
      <Select
        options={accountOptions}
        onSelect={account => fetchAccountData(account)}
        value={activeAccount.get('id')}
      />

    </div>
  )
}

UdnAdminToolbar.defaultProps = {
  accounts: Immutable.List(),
  activeAccount: Immutable.Map()
}

export default UdnAdminToolbar

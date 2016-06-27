import React from 'react'
import Immutable from 'immutable'

import Select from '../select.jsx'
import './udn-admin-toolbar.scss'
import { ADD_ACCOUNT } from '../../constants/account-management-modals.js'

const UdnAdminToolbar = ({accounts, activeAccount, fetchAccountData, toggleAccountManagementModal}) => {

  const accountOptions = accounts.map( account => {
    return [account.get('id'), account.get('name')]
  }).sort( (a,b) => {
    if ( a[1].toLowerCase() < b[1].toLowerCase() ) return -1
    if ( a[1].toLowerCase() > b[1].toLowerCase() ) return 1
    return 0
  }).unshift(['add','Add new account'])


  return (
    <div className='udn-admin-toolbar'>
      <Select
        options={accountOptions}
        onSelect={account => {
          if(account === 'add') {
            toggleAccountManagementModal(ADD_ACCOUNT)
          }
          else {
            fetchAccountData(account)
          }
        }}
        value={activeAccount.get('id')}
      />

    </div>
  )
}

UdnAdminToolbar.defaultProps = {
  accounts: Immutable.List(),
  activeAccount: Immutable.Map(),
}

export default UdnAdminToolbar

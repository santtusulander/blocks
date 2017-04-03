import React from 'react'
import Immutable from 'immutable'

import Select from '../select.jsx'
import './udn-admin-toolbar.scss'
import { ADD_ACCOUNT } from '../../constants/account-management-modals.js'

const UdnAdminToolbar = ({accounts, activeAccount, routes, toggleAccountManagementModal, history}) => {

  const accountOptions = accounts.map(account => {
    return [account.get('id'), account.get('name')]
  }).sort((a,b) => {
    if (a[1].toLowerCase() < b[1].toLowerCase()) {
      return -1
    }
    if (a[1].toLowerCase() > b[1].toLowerCase()) {
      return 1
    }
    return 0
  })


  return (
    <div className='udn-admin-toolbar'>
      <Select
        options={accountOptions}
        onSelect={account => {
          if (account === 'add') {
            toggleAccountManagementModal(ADD_ACCOUNT)
          }          else {
            //FIXME: this is NOT 100% accurate
            const currentRoute = routes[routes.length - 1].path
            //replace :account with selected valye
            const newRoute = currentRoute.replace(/:account/, account)

            history.push(newRoute)
            //fetchAccountData(account)
          }
        }}
        value={activeAccount.get('id')}
      />

    </div>
  )
}

UdnAdminToolbar.displayName = "UdnAdminToolbar"

UdnAdminToolbar.defaultProps = {
  accounts: Immutable.List(),
  activeAccount: Immutable.Map()
}

UdnAdminToolbar.propTypes = {
  accounts: React.PropTypes.instanceOf(Immutable.List),
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  history: React.PropTypes.object,
  routes: React.PropTypes.object,
  toggleAccountManagementModal: React.PropTypes.func
}

export default UdnAdminToolbar

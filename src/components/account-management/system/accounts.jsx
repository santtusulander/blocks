import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { List, fromJS } from 'immutable'

import ActionLinks from '../action-links.jsx'
import { AccountManagementHeader } from '../account-management-header.jsx'

import { SERVICE_TYPES, ACCOUNT_TYPES } from '../../../constants/account-management-options.js'

function getServicesString(services) {
  let string = ''
  let servicesLength = services.length
  if (servicesLength >= 1) {
    string = string.concat(SERVICE_TYPES.find(item => item.value === services[0]).label)
    if (servicesLength >= 2) {
      string = string.concat(', ' + SERVICE_TYPES.find(item => item.value === services[1]).label)
      if (servicesLength > 2) {
        string = string.concat(', +' + servicesLength)
      }
    }
  } else return 'No service types'
  return string
}

class AccountList extends Component {
  render() {
    const { accounts, editAccount, deleteAccount, params: { brand } } = this.props
    return (
      <div>
        <AccountManagementHeader title={`${accounts.size} Accounts`} onAdd={() => {}}/>
        <table className="table table-striped cell-text-left">
          <thead >
          <tr>
            <th width="30%">ACCOUNT NAME</th>
            <th width="10%">TYPE</th>
            <th width="10%">ID</th>
            <th width="10%">BRAND</th>
            <th width="30%">SERVICES</th>
            <th width="8%"/>
          </tr>
          </thead>
          <tbody>
          {!accounts.isEmpty() ? accounts.map((account, index) => {
            const id = account.get('id')
            return (
              <tr key={index}>
                <td>{account.get('name')}</td>
                <td>{ACCOUNT_TYPES.find(type => account.get('provider_type') === type.value).label}</td>
                <td>{id}</td>
                <td>{brand}</td>
                <td>{getServicesString(account.get('services').toJS())}</td>
                <td>
                  <ActionLinks
                    onEdit={() => editAccount(id)}
                    onDelete={() => deleteAccount(id)}/>
                </td>
              </tr>
            )
          }) : <tr id="empty-msg"><td colSpan="6">No accounts</td></tr>}
          </tbody>
        </table>
      </div>
    )
  }
}

AccountList.propTypes = {
  accounts: PropTypes.instanceOf(List),
  addAccount: PropTypes.func,
  deleteAccount: PropTypes.func,
  editAccount: PropTypes.func,
  params: PropTypes.object
}

AccountList.defaultProps = {
  accounts: List()
}

/**
 *
 * waiting for api endpoint to return sufficient data
 */

function mapStateToProps(state) {
  const notSufficient = state.account.get('allAccounts')
  const sufficient = notSufficient.map(account => {
    account = account.set('services', fromJS([1]))
    account = account.set('provider_type', Math.floor(Math.random() * 2) + 1)
    return account
  })
  return { accounts: sufficient, brand: 'udn' }
}

export default connect(mapStateToProps)(AccountList)

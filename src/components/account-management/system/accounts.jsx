import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { List, fromJS } from 'immutable'

import ActionLinks from '../action-links'
import { AccountManagementHeader } from '../account-management-header'
import ArrayCell from '../../array-td/array-td'

import { fetchAccounts } from '../../../redux/modules/account'

import { SERVICE_TYPES, ACCOUNT_TYPES } from '../../../constants/account-management-options'

class AccountList extends Component {
  render() {
    const { accounts, editAccount, deleteAccount, params: { brand } } = this.props
    const services = values =>
      values.map(value => SERVICE_TYPES.find(type => type.value === value).label)
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
                <ArrayCell items={services(account.get('services'))} maxItemsShown={2}/>
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
    account = account.set('services', fromJS([1, 1, 1, 1]))
    account = account.set('provider_type', Math.floor(Math.random() * 2) + 1)
    return account
  })
  return { accounts: sufficient, brand: 'udn' }
}

export default connect(mapStateToProps, { fetchAccounts })(AccountList)

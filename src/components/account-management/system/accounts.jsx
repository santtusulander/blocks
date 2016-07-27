import React, { PropTypes, Component } from 'react'
import { Row, Col, Input } from 'react-bootstrap'
import { connect } from 'react-redux'
import { List, fromJS } from 'immutable'

import ActionLinks from '../action-links'
import { AccountManagementHeader } from '../account-management-header'
import ArrayCell from '../../array-td/array-td'
import TableSorter from '../../table-sorter'

import { fetchAccounts } from '../../../redux/modules/account'

import { SERVICE_TYPES, ACCOUNT_TYPES } from '../../../constants/account-management-options'

class AccountList extends Component {
  constructor(props) {
    super(props);
    this.changeSort = this.changeSort.bind(this)
    this.state = {
      search: '',
      sortBy: 'name',
      sortDir: 1
    }
  }


  changeSort(column, direction) {
    this.setState({
      sortBy: column,
      sortDir: direction
    })
  }

  sortedData(data, sortBy, sortDir) {
    return data.sort((a, b) => {
      let aVal = a.get(sortBy)
      let bVal = b.get(sortBy)
      if(typeof a.get(sortBy) === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      if(aVal < bVal) {
        return -1 * sortDir
      }
      else if(aVal > bVal) {
        return 1 * sortDir
      }
      return 0
    })
  }

  render() {
    const { accounts, editAccount, deleteAccount, params: { brand } } = this.props
    const filteredAccounts = accounts.filter(account =>
      account.get('name').toLowerCase().includes(this.state.search.toLowerCase())
    )
    const sorterProps  = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }
    const sortedAccounts = this.sortedData(
      filteredAccounts,
      this.state.sortBy,
      this.state.sortDir
    )
    const hiddenAccs = accounts.size - sortedAccounts.size
    const services = values =>
      values.map(value => SERVICE_TYPES.find(type => type.value === value).label)
    return (
      <div>
        <Row className="header-btn-row">
          <Col sm={6}>
            <h3>
              {sortedAccounts.size} Account{sortedAccounts.size === 1 ? '' : 's'} {!!hiddenAccs && `(${hiddenAccs} hidden)`}
            </h3>
          </Col>
          <Col sm={6} className="text-right">
            <Input
              type="text"
              className="search-input"
              groupClassName="search-input-group"
              placeholder="Search"
              value={this.state.search}
              onChange={this.changeSearch} />
          </Col>
        </Row>
        <AccountManagementHeader title={`${accounts.size} Accounts`} onAdd={() => {}}/>
        <table className="table table-striped cell-text-left">
          <thead >
          <tr>
            <TableSorter {...sorterProps} column="name" width="30%">ACCOUNT NAME</TableSorter>
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

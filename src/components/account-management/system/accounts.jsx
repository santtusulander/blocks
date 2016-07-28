import React, { PropTypes, Component } from 'react'
import { Row, Col, Input, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { List } from 'immutable'

import IconAdd from '../../icons/icon-add'
import ActionLinks from '../action-links'
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
    const {
      accounts,
      params: { brand }
    } = this.props
    const filteredAccounts = accounts
      .filter(account => account.get('name').toLowerCase().includes(this.state.search.toLowerCase()))
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
      values.map(value => SERVICE_TYPES.find(type => type.value === value).label).toJS()
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
              onChange={({ target: { value } }) => this.setState({ search: value })} />
            <Button bsStyle="success" className="btn-icon btn-add-new" onClick={() => {}}>
              <IconAdd/>
            </Button>
          </Col>
        </Row>
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
          {!sortedAccounts.isEmpty() ? sortedAccounts.map((account, index) => {
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
                    onEdit={() => {}}
                    onDelete={() => {}}/>
                </td>
              </tr>
            )
          }) :
            <tr id="empty-msg">
              <td colSpan="6">
                {this.state.search.length > 0 ?
                  `No accounts found with the search term ${this.state.search}` :
                  "No accounts found"}
              </td>
            </tr>}
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

function mapStateToProps(state) {
  return { accounts: state.account.get('allAccounts'), brand: 'udn' }
}

export default connect((mapStateToProps), { fetchAccounts })(AccountList)

import React, { PropTypes, Component } from 'react'
import { Button, Row, Col, Input } from 'react-bootstrap'
import { connect } from 'react-redux'
import { List, fromJS } from 'immutable'

import IconAdd from '../../icons/icon-add'
import ActionLinks from '../action-links'
import InlineAdd from '../../inline-add'
import ArrayCell from '../../array-td/array-td'
import TableSorter from '../../table-sorter'
import SelectWrapper from '../../../components/select-wrapper'
import FilterChecklistDropdown from '../../../components/filter-checklist-dropdown/filter-checklist-dropdown'

import { fetchAccounts, createAccount } from '../../../redux/modules/account'

import { SERVICE_TYPES, ACCOUNT_TYPES } from '../../../constants/account-management-options'

import { checkForErrors } from '../../../util/helpers'

class AccountList extends Component {
  constructor(props) {
    super(props);
    this.newAccount = this.newAccount.bind(this)
    this.changeSort = this.changeSort.bind(this)
    this.toggleInlineAdd = this.toggleInlineAdd.bind(this)
    this.validateInlineAdd = this.validateInlineAdd.bind(this)
    this.state = {
      addingNew: false,
      accountServices: fromJS([]),
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

  validateInlineAdd({ name = '', brand = '', provider_type = '' }) {
    const conditions = {
      confirmPw: {
        condition: this.props.accounts.find(account => account.get('name') !== name),
        errorText: 'That account name is taken'
      }
    }
    return checkForErrors({ name, brand, provider_type }, conditions)
  }

  componentWillReceiveProps(nextProps) {
    nextProps.typeField !== this.props.typeField && this.setState({ accountServices: List() })
  }

  getInlineAddFields() {
    return [
      [ { input: <Input id='name' placeholder=" Email" type="text"/> } ],
      [ { input: <SelectWrapper
            numericValues={true}
            id='provider_type'
            className="inline-add-dropdown"
            options={ACCOUNT_TYPES.map(type => [type.value, type.label])}/>
      } ],
      [],
      [ { input: <SelectWrapper id='brand' className="inline-add-dropdown" options={[['udn', 'udn']]}/> } ],
      [ { input: <FilterChecklistDropdown
            className="inline-add-dropdown"
            values={this.state.accountServices}
            handleCheck={newValues => {
              this.setState({ accountServices: newValues })
            }}
            options={fromJS(SERVICE_TYPES.filter(service => service.accountTypes.includes(this.props.typeField)))}/>,
          positionClass: 'col-sm-6'
      } ]
    ]
  }

  newAccount({ name, provider_type, brand }) {
    const { createAccount } = this.props
    const requestBody = { name, provider_type, services: [1] }
    createAccount(brand, requestBody).then(this.toggleInlineAdd)
  }

  toggleInlineAdd() {
    this.setState({ addingNew: !this.state.addingNew, accountServices: List() })
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
            <Button bsStyle="success" className="btn-icon btn-add-new" onClick={this.toggleInlineAdd}>
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
          {this.state.addingNew && <InlineAdd
            validate={this.validateInlineAdd}
            fields={['name', 'provider_type', 'brand']}
            inputs={this.getInlineAddFields()}
            unmount={this.toggleInlineAdd}
            save={this.newAccount}/>}
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
  createAccount: PropTypes.func,
  deleteAccount: PropTypes.func,
  editAccount: PropTypes.func,
  params: PropTypes.object,
  typeField: PropTypes.number
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
  const addAccountForm = state.form.inlineAdd
  const typeField = addAccountForm && addAccountForm.provider_type && addAccountForm.provider_type.value
  return { accounts: sufficient, typeField }
}

export default connect(mapStateToProps, { fetchAccounts, createAccount })(AccountList)

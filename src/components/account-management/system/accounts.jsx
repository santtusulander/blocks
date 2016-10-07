import React, { PropTypes, Component } from 'react'
import { Button, Input } from 'react-bootstrap'
import { connect } from 'react-redux'
import { List, fromJS } from 'immutable'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import PageContainer from '../../../components/layout/page-container'
import SectionHeader from '../../../components/layout/section-header'
import IconAdd from '../../icons/icon-add'
import ActionButtons from '../../../components/action-buttons'
import InlineAdd from '../../inline-add'
import ArrayCell from '../../array-td/array-td'
import TableSorter from '../../table-sorter'
import SelectWrapper from '../../../components/select-wrapper'
import FilterChecklistDropdown from '../../../components/filter-checklist-dropdown/filter-checklist-dropdown'
import UDNButton from '../../../components/button'

import * as accountActionCreators from '../../../redux/modules/account'
import * as uiActionCreators from '../../../redux/modules/ui'

import {
  SERVICE_TYPES,
  ACCOUNT_TYPES,
  ACCOUNT_TYPE_CLOUD_PROVIDER
} from '../../../constants/account-management-options'

import { checkForErrors } from '../../../util/helpers'
import { isValidAccountName } from '../../../util/validators'

import {FormattedMessage, injectIntl} from 'react-intl';

const FILTERED_ACCOUNT_TYPES = ACCOUNT_TYPES.filter(type => type.value !== ACCOUNT_TYPE_CLOUD_PROVIDER)

class AccountList extends Component {
  constructor(props) {
    super(props);

    this.newAccount = this.newAccount.bind(this)
    this.changeSort = this.changeSort.bind(this)
    this.toggleInlineAdd = this.toggleInlineAdd.bind(this)
    this.validateInlineAdd = this.validateInlineAdd.bind(this)
    this.shouldLeave = this.shouldLeave.bind(this)
    this.isLeaving = false;

    this.state = {
      addingNew: false,
      search: '',
      sortBy: 'name',
      sortDir: 1
    }
  }

  componentWillMount() {
    const { accountActions, router, route } = this.props
    router.setRouteLeaveHook(route, this.shouldLeave)

    //TODO: get brand from redux
    accountActions.fetchAccounts( this.props.params.brand )
  }

  validateInlineAdd({ name = '', brand = '', provider_type = '', services = List() }) {
    const conditions = {
      name: [
        {
          condition: this.props.accounts.findIndex(account => account.get('name') === name) > -1,
          errorText: 'That account name is taken'
        },
        {
          condition: ! isValidAccountName(name),
          errorText:
          <div>
          {[<FormattedMessage id="portal.account.manage.enterAccount.placeholder.text"/>,
            <div key={name}>
              <div style={{marginTop: '0.5em'}}>
                <FormattedMessage id="portal.account.manage.nameValidationRequirements.line1.text" />
                <ul>
                  <li><FormattedMessage id="portal.account.manage.nameValidationRequirements.line2.text" /></li>
                  <li><FormattedMessage id="portal.account.manage.nameValidationRequirements.line3.text" /></li>
                </ul>
              </div>
            </div>]}
          </div>
        }
      ]
    }
    return checkForErrors({ name, brand, provider_type, services: services.toJS() }, conditions)
  }

  changeSort(column, direction) {
    this.setState({
      sortBy: column,
      sortDir: direction
    })
  }

  getInlineAddFields() {
    return [
      [ { input: <Input id='name' placeholder={this.props.intl.formatMessage({id: 'portal.account.manage.accountName.placeholder.text'})} type="text"/> } ],
      [ { input: <SelectWrapper
            numericValues={true}
            id='provider_type'
            className="inline-add-dropdown"
            options={FILTERED_ACCOUNT_TYPES.map(type => [type.value, type.label])}/>
      } ],
      [],
      [ { input: <SelectWrapper id='brand' className="inline-add-dropdown" options={[['udn', 'udn']]}/> } ],
      [ { input: <FilterChecklistDropdown
            id="services"
            noClear={true}
            className="inline-add-dropdown"
            options={fromJS(SERVICE_TYPES.filter(service => service.accountTypes.includes(this.props.typeField)))}/>,
          positionClass: 'row col-xs-6'
      } ]
    ]
  }

  newAccount({ name, provider_type, brand, services }) {
    const { createAccount } = this.props.accountActions
    const requestBody = { name, provider_type, services: services.toJS() }
    createAccount(brand, requestBody).then(this.toggleInlineAdd)
  }

  toggleInlineAdd() {
    this.setState({ addingNew: !this.state.addingNew })
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

  shouldLeave({ pathname }) {
    if (!this.isLeaving && this.state.addingNew) {
      this.props.uiActions.showInfoDialog({
        title: <FormattedMessage id='portal.account.manage.unsavedChanges.warning.title'/>,
        content: <FormattedMessage id='portal.account.manage.unsavedChanges.warning.content'/>,
        buttons:  [
          <UDNButton key="button-1" onClick={() => {
            this.isLeaving = true
            this.props.router.push(pathname)
            this.props.uiActions.hideInfoDialog()
          }} bsStyle="primary">Continue</UDNButton>,
          <UDNButton key="button-2" onClick={this.props.uiActions.hideInfoDialog} bsStyle="primary">Stay</UDNButton>
        ]
      })
      return false;
    }
    return true
  }

  render() {
    const {
      accounts,
      deleteAccount,
      params: { brand }
    } = this.props
    const filteredAccounts = accounts
      .filter(account => account.get('name').toLowerCase().includes(this.state.search.toLowerCase()))
      .map(account => {
        const accountType = ACCOUNT_TYPES.find(type => account.get('provider_type') === type.value)
        return account.set('provider_type_label', accountType ? accountType.label : '')
      })
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
    const accountsSize = sortedAccounts.size
    const accountsText = ` Account${sortedAccounts.size === 1 ? '' : 's'}`
    const hiddenAccountsText = hiddenAccs ? ` (${hiddenAccs} hidden)` : ''
    const finalAccountsText = accountsSize + accountsText + hiddenAccountsText

    return (
      <PageContainer>
        <SectionHeader sectionHeaderTitle={finalAccountsText}>
          <Input
            type="text"
            className="search-input"
            groupClassName="search-input-group"
            placeholder="Search"
            value={this.state.search}
            onChange={({ target: { value } }) => this.setState({ search: value })} />
          <Button bsStyle="success" className="btn-icon" onClick={this.toggleInlineAdd}>
            <IconAdd/>
          </Button>
        </SectionHeader>
        <table className="table table-striped cell-text-left">
          <thead >
          <tr>
            <TableSorter {...sorterProps} column="name" width="27%"><FormattedMessage id='portal.account.list.accountName.title'/></TableSorter>
            <TableSorter {...sorterProps} column="provider_type_label" width="15%"><FormattedMessage id='portal.account.list.type.title'/></TableSorter>
            <TableSorter {...sorterProps} column="id" width="10%"><FormattedMessage id='portal.account.list.id.title'/></TableSorter>
            <TableSorter {...sorterProps} column="brand" width="15%"><FormattedMessage id='portal.account.list.brand.title'/></TableSorter>
            <TableSorter {...sorterProps} column="services" width="23%"><FormattedMessage id='portal.account.list.services.title'/></TableSorter>
            <th width="1%"/>
          </tr>
          </thead>
          <tbody>
          {this.state.addingNew && <InlineAdd
            validate={this.validateInlineAdd}
            fields={['name', 'provider_type', 'brand', 'services']}
            inputs={this.getInlineAddFields()}
            initialValues={{ services: List() }}
            unmount={this.toggleInlineAdd}
            save={this.newAccount}/>}
          {!sortedAccounts.isEmpty() ? sortedAccounts.map((account, index) => {
            const id = account.get('id')
            return (
              <tr key={index}>
                <td>{account.get('name')}</td>
                <td>{account.get('provider_type_label')}</td>
                <td>{id}</td>
                <td>{brand}</td>
                <ArrayCell items={services(account.get('services'))} maxItemsShown={2}/>
                <td className="nowrap-column">
                  <ActionButtons
                    onEdit={() => {this.props.editAccount(account)}}
                    onDelete={() => deleteAccount(account.get('id'))}/>
                </td>
              </tr>
            )
          }) :
            <tr id="empty-msg">
              <td colSpan="6">
                {this.state.search.length > 0 ?
                  <FormattedMessage id='portal.account.list.searchWithParams.empty.text' values={{searchTerm: this.state.search}}/> :
                  <FormattedMessage id='portal.account.list.search.empty.text'/>}
              </td>
            </tr>}
          </tbody>
        </table>
      </PageContainer>
    )
  }
}

AccountList.propTypes = {
  accountActions: React.PropTypes.object,
  accounts: PropTypes.instanceOf(List),
  addAccount: PropTypes.func,
  deleteAccount: PropTypes.func,
  editAccount: PropTypes.func,
  intl: PropTypes.object,
  params: PropTypes.object,
  route: React.PropTypes.object,
  router: React.PropTypes.object,
  typeField: PropTypes.number,
  uiActions: React.PropTypes.object
}

AccountList.defaultProps = {
  accounts: List()
}

function mapStateToProps(state) {
  const addAccountForm = state.form.inlineAdd
  const typeField = addAccountForm && addAccountForm.provider_type && addAccountForm.provider_type.value
  return { accounts: state.account.get('allAccounts'), typeField }
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(AccountList)))

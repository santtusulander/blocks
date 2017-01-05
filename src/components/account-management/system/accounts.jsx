import React, { PropTypes, Component } from 'react'
import { Button, FormControl, FormGroup } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Map, List } from 'immutable'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import PageContainer from '../../../components/layout/page-container'
import SectionHeader from '../../../components/layout/section-header'
import IconAdd from '../../icons/icon-add'
import ActionButtons from '../../../components/action-buttons'
import ArrayCell from '../../array-td/array-td'
import TableSorter from '../../table-sorter'

import * as accountActionCreators from '../../../redux/modules/account'
import * as uiActionCreators from '../../../redux/modules/ui'

import {getServices, getProviderTypes} from '../../../redux/modules/service-info/selectors'
import {fetchAll as serviceInfofetchAll} from '../../../redux/modules/service-info/actions'

import { checkForErrors } from '../../../util/helpers'
import { isValidAccountName } from '../../../util/validators'

import {FormattedMessage} from 'react-intl';

class AccountList extends Component {
  constructor(props) {
    super(props);

    this.changeSort = this.changeSort.bind(this)
    this.shouldLeave = this.shouldLeave.bind(this)
    this.isLeaving = false;

    this.state = {
      search: '',
      sortBy: 'name',
      sortDir: 1
    }
  }

  componentWillMount() {
    const { accountActions, router, route, fetchServiceInfo } = this.props
    router.setRouteLeaveHook(route, this.shouldLeave)

    //TODO: get brand from redux
    accountActions.fetchAccounts( this.props.params.brand )

    //fetch serviceInfo from API
    fetchServiceInfo()
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
        stayButton: true,
        continueButton: true,
        cancel: () => this.props.uiActions.hideInfoDialog(),
        onSubmit: () => {
          this.isLeaving = true
          this.props.router.push(pathname)
          this.props.uiActions.hideInfoDialog()
        }
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
        const providerType = this.props.providerTypes.find(type => account.get('provider_type') === type.get('id'))
        return account.set('provider_type_label', providerType ? providerType.get('name') : '')
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
    const services = values => values.map( service => {
      const serviceDetails = this.props.services.find( obj => obj.get('id') === service.get('id') )
      return serviceDetails && serviceDetails.get('name')
    }).toJS()

    const accountsSize = sortedAccounts.size
    const accountsText = ` Account${sortedAccounts.size === 1 ? '' : 's'}`
    const hiddenAccountsText = hiddenAccs ? ` (${hiddenAccs} hidden)` : ''
    const finalAccountsText = accountsSize + accountsText + hiddenAccountsText

    return (
      <PageContainer>
        <SectionHeader sectionHeaderTitle={finalAccountsText}>
          <FormGroup className="search-input-group">
            <FormControl
              className="search-input"
              placeholder="Search"
              value={this.state.search}
              onChange={({ target: { value } }) => this.setState({ search: value })} />
          </FormGroup>
          <Button bsStyle="success" className="btn-icon" onClick={() => {this.props.editAccount()}}>
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

AccountList.displayName = "AccountList"

AccountList.propTypes = {
  accountActions: React.PropTypes.object,
  accounts: PropTypes.instanceOf(List),
  deleteAccount: PropTypes.func,
  editAccount: PropTypes.func,
  fetchServiceInfo: PropTypes.func,
  params: PropTypes.object,
  providerTypes: React.PropTypes.instanceOf(Map),
  route: React.PropTypes.object,
  router: React.PropTypes.object,
  services: React.PropTypes.instanceOf(Map),
  uiActions: React.PropTypes.object
}

AccountList.defaultProps = {
  accounts: List()
}

function mapStateToProps(state) {
  return {
    accounts: state.account.get('allAccounts'),
    providerTypes: getProviderTypes(state),
    services: getServices(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    fetchServiceInfo: () => dispatch( serviceInfofetchAll() ),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountList))

import React, { PropTypes, Component } from 'react'
import { Button, FormControl, FormGroup } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Map, List } from 'immutable'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import PageContainer from '../../../components/shared/layout/page-container'
import SectionHeader from '../../../components/shared/layout/section-header'
import IconAdd from '../../../components/shared/icons/icon-add'
import ActionButtons from '../../../components/shared/action-buttons'
import ArrayCell from '../../../components/shared/page-elements/array-td'
import TableSorter from '../../../components/shared/table-sorter'
import MultilineTextFieldError from '../../../components/shared/form-elements/multiline-text-field-error'

import * as uiActionCreators from '../../../redux/modules/ui'

import accountActions from '../../../redux/modules/entities/accounts/actions'
import {getByBrand} from '../../../redux/modules/entities/accounts/selectors'

import {getServicesInfo, getProviderTypes} from '../../../redux/modules/service-info/selectors'
import {fetchAll as serviceInfofetchAll} from '../../../redux/modules/service-info/actions'

import { checkForErrors } from '../../../util/helpers'
import { isValidTextField } from '../../../util/validators'
import { getServicesIds } from '../../../util/services-helpers'

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
    const { router, route, fetchAccounts, fetchServiceInfo } = this.props
    const {brand} = this.props.params

    router.setRouteLeaveHook(route, this.shouldLeave)

    //fetch serviceInfo from API
    fetchServiceInfo()
    fetchAccounts({brand})
  }

  validateInlineAdd({ name = '', brand = '', provider_type = '', services = List() }) {
    const conditions = {
      name: [
        {
          condition: this.props.accounts.findIndex(account => account.get('name') === name) > -1,
          errorText: 'That account name is taken'
        },
        {
          condition: ! isValidTextField(name),
          errorText: <MultilineTextFieldError fieldLabel="portal.account.manage.accountName.title" />
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
      if (typeof a.get(sortBy) === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      if (aVal < bVal) {
        return -1 * sortDir
      } else if (aVal > bVal) {
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
    const services = values => values.map(service => {
      const serviceDetails = this.props.servicesInfo.find(obj => obj.get('id') === service.get('id'))
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
          <Button bsStyle="success" className="btn-icon" onClick={() => {
            this.props.editAccount()
          }}>
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
            const servicesIds = getServicesIds(account.get('services')) || List()

            return (
              <tr key={index}>
                <td>{account.get('name')}</td>
                <td>{account.get('provider_type_label')}</td>
                <td>{id}</td>
                <td>{brand}</td>
                <ArrayCell items={services(servicesIds)} maxItemsShown={2}/>
                <td className="nowrap-column">
                  <ActionButtons
                    onEdit={() => {
                      this.props.editAccount(account)
                    }}
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
  accounts: PropTypes.instanceOf(List),
  deleteAccount: PropTypes.func,
  editAccount: PropTypes.func,
  fetchAccounts: PropTypes.func,
  fetchServiceInfo: PropTypes.func,
  params: PropTypes.object,
  providerTypes: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  router: PropTypes.object,
  servicesInfo: PropTypes.instanceOf(Map),
  uiActions: PropTypes.object
}

AccountList.defaultProps = {
  accounts: List()
}

const mapStateToProps = (state, ownProps) => {
  const {brand} = ownProps.params

  return {
    accounts: getByBrand(state, brand),
    providerTypes: getProviderTypes(state),
    servicesInfo: getServicesInfo(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchServiceInfo: () => dispatch(serviceInfofetchAll()),
    fetchAccounts: (params) => dispatch(accountActions.fetchAll(params)),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountList))

import React, {PropTypes} from 'react'
import { Map, List } from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import { FormattedMessage } from 'react-intl';

import {
  getAnalyticsUrlFromParams,
  getContentUrl,
  getNetworkUrl
} from '../../util/routes.js'

import accountActions from '../../redux/modules/entities/accounts/actions'
import { getById as getAccountById, getByBrand  } from '../../redux/modules/entities/accounts/selectors'
import { getGlobalFetching } from '../../redux/modules/fetching/selectors'

//TODO: UDNP-3177 remove when fetchItem has been removed
import * as accountActionCreators from '../../redux/modules/account'

import * as metricsActionCreators from '../../redux/modules/metrics'
import * as uiActionCreators from '../../redux/modules/ui'


import {
  filterMetricsByAccounts,
  userIsCloudProvider,
  userIsServiceProvider
} from '../../util/helpers'

import ContentItems from '../../components/content/content-items'

import * as PERMISSIONS from '../../constants/permissions'
import checkPermissions from '../../util/permissions'
import PROVIDER_TYPES from '../../constants/provider-types'
import CONTENT_ITEMS_TYPES from '../../constants/content-items-types'


export class Brand extends React.Component {
  constructor(props) {
    super(props);
    this.deleteAccount = this.deleteAccount.bind(this)
    this.createAccount = this.createAccount.bind(this)
    this.editAccount = this.editAccount.bind(this)
    this.sortItems = this.sortItems.bind(this)
  }
  componentWillMount() {
    const { fetchData, metrics, accounts, dailyTraffic, roles, user } = this.props;
    fetchData(
      metrics,
      accounts,
      dailyTraffic,
      checkPermissions(roles, user.get('currentUser'), PERMISSIONS.VIEW_CONTENT_ACCOUNTS)
    )
  }
  /* NOTE: id param is needed even if its not used as this function is called with ...arguments - and data needs to be 3rd param */
  createAccount(brand, id, data) {
    return this.props.oldAccountActions.createAccount(brand, data)
  }
  editAccount(brand, id, data) {
    return this.props.oldAccountActions.updateAccount(brand, id, data)
  }
  deleteAccount(id) {
    this.props.oldAccountActions.deleteAccount(this.props.params.brand, id)
  }
  sortItems(valuePath, direction) {
    this.props.uiActions.sortContentItems({valuePath, direction})
  }
  render() {
    const { brand } = this.props.params
    const {
      activeAccount,
      accounts,
      fetching,
      fetchingMetrics,
      metrics,
      params,
      roles,
      sortDirection,
      sortValuePath,
      viewingChart,
      user,
      uiActions } = this.props

    // Only UDN admins can see list of all accounts
    const currentUser = user.get('currentUser')
    const showAccountList = activeAccount.isEmpty() && userIsCloudProvider(currentUser)
    const contentItems = showAccountList
                      ? accounts
                      : List.of(activeAccount)
    const headerTextLabel = showAccountList
                              ? <FormattedMessage id='portal.brand.allAccounts.message'/>
                              : activeAccount.get('name')
    const selectionDisabled = !showAccountList && userIsServiceProvider(currentUser)

    const filteredMetrics = filterMetricsByAccounts(metrics, contentItems)

    const nextPageURLBuilder = (accountID, account) => {
      if (account.get('provider_type') === PROVIDER_TYPES.CONTENT_PROVIDER) {
        return getContentUrl('groups', accountID, this.props.params)
      } else {
        return getNetworkUrl('groups', accountID, this.props.params)
      }
    }
    const analyticsURLBuilder = (...account) => {
      return getAnalyticsUrlFromParams(
        {...this.props.params, account},
        user.get('currentUser'),
        roles
      )
    }
    return (
      <ContentItems
        analyticsURLBuilder={analyticsURLBuilder}
        brand={brand}
        params={params}
        changeNotification={uiActions.changeNotification}
        className="groups-container"
        createNewItem={this.createAccount}
        editItem={this.editAccount}
        contentItems={contentItems}
        dailyTraffic={this.props.dailyTraffic}
        deleteItem={this.deleteGroup}
        fetching={fetching}
        fetchingMetrics={fetchingMetrics}
        headerText={{ summary: <FormattedMessage id='portal.brand.summary.message'/>, label: headerTextLabel }}
        isAllowedToConfigure={checkPermissions(roles, currentUser, PERMISSIONS.MODIFY_ACCOUNTS)}
        metrics={filteredMetrics}
        nextPageURLBuilder={nextPageURLBuilder}
        selectionDisabled={selectionDisabled}
        showSlices={true}
        sortDirection={sortDirection}
        sortItems={this.sortItems}
        sortValuePath={sortValuePath}
        toggleChartView={uiActions.toggleChartView}
        type={CONTENT_ITEMS_TYPES.ACCOUNT}
        user={user}
        viewingChart={viewingChart}
        fetchItem={(id) => {
          /*eslint-disable no-console */
          console.warn('fetchItem will be deprecated in UDNP-3177')
          return this.props.oldAccountActions.fetchAccount(brand, id)
        }}
      />
    )
  }
}

Brand.displayName = 'Brand'
Brand.propTypes = {
  accounts: PropTypes.instanceOf(List),
  activeAccount: PropTypes.instanceOf(Map),
  dailyTraffic: PropTypes.instanceOf(List),
  fetchData: PropTypes.func,
  fetching: PropTypes.bool,
  fetchingMetrics: PropTypes.bool,
  metrics: PropTypes.instanceOf(List),
  oldAccountActions: PropTypes.object,
  params: PropTypes.object,
  roles: PropTypes.instanceOf(List),
  sortDirection: PropTypes.number,
  sortValuePath: PropTypes.instanceOf(List),
  uiActions: PropTypes.object,
  user: PropTypes.instanceOf(Map),
  viewingChart: PropTypes.bool
}
Brand.defaultProps = {
  Brand: List(),
  activeAccount: Map(),
  dailyTraffic: List(),
  metrics: List(),
  roles: List(),
  user: Map()
}

const mapStateToProps = (state, ownProps) => {
  return {
    activeAccount: getAccountById(state, ownProps.params.account), //state.account.get('activeAccount'),
    accounts: getByBrand(state, ownProps.params.brand), //state.account.get('allAccounts'),
    dailyTraffic: state.metrics.get('accountDailyTraffic'),
    fetching: getGlobalFetching(state), //state.account.get('fetching'),
    fetchingMetrics: state.metrics.get('fetchingAccountMetrics'),
    metrics: state.metrics.get('accountMetrics'),
    roles: state.roles.get('roles'),
    sortDirection: state.ui.get('contentItemSortDirection'),
    sortValuePath: state.ui.get('contentItemSortValuePath'),
    viewingChart: state.ui.get('viewingChart'),
    user: state.user
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {

  const {brand, account} = ownProps.params

  const oldAccountActions = bindActionCreators(accountActionCreators, dispatch)
  const metricsActions = bindActionCreators(metricsActionCreators, dispatch)

  const metricsOpts = {
    startDate: moment.utc().endOf('day').add(1,'second').subtract(28, 'days').format('X'),
    endDate: moment.utc().endOf('day').format('X')
  }

  return {
    fetchData: (metrics, accounts, dailyTraffic, canListAccounts) => {
      if (!canListAccounts) {
        metricsOpts.account = ownProps.params.account
        metricsOpts.list_children = false
        dispatch( accountActions.fetchOne({brand, id: account}) )
      } else {
        metricsOpts.list_children = true
        dispatch( accountActions.fetchAll({brand}) )
      }

      metricsActions.startAccountFetching()
      metricsActions.fetchAccountMetrics(metricsOpts)
      // TODO: Replace metrics endpoint with traffic endpoint after 0.7
      // metricsActions.startAccountFetching()
      // metricsActions.fetchHourlyAccountTraffic(metricsOpts)
      //   .then(() => metricsActions.fetchDailyAccountTraffic(metricsOpts))
      metricsActions.fetchDailyAccountTraffic(metricsOpts)
    },

    oldAccountActions,
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Brand);

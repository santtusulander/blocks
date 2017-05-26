import React, {PropTypes} from 'react'
import { List, Map } from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as metricsActionCreators from '../../redux/modules/metrics'
import * as uiActionCreators from '../../redux/modules/ui'

import accountActions from '../../redux/modules/entities/accounts/actions'
import groupActions from '../../redux/modules/entities/groups/actions'
import storageActions from '../../redux/modules/entities/CIS-ingest-points/actions'
import propertyActions from '../../redux/modules/entities/properties/actions'

import { getById as getAccountById } from '../../redux/modules/entities/accounts/selectors'
import { getById as getGroupById } from '../../redux/modules/entities/groups/selectors'

import { getByGroupWithTotalTraffic as getStoragesByGroup } from '../../redux/modules/entities/CIS-ingest-points/selectors'
import { getByGroupWithTotalTraffic as getPropertiesByGroup } from '../../redux/modules/entities/properties/selectors'

import { getGlobalFetching } from '../../redux/modules/fetching/selectors'
import { getCurrentUser } from '../../redux/modules/user'

import { fetchMetrics as fetchStorageMetrics } from '../../redux/modules/entities/storage-metrics/actions'

import ContentItems from '../../components/content/content-items'

import * as PERMISSIONS from '../../constants/permissions'
import CONTENT_ITEMS_TYPES from '../../constants/content-items-types'
import { startOfThisMonth, startOfLast28, endOfThisDay } from '../../constants/date-ranges'

import { checkUserPermissions, getStoragePermissions } from '../../util/permissions'
import { getAnalyticsUrlFromParams } from '../../util/routes'

import {FormattedMessage, injectIntl} from 'react-intl'

export class Group extends React.Component {
  constructor(props) {
    super(props);

    this.deleteHost = this.deleteHost.bind(this)
    this.sortItems = this.sortItems.bind(this)
    this.createNewHost = this.createNewHost.bind(this)
  }
  componentWillMount() {
    this.props.fetchGroupData()
    this.props.fetchMetricsData()
  }

  createNewHost(id, deploymentMode, serviceType) {
    /* Create initial services and configurations for property */
    const payload = {
      services: [{
        service_type: serviceType,
        deployment_mode: deploymentMode,
        configurations: [{
          edge_configuration: {
            published_name: id
          }
        }]
      }]
    }
    return this.props.createProperty(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      payload
      ).then(({ error, payload }) => (
          { item: 'Property', error, payload }
      ))
  }

  deleteHost(id) {
    return this.props.deleteProperty(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      id
    ).then(({ error, payload }) => (
        { item: 'Property', error, payload }
    ))
  }
  sortItems(valuePath, direction) {
    this.props.uiActions.sortContentItems({valuePath, direction})
  }
  render() {
    const params = this.props.params
    const { brand, account, group } = params
    const { activeAccount, activeGroup, currentUser } = this.props

    const breadcrumbs = [
      {
        label: activeAccount ? activeAccount.get('name') : <FormattedMessage id="portal.loading.text"/>,
        url: `/content/groups/udn/${account}`
      },
      {
        label: activeGroup ? activeGroup.get('name') : <FormattedMessage id="portal.loading.text"/>
      }
    ]

    const storagePermission = getStoragePermissions(currentUser)

    return (
      <ContentItems
        activeAccount={activeAccount}
        activeGroup={activeGroup}
        brand={brand}
        group={group}
        params={params}

        className="hosts-container"
        changeNotification={this.props.uiActions.changeNotification}
        storages={this.props.storages}
        properties={this.props.properties}

        createNewItem={this.createNewHost}
        deleteItem={this.deleteHost}
        fetching={this.props.fetching}
        fetchingMetrics={this.props.fetchingMetrics}
        headerText={{ summary: <FormattedMessage id="portal.hosts.groupContentSummary.text"/>, label: breadcrumbs[1].label }}
        ifNoContent={activeGroup ? `${activeGroup.get('name')} contains no properties` : <FormattedMessage id="portal.loading.text"/>}
        // TODO: We need to use published_hosts permissions from the north API
        // instead of groups permissions, but they dont exist yet.
        isAllowedToConfigure={checkUserPermissions(currentUser, PERMISSIONS.MODIFY_GROUP)}
        sortDirection={this.props.sortDirection}
        sortItems={this.sortItems}
        sortValuePath={this.props.sortValuePath}
        toggleChartView={this.props.uiActions.toggleChartView}
        type={CONTENT_ITEMS_TYPES.PROPERTY}
        user={currentUser}
        storagePermission={storagePermission}
        viewingChart={this.props.viewingChart}
        showInfoDialog={this.props.uiActions.showInfoDialog}
        hideInfoDialog={this.props.uiActions.hideInfoDialog}

        showAnalyticsLink={true}
        analyticsURLBuilder={() => getAnalyticsUrlFromParams(params, currentUser)}
      />
    )
  }
}

Group.displayName = 'Group'
Group.propTypes = {
  activeAccount: PropTypes.instanceOf(Map),
  activeGroup: PropTypes.instanceOf(Map),
  createProperty: PropTypes.func,
  currentUser: PropTypes.instanceOf(Map),
  deleteProperty: PropTypes.func,
  fetchGroupData: PropTypes.func,
  fetchMetricsData: PropTypes.func,
  fetching: PropTypes.bool,
  fetchingMetrics: PropTypes.bool,
  params: PropTypes.object,
  properties: PropTypes.instanceOf(List),
  sortDirection: PropTypes.number,
  sortValuePath: PropTypes.instanceOf(List),
  storages: PropTypes.instanceOf(List),
  uiActions: PropTypes.object,
  viewingChart: PropTypes.bool
}
Group.defaultProps = {
  activeAccount: Map(),
  activeGroup: Map(),
  sortValuePath: List(),
  storages: List(),
  currentUser: Map()
}

/* istanbul ignore next */
const mapStateToProps = (state, { params: { account, group } }) => {
  return {
    activeAccount: getAccountById(state, account),
    activeGroup: getGroupById(state, group),
    currentUser: getCurrentUser(state),
    fetching: getGlobalFetching(state),
    fetchingMetrics: state.metrics.get('fetchingHostMetrics'),
    properties: getPropertiesByGroup(state, group),
    storages: getStoragesByGroup(state, group),
    sortDirection: state.ui.get('contentItemSortDirection'),
    sortValuePath: state.ui.get('contentItemSortValuePath'),
    user: state.user,
    viewingChart: state.ui.get('viewingChart')
  };
}

/* istanbul ignore next */
const mapDispatchToProps =  (dispatch, ownProps) => {
  const {brand, account, group} = ownProps.params

  const metricsActions = bindActionCreators(metricsActionCreators, dispatch)
  const metricsOpts = {
    account: account,
    group: group,
    startDate: startOfLast28().format('X'),
    endDate: endOfThisDay().format('X')
  }

  const fetchGroupData = () => {
    return Promise.all([
      dispatch(accountActions.fetchOne({brand, id: account})),
      dispatch(groupActions.fetchOne({brand, account, id: group})),
      dispatch(storageActions.fetchAll({ brand, account, group })),
      dispatch(propertyActions.fetchAll({ brand, account, group }))
    ])
  }

  const fetchMetricsData = () => {
    metricsActions.startHostFetching()

    return Promise.all([
      metricsActions.fetchHostMetrics(metricsOpts),
      metricsActions.fetchDailyHostTraffic(metricsOpts),
      dispatch(fetchStorageMetrics({ ...metricsOpts, include_history: true, startDate: startOfThisMonth().format('X') }))
    ])
  }

  return {
    fetchGroupData: fetchGroupData,
    fetchMetricsData: fetchMetricsData,
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    deleteProperty: (brand, account, group, id) => dispatch(propertyActions.remove({brand, account, group, id})),
    createProperty: (brand, account, group, payload) => dispatch(propertyActions.create({brand, account, group, payload}))

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Group));

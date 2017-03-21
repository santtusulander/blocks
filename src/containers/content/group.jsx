import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

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

import { fetchMetrics as fetchStorageMetrics } from '../../redux/modules/entities/storage-metrics/actions'

import ContentItems from '../../components/content/content-items'

import * as PERMISSIONS from '../../constants/permissions'
import CONTENT_ITEMS_TYPES from '../../constants/content-items-types'

import checkPermissions, {getStoragePermissions} from '../../util/permissions'
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

  createNewHost(id, deploymentMode) {
    return this.props.hostActions.createHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      id,
      deploymentMode
    )
  }
  deleteHost(id) {
    return this.props.hostActions.deleteHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      id
    )
  }
  sortItems(valuePath, direction) {
    this.props.uiActions.sortContentItems({valuePath, direction})
  }
  render() {
    const params = this.props.params
    const { brand, account, group } = params
    const { activeAccount, activeGroup, roles, user } = this.props

    const breadcrumbs = [
      {
        label: activeAccount ? activeAccount.get('name') : <FormattedMessage id="portal.loading.text"/>,
        url: `/content/groups/udn/${account}`
      },
      {
        label: activeGroup ? activeGroup.get('name') : <FormattedMessage id="portal.loading.text"/>
      }
    ]

    const storagePermission = getStoragePermissions(roles, user.get('currentUser'))

    return (
      <ContentItems
        activeAccount={activeAccount}
        activeGroup={activeGroup}
        brand={brand}
        group={group}
        params={params}

        className="hosts-container"

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
        isAllowedToConfigure={checkPermissions(this.props.roles, this.props.user.get('currentUser'), PERMISSIONS.MODIFY_GROUP)}
        sortDirection={this.props.sortDirection}
        sortItems={this.sortItems}
        sortValuePath={this.props.sortValuePath}
        toggleChartView={this.props.uiActions.toggleChartView}
        type={CONTENT_ITEMS_TYPES.PROPERTY}
        user={this.props.user}
        roles={this.props.roles}
        storagePermission={storagePermission}
        viewingChart={this.props.viewingChart}
        showInfoDialog={this.props.uiActions.showInfoDialog}
        hideInfoDialog={this.props.uiActions.hideInfoDialog}
        
        showAnalyticsLink={true}
        analyticsURLBuilder={() => getAnalyticsUrlFromParams(params, user, roles)}
      />
    )
  }
}

Group.displayName = 'Group'
Group.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  fetchGroupData: React.PropTypes.func,
  fetchMetricsData: React.PropTypes.func,
  fetching: React.PropTypes.bool,
  fetchingMetrics: React.PropTypes.bool,
  hostActions: React.PropTypes.object,
  params: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(Immutable.List),
  roles: React.PropTypes.instanceOf(Immutable.List),
  sortDirection: React.PropTypes.number,
  sortValuePath: React.PropTypes.instanceOf(Immutable.List),
  storages: React.PropTypes.instanceOf(Immutable.Iterable),
  uiActions: React.PropTypes.object,
  user: React.PropTypes.instanceOf(Immutable.Map),
  viewingChart: React.PropTypes.bool
}
Group.defaultProps = {
  activeAccount: Immutable.Map(),
  activeGroup: Immutable.Map(),
  roles: Immutable.List(),
  sortValuePath: Immutable.List(),
  storages: Immutable.List(),
  user: Immutable.Map()
}

const mapStateToProps = (state, { params: { account, group } }) => {
  return {
    activeAccount: getAccountById( state, account),
    activeGroup: getGroupById(state, group),
    fetching: getGlobalFetching(state),
    fetchingMetrics: state.metrics.get('fetchingHostMetrics'),
    properties: getPropertiesByGroup(state, group),
    storages: getStoragesByGroup(state, group),
    roles: state.roles.get('roles'),
    sortDirection: state.ui.get('contentItemSortDirection'),
    sortValuePath: state.ui.get('contentItemSortValuePath'),
    user: state.user,
    viewingChart: state.ui.get('viewingChart')
  };
}

const mapDispatchToProps =  (dispatch, ownProps) => {
  const {brand, account, group} = ownProps.params

  const metricsActions = bindActionCreators(metricsActionCreators, dispatch)
  const metricsOpts = {
    account: account,
    group: group,
    startDate: moment.utc().endOf('day').add(1,'second').subtract(28, 'days').format('X'),
    endDate: moment.utc().endOf('day').format('X')
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
      dispatch(fetchStorageMetrics({ ...metricsOpts, include_history: true }))
    ])
  }

  return {
    fetchGroupData: fetchGroupData,
    fetchMetricsData: fetchMetricsData,
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Group));

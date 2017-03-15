import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import * as accountActionCreators from '../redux/modules/account'
import * as groupActionCreators from '../redux/modules/group'
import * as hostActionCreators from '../redux/modules/host'
import * as metricsActionCreators from '../redux/modules/metrics'
import * as uiActionCreators from '../redux/modules/ui'

import storageActions from '../redux/modules/entities/CIS-ingest-points/actions'
import propertyActions from '../redux/modules/entities/properties/actions'

import { getByGroup as getStoragesByGroup } from '../redux/modules/entities/CIS-ingest-points/selectors'
import { getByGroup as getPropertiesByGroup } from '../redux/modules/entities/properties/selectors'

import { fetchMetrics as fetchStorageMetrics } from '../redux/modules/entities/storage-metrics/actions'

import ContentItems from '../components/content/content-items'

import * as PERMISSIONS from '../constants/permissions'
import CONTENT_ITEMS_TYPES from '../constants/content-items-types'
import checkPermissions from '../util/permissions'
import {getStoragePermissions} from '../util/permissions'

import {FormattedMessage, injectIntl} from 'react-intl'

export class Hosts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: false
    }

    this.startFetching = this.startFetching.bind(this)
    this.stopFetching = this.stopFetching.bind(this)
    this.deleteHost = this.deleteHost.bind(this)
    this.sortItems = this.sortItems.bind(this)
    this.createNewHost = this.createNewHost.bind(this)
  }
  componentWillMount() {
    if(!this.props.activeGroup ||
      String(this.props.activeGroup.get('id')) !== this.props.params.group ) {
      this.startFetching();
      this.props.fetchGroupData()
        .then(this.stopFetching, this.stopFetching)
        .then(() => {
          this.props.fetchMetricsData()
        })
    } else {
      this.props.fetchMetricsData()
    }
  }

  startFetching() {
    this.setState({fetching: true});
  }

  stopFetching() {
    this.setState({fetching: false});
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
    this.props.hostActions.deleteHost(
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
        activeAccount={this.props.activeAccount}
        activeGroup={activeGroup}
        brand={brand}
        params={params}
        className="hosts-container"

        storages={this.props.storages}
        properties={this.props.properties}

        createNewItem={this.createNewHost}
        deleteItem={this.deleteHost}
        fetching={this.state.fetching}
        fetchingMetrics={this.props.fetchingMetrics}
        group={group}
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
        hideInfoDialog={this.props.uiActions.hideInfoDialog}/>
    )
  }
}

Hosts.displayName = 'Hosts'
Hosts.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  fetchGroupData: React.PropTypes.func,
  fetchMetricsData: React.PropTypes.func,
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
Hosts.defaultProps = {
  activeAccount: Immutable.Map(),
  activeGroup: Immutable.Map(),
  roles: Immutable.List(),
  sortValuePath: Immutable.List(),
  storages: Immutable.List(),
  user: Immutable.Map()
}

const mapStateToProps = (state, { params: { group } }) => {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    fetchingMetrics: state.metrics.get('fetchingHostMetrics'),
    properties: getPropertiesByGroup(state, group), //state.host.get('allHosts'),
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
  const accountActions = bindActionCreators(accountActionCreators, dispatch)
  const groupActions = bindActionCreators(groupActionCreators, dispatch)
  const hostActions = bindActionCreators(hostActionCreators, dispatch)
  const metricsActions = bindActionCreators(metricsActionCreators, dispatch)
  const metricsOpts = {
    account: account,
    group: group,
    startDate: moment.utc().endOf('day').add(1,'second').subtract(28, 'days').format('X'),
    endDate: moment.utc().endOf('day').format('X')
  }
  const fetchGroupData = () => {
    return Promise.all([
      accountActions.fetchAccount(brand, account),
      groupActions.fetchGroup(brand, account, group),

      dispatch(storageActions.fetchAll({ brand, account, group })),
      dispatch(propertyActions.fetchAll({ brand, account, group }))
    ])
  }

  const fetchMetricsData = () => {
    metricsActions.startHostFetching()
    metricsActions.fetchHostMetrics(metricsOpts)
    metricsActions.fetchDailyHostTraffic(metricsOpts),
    dispatch(fetchStorageMetrics({ ...metricsOpts, include_history: true }))
  }
  return {
    fetchGroupData: fetchGroupData,
    fetchMetricsData: fetchMetricsData,
    hostActions: hostActions,
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Hosts));

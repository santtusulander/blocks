import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import { getAnalyticsUrlFromParams, getContentUrl } from '../util/routes.js'

import * as accountActionCreators from '../redux/modules/account'
import * as groupActionCreators from '../redux/modules/group'
import * as hostActionCreators from '../redux/modules/host'
import * as metricsActionCreators from '../redux/modules/metrics'
import * as uiActionCreators from '../redux/modules/ui'

import ContentItems from '../components/content/content-items'

import * as PERMISSIONS from '../constants/permissions'
import checkPermissions from '../util/permissions'

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
      String(this.props.activeGroup.get('id')) !== this.props.params.group ||
      this.props.configuredHostNames.size === 0) {
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
    const { brand, account, group } = this.props.params
    const { activeAccount, activeGroup, roles, user } = this.props
    const propertyNames = this.props.propertyNames.size ?
      this.props.propertyNames : this.props.hosts
    const properties = propertyNames.map(host => {
      return Immutable.Map({
        id: host,
        name: host
      })
    })
    const nextPageURLBuilder = (property) => {
      return getContentUrl('property', property, params)
    }
    const configURLBuilder = (property) => {
      return getContentUrl('propertyConfiguration', property, params)
    }
    const analyticsURLBuilder = (property) => {
      return getAnalyticsUrlFromParams(
        {...this.props.params, property},
        user.get('currentUser'),
        roles
      )
    }
    const breadcrumbs = [
      {
        label: activeAccount ? activeAccount.get('name') : <FormattedMessage id="portal.loading.text"/>,
        url: `/content/groups/udn/${account}`
      },
      {
        label: activeGroup ? activeGroup.get('name') : <FormattedMessage id="portal.loading.text"/>
      }
    ]
    return (
      <ContentItems
        activeAccount={this.props.activeAccount}
        activeGroup={activeGroup}
        analyticsURLBuilder={analyticsURLBuilder}
        brand={brand}
        params={this.props.params}
        className="hosts-container"
        configURLBuilder={configURLBuilder}
        contentItems={properties}
        createNewItem={this.createNewHost}
        dailyTraffic={this.props.dailyTraffic}
        deleteItem={this.deleteHost}
        fetching={this.state.fetching}
        fetchingMetrics={this.props.fetchingMetrics}
        group={group}
        headerText={{ summary: <FormattedMessage id="portal.hosts.groupContentSummary.text"/>, label: breadcrumbs[1].label }}
        ifNoContent={activeGroup ? `${activeGroup.get('name')} contains no properties` : <FormattedMessage id="portal.loading.text"/>}
        // TODO: We need to use published_hosts permissions from the north API
        // instead of groups permissions, but they dont exist yet.
        isAllowedToConfigure={checkPermissions(this.props.roles, this.props.user.get('currentUser'), PERMISSIONS.MODIFY_GROUP)}
        metrics={this.props.metrics}
        nextPageURLBuilder={nextPageURLBuilder}
        showAnalyticsLink={true}
        showSlices={true}
        sortDirection={this.props.sortDirection}
        sortItems={this.sortItems}
        sortValuePath={this.props.sortValuePath}
        toggleChartView={this.props.uiActions.toggleChartView}
        type='property'
        user={this.props.user}
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
  configuredHostNames: React.PropTypes.instanceOf(Immutable.List),
  dailyTraffic: React.PropTypes.instanceOf(Immutable.List),
  fetchGroupData: React.PropTypes.func,
  fetchMetricsData: React.PropTypes.func,
  fetchingMetrics: React.PropTypes.bool,
  hostActions: React.PropTypes.object,
  hosts: React.PropTypes.instanceOf(Immutable.List),
  metrics: React.PropTypes.instanceOf(Immutable.List),
  params: React.PropTypes.object,
  propertyNames: React.PropTypes.instanceOf(Immutable.List),
  roles: React.PropTypes.instanceOf(Immutable.List),
  sortDirection: React.PropTypes.number,
  sortValuePath: React.PropTypes.instanceOf(Immutable.List),
  uiActions: React.PropTypes.object,
  user: React.PropTypes.instanceOf(Immutable.Map),
  viewingChart: React.PropTypes.bool
}
Hosts.defaultProps = {
  activeAccount: Immutable.Map(),
  activeGroup: Immutable.Map(),
  dailyTraffic: Immutable.List(),
  hosts: Immutable.List(),
  metrics: Immutable.List(),
  propertyNames: Immutable.List(),
  roles: Immutable.List(),
  sortValuePath: Immutable.List(),
  user: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    configuredHostNames: state.host.get('configuredHostNames'),
    dailyTraffic: state.metrics.get('hostDailyTraffic'),
    fetchingMetrics: state.metrics.get('fetchingHostMetrics'),
    hosts: state.host.get('allHosts'),
    propertyNames: state.host.get('configuredHostNames'),
    metrics: state.metrics.get('hostMetrics'),
    roles: state.roles.get('roles'),
    sortDirection: state.ui.get('contentItemSortDirection'),
    sortValuePath: state.ui.get('contentItemSortValuePath'),
    user: state.user,
    viewingChart: state.ui.get('viewingChart')
  };
}

function mapDispatchToProps(dispatch, ownProps) {
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
      hostActions.startFetching(),
      accountActions.fetchAccount(brand, account),
      groupActions.fetchGroup(brand, account, group),
      hostActions.fetchHosts(brand, account, group),
      hostActions.fetchConfiguredHostNames(brand, account, group)
    ])
  }
  const fetchMetricsData = () => {
    metricsActions.startHostFetching()
    metricsActions.fetchHostMetrics(metricsOpts)
    metricsActions.fetchDailyHostTraffic(metricsOpts)
  }
  return {
    fetchGroupData: fetchGroupData,
    fetchMetricsData: fetchMetricsData,
    hostActions: hostActions,
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Hosts));

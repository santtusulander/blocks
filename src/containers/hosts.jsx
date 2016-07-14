import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import { getAnalyticsUrl, getContentUrl } from '../util/helpers.js'

import * as accountActionCreators from '../redux/modules/account'
import * as groupActionCreators from '../redux/modules/group'
import * as hostActionCreators from '../redux/modules/host'
import * as metricsActionCreators from '../redux/modules/metrics'
import * as uiActionCreators from '../redux/modules/ui'

import ContentItems from '../components/content/content-items'

export class Hosts extends React.Component {
  constructor(props) {
    super(props);

    this.deleteHost = this.deleteHost.bind(this)
    this.sortItems = this.sortItems.bind(this)
    this.createNewHost = this.createNewHost.bind(this)
  }
  componentWillMount() {
    if(!this.props.activeGroup ||
      String(this.props.activeGroup.get('id')) !== this.props.params.group) {
      this.props.fetchGroupData()
    }
    this.props.fetchMetricsData()
  }
  createNewHost(id, deploymentMode) {
    this.props.hostActions.createHost(
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
    const { activeAccount, activeGroup } = this.props
    const properties = this.props.hosts.map(host => {
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
    const analyticsURLBuilder = (...property) => {
      return getAnalyticsUrl('property', property, params)
    }
    const breadcrumbs = [
      {
        label: activeAccount ? activeAccount.get('name') : 'Loading...',
        url: `/content/groups/udn/${account}`
      },
      {
        label: activeGroup ? activeGroup.get('name') : 'Loading...'
      }
    ]
    return (
      <ContentItems
        activeAccount={this.props.activeAccount}
        activeGroup={activeGroup}
        analyticsURLBuilder={analyticsURLBuilder}
        brand={brand}
        params={this.props.params}
        history={this.props.history}
        className="hosts-container"
        configURLBuilder={configURLBuilder}
        contentItems={properties}
        createNewItem={this.createNewHost}
        dailyTraffic={this.props.dailyTraffic}
        deleteItem={this.deleteHost}
        fetching={this.props.fetching}
        fetchingMetrics={this.props.fetchingMetrics}
        group={group}
        headerText={{ summary: 'GROUP CONTENT SUMMARY', label: breadcrumbs[1].label }}
        ifNoContent={activeGroup ? `${activeGroup.get('name')} contains no properties` : 'Loading...'}
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
        viewingChart={this.props.viewingChart}/>
    )
  }
}

Hosts.displayName = 'Hosts'
Hosts.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  dailyTraffic: React.PropTypes.instanceOf(Immutable.List),
  fetchGroupData: React.PropTypes.func,
  fetchMetricsData: React.PropTypes.func,
  fetching: React.PropTypes.bool,
  fetchingMetrics: React.PropTypes.bool,
  history: React.PropTypes.object,
  hostActions: React.PropTypes.object,
  hosts: React.PropTypes.instanceOf(Immutable.List),
  metrics: React.PropTypes.instanceOf(Immutable.List),
  params: React.PropTypes.object,
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
  sortValuePath: Immutable.List(),
  user: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    dailyTraffic: state.metrics.get('hostDailyTraffic'),
    fetching: state.host.get('fetching'),
    fetchingMetrics: state.metrics.get('fetchingHostMetrics'),
    hosts: state.host.get('allHosts'),
    metrics: state.metrics.get('hostMetrics'),
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
    hostActions.startFetching()
    accountActions.fetchAccount(brand, account)
    groupActions.fetchGroup(brand, account, group)
    hostActions.fetchHosts(brand, account, group)
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

export default connect(mapStateToProps, mapDispatchToProps)(Hosts);

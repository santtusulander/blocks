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

import ContentItems from '../components/content-items'

export class Hosts extends React.Component {
  constructor(props) {
    super(props);

    this.deleteHost = this.deleteHost.bind(this)
    this.sortItems = this.sortItems.bind(this)
    this.createNewHost = this.createNewHost.bind(this)
  }
  componentWillMount() {
    if(!this.props.activeGroup || String(this.props.activeGroup.get('id')) !== this.props.params.group) {
      this.props.fetchData()
    }
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
    const { brand, account, group } = this.props.params
    const { activeAccount, activeGroup } = this.props
    const properties = this.props.hosts.map(host => {
      return Immutable.Map({
        id: host,
        name: host
      })
    })
    const builtPath = `${brand}/${account}/${group}/property?name=`
    const nextPageURLBuilder = (property) => {
      const encoded = encodeURIComponent(property).replace(/\./g, "%2e")
      return `/content/property/${builtPath}${encoded}`
    }
    const configURLBuilder = (property) => {
      const encoded = encodeURIComponent(property).replace(/\./g, "%2e")
      return `/content/configuration/${builtPath}${encoded}`
    }
    const analyticsURLBuilder = (...property) => {
      if(property[0]) {
        const encoded = encodeURIComponent(property[0]).replace(/\./g, "%2e")
        return `/content/analytics/property/${builtPath}${encoded}`
      }
      return `/content/analytics/group/${brand}/${account}/${group}`
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
        account={account}
        activeAccount={this.props.activeAccount}
        activeGroup={activeGroup}
        analyticsURLBuilder={analyticsURLBuilder}
        brand={brand}
        breadcrumbs={breadcrumbs}
        className="hosts-container"
        configURLBuilder={configURLBuilder}
        contentItems={properties}
        createNewItem={this.createNewHost}
        deleteItem={this.deleteHost}
        fetching={this.props.fetching}
        headerText={{ summary: 'GROUP CONTENT SUMMARY', label: breadcrumbs[1].label }}
        fetchingMetrics={this.props.fetchingMetrics}
        group={group}
        metrics={this.props.metrics}
        nextPageURLBuilder={nextPageURLBuilder}
        showAnalyticsLink={true}
        sortDirection={this.props.sortDirection}
        sortItems={this.sortItems}
        sortValuePath={this.props.sortValuePath}
        toggleChartView={this.props.uiActions.toggleChartView}
        type='property'
        viewingChart={this.props.viewingChart}/>
    )
  }
}

Hosts.displayName = 'Hosts'
Hosts.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  fetchData: React.PropTypes.func,
  fetching: React.PropTypes.bool,
  fetchingMetrics: React.PropTypes.bool,
  hostActions: React.PropTypes.object,
  hosts: React.PropTypes.instanceOf(Immutable.List),
  metrics: React.PropTypes.instanceOf(Immutable.List),
  params: React.PropTypes.object,
  sortDirection: React.PropTypes.number,
  sortValuePath: React.PropTypes.instanceOf(Immutable.List),
  uiActions: React.PropTypes.object,
  viewingChart: React.PropTypes.bool
}
Hosts.defaultProps = {
  activeAccount: Immutable.Map(),
  activeGroup: Immutable.Map(),
  hosts: Immutable.List(),
  metrics: Immutable.List(),
  sortValuePath: Immutable.List()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    fetching: state.host.get('fetching'),
    fetchingMetrics: state.metrics.get('fetchingHostMetrics'),
    hosts: state.host.get('allHosts'),
    metrics: state.metrics.get('hostMetrics'),
    sortDirection: state.ui.get('contentItemSortDirection'),
    sortValuePath: state.ui.get('contentItemSortValuePath'),
    viewingChart: state.ui.get('viewingChart')
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const {brand, account, group} = ownProps.params
  const accountActions = bindActionCreators(accountActionCreators, dispatch)
  const groupActions = bindActionCreators(groupActionCreators, dispatch)
  const hostActions = bindActionCreators(hostActionCreators, dispatch)
  const metricsActions = bindActionCreators(metricsActionCreators, dispatch)
  const fetchData = () => {
    hostActions.startFetching()
    accountActions.fetchAccount(brand, account)
    groupActions.fetchGroup(brand, account, group)
    hostActions.fetchHosts(brand, account, group)
    metricsActions.startHostFetching()
    metricsActions.fetchHostMetrics({
      account: account,
      group: group,
      startDate: moment.utc().endOf('hour').add(1,'second').subtract(28, 'days').format('X'),
      endDate: moment.utc().endOf('hour').format('X')
    })
  }
  return {
    fetchData: fetchData,
    hostActions: hostActions,
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Hosts);

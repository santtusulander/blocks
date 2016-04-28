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

    this.createNewHost = this.createNewHost.bind(this)
    this.deleteHost = this.deleteHost.bind(this)
    this.sortItems = this.sortItems.bind(this)
    this.toggleAddHost = this.toggleAddHost.bind(this)
    this.sortItems = this.sortItems.bind(this)

    this.state = {
      addHost: false
    }
  }
  componentWillMount() {
    this.props.hostActions.startFetching()
    const {brand, account, group} = this.props.params;
    this.props.hostActions.fetchHosts(brand, account, group)
    this.props.accountActions.fetchAccount(
      this.props.params.brand,
      this.props.params.account
    )
    this.props.groupActions.fetchGroup(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group
    )
    this.props.metricsActions.startHostFetching()
    this.props.metricsActions.fetchHostMetrics({
      account: this.props.params.account,
      group: this.props.params.group,
      startDate: moment.utc().endOf('hour').add(1,'second').subtract(28, 'days').format('X'),
      endDate: moment.utc().endOf('hour').format('X')
    })
  }
  createNewHost(id, deploymentMode) {
    this.props.hostActions.createHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      id,
      deploymentMode
    )
    this.toggleAddHost()
  }
  deleteHost(id) {
    this.props.hostActions.deleteHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      id
    )
  }
  toggleAddHost() {
    this.setState({
      addHost: !this.state.addHost
    })
  }
  sortItems(valuePath, direction) {
    this.props.uiActions.sortContentItems({valuePath, direction})
  }
  render() {
    const {brand, account, group} = this.props.params;
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
    const analyticsURLBuilder = (property) => {
      const encoded = encodeURIComponent(property).replace(/\./g, "%2e")
      return `/content/analytics/property/${builtPath}${encoded}`
    }
    return (
      <ContentItems
        account={this.props.params.account}
        activeAccount={this.props.activeAccount}
        activeGroup={this.props.activeGroup}
        analyticsURLBuilder={analyticsURLBuilder}
        brand={this.props.params.brand}
        className="hosts-container"
        configURLBuilder={configURLBuilder}
        contentItems={properties}
        deleteItem={this.deleteHost}
        fetching={this.props.fetching}
        fetchingMetrics={this.props.fetchingMetrics}
        group={this.props.params.group}
        metrics={this.props.metrics}
        nextPageURLBuilder={nextPageURLBuilder}
        sortDirection={this.props.sortDirection}
        sortItems={this.sortItems}
        sortValuePath={this.props.sortValuePath}
        toggleChartView={this.props.uiActions.toggleChartView}
        viewingChart={this.props.viewingChart}/>
    )
  }
}

Hosts.displayName = 'Hosts'
Hosts.propTypes = {
  accountActions: React.PropTypes.object,
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  fetching: React.PropTypes.bool,
  fetchingMetrics: React.PropTypes.bool,
  groupActions: React.PropTypes.object,
  hostActions: React.PropTypes.object,
  hosts: React.PropTypes.instanceOf(Immutable.List),
  metrics: React.PropTypes.instanceOf(Immutable.List),
  metricsActions: React.PropTypes.object,
  params: React.PropTypes.object,
  sortDirection: React.PropTypes.number,
  sortValuePath: React.PropTypes.instanceOf(Immutable.List),
  uiActions: React.PropTypes.object,
  viewingChart: React.PropTypes.bool
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

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    groupActions: bindActionCreators(groupActionCreators, dispatch),
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    metricsActions: bindActionCreators(metricsActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Hosts);

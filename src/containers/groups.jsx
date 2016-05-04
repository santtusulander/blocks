import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import * as accountActionCreators from '../redux/modules/account'
import * as groupActionCreators from '../redux/modules/group'
import * as metricsActionCreators from '../redux/modules/metrics'
import * as uiActionCreators from '../redux/modules/ui'

import ContentItems from '../components/content-items'

export class Groups extends React.Component {
  constructor(props) {
    super(props)

    this.deleteGroup = this.deleteGroup.bind(this)
    this.sortItems = this.sortItems.bind(this)
  }
  componentWillMount() {
    if(!this.props.activeAccount || String(this.props.activeAccount.get('id')) !== this.props.params.account) {
      this.props.fetchData()
    }
  }
  deleteGroup(id) {
    this.props.groupActions.deleteGroup(
      this.props.params.brand,
      this.props.params.account,
      id
    )
  }
  sortItems(valuePath, direction) {
    this.props.uiActions.sortContentItems({valuePath, direction})
  }
  render() {
    const { brand, account } = this.props.params
    const { activeAccount, activeGroup } = this.props
    const builtPath = `${brand}/${account}`
    const nextPageURLBuilder = (groupID) => `/content/hosts/${builtPath}/${groupID}`
    const analyticsURLBuilder = (...groupID) => {
        return groupID[0] ? `/content/analytics/group/${builtPath}/${groupID[0]}`
          : `/content/analytics/account/${brand}/${account}`
    }
    const configURLBuilder = (groupID) => `/content/analytics/group/${builtPath}/${groupID}`
    const breadcrumbs = [{ label: activeAccount ? activeAccount.get('name') : 'Loading...' }]
    return (
      <ContentItems
        account={account}
        activeAccount={activeAccount}
        activeGroup={activeGroup}
        analyticsURLBuilder={analyticsURLBuilder}
        brand={brand}
        breadcrumbs={breadcrumbs}
        className="groups-container"
        configURLBuilder={configURLBuilder}
        contentItems={this.props.groups}
        deleteItem={this.deleteGroup}
        fetching={this.props.fetching}
        fetchingMetrics={this.props.fetchingMetrics}
        headerText={['ACCOUNT CONTENT SUMMARY', breadcrumbs[0].label]}
        metrics={this.props.metrics}
        nextPageURLBuilder={nextPageURLBuilder}
        showAnalyticsLink={true}
        sortDirection={this.props.sortDirection}
        sortItems={this.sortItems}
        sortValuePath={this.props.sortValuePath}
        toggleChartView={this.props.uiActions.toggleChartView}
        type='group'
        viewingChart={this.props.viewingChart}/>
    )
  }
}

Groups.displayName = 'Groups'
Groups.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  fetchData: React.PropTypes.func,
  fetching: React.PropTypes.bool,
  fetchingMetrics: React.PropTypes.bool,
  groupActions: React.PropTypes.object,
  groups: React.PropTypes.instanceOf(Immutable.List),
  metrics: React.PropTypes.instanceOf(Immutable.List),
  params: React.PropTypes.object,
  sortDirection: React.PropTypes.number,
  sortValuePath: React.PropTypes.instanceOf(Immutable.List),
  uiActions: React.PropTypes.object,
  viewingChart: React.PropTypes.bool
}
Groups.defaultProps = {
  activeAccount: Immutable.Map(),
  activeGroup: Immutable.Map(),
  groups: Immutable.List(),
  metrics: Immutable.List(),
  sortValuePath: Immutable.List()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    allAccounts: state.account.get('allAccounts'),
    activeGroup: state.group.get('activeGroup'),
    fetching: state.group.get('fetching'),
    fetchingMetrics: state.metrics.get('fetchingGroupMetrics'),
    groups: state.group.get('allGroups'),
    metrics: state.metrics.get('groupMetrics'),
    sortDirection: state.ui.get('contentItemSortDirection'),
    sortValuePath: state.ui.get('contentItemSortValuePath'),
    viewingChart: state.ui.get('viewingChart')
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const {brand, account} = ownProps.params
  const accountActions = bindActionCreators(accountActionCreators, dispatch)
  const groupActions = bindActionCreators(groupActionCreators, dispatch)
  const metricsActions = bindActionCreators(metricsActionCreators, dispatch)
  const fetchData = () => {
    accountActions.fetchAccount(brand, account)
    groupActions.startFetching()
    metricsActions.startGroupFetching()
    groupActions.fetchGroups(brand, account)
    metricsActions.fetchGroupMetrics({
      account: account,
      startDate: moment.utc().endOf('hour').add(1,'second').subtract(28, 'days').format('X'),
      endDate: moment.utc().endOf('hour').format('X')
    })
  }
  return {
    fetchData: fetchData,
    groupActions: groupActions,
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Groups);

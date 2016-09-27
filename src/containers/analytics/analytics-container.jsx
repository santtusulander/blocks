import React from 'react'
import Immutable from 'immutable'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import * as accountActionCreators from '../../redux/modules/account'
import * as groupActionCreators from '../../redux/modules/group'
import * as propertyActionCreators from '../../redux/modules/host'
import * as filtersActionCreators from '../../redux/modules/filters'

import AnalyticsViewControl from '../../components/analytics/analytics-view-control'
import AnalyticsTabControl  from '../../components/analytics/analytics-tab-control'
import AnalyticsFilters from '../../components/analytics/analytics-filters'

//layout
import PageContainer from '../../components/layout/page-container'
import Content from '../../components/layout/content'

import { getTabName } from '../../util/helpers.js'
import checkPermissions from '../../util/permissions'
import * as PERMISSIONS from '../../constants/permissions'
import analyticsTabConfig from '../../constants/analytics-tab-config'


import './analytics-container.scss'

class AnalyticsContainer extends React.Component {
  constructor(props){
    super(props)
    this.onFilterChange = this.onFilterChange.bind(this)
    this.fetchActiveItems = this.fetchActiveItems.bind(this)
  }

  componentWillMount(){
    //Reset filters to default when entering analytics page
    this.props.filtersActions.resetFilters();
    this.fetchData(this.props.params, true)
    this.fetchActiveItems(this.props)
  }

  componentWillReceiveProps( nextProps ) {
    const prevParams = JSON.stringify(this.props.params)
    const params = JSON.stringify(nextProps.params)

    if (params !== prevParams) {
      this.fetchActiveItems(nextProps)
      this.fetchData(nextProps.params)
    }
  }

  fetchActiveItems(props) {
    const {
      params: { brand, account, group, property },
      accountActions,
      groupActions,
      propertyActions } = props
    Promise.all([
      account && accountActions.fetchAccount(brand, account),
      group && groupActions.fetchGroup(brand, account, group),
      property && propertyActions.fetchHost(brand, account, group, property)
    ])
  }

  fetchData(params, refresh){
    const brandChanged = params.brand !== this.props.params.brand
    const accountChanged = params.account !== this.props.params.account
    const groupChanged = params.group !== this.props.params.group
    if((brandChanged || refresh) && checkPermissions(
      this.props.roles, this.props.user, PERMISSIONS.VIEW_CONTENT_ACCOUNTS)
    ) {
      this.props.accountActions.fetchAccounts(params.brand)
      this.props.filtersActions.fetchServiceProviders(params.brand)
    }

    if((brandChanged || accountChanged || refresh) && params.account) {
      this.props.groupActions.fetchGroups(params.brand, params.account)
    }

    if ((brandChanged || accountChanged || groupChanged || refresh) && params.account && params.group) {
      this.props.propertyActions.fetchHosts(params.brand, params.account, params.group)
    }
  }

  onFilterChange( filterName, filterValue){
    this.props.filtersActions.setFilterValue({
      filterName: filterName,
      filterValue: filterValue
    } )
  }

  renderFilters() {
    const {
      activeAccount,
      params,
      filterOptions,
      filters,
      location: { pathname }
    } = this.props

    if (!params.account && pathname.indexOf('contribution') < 0) {
      return null
    }

    const thisTabConfig = analyticsTabConfig.find(tab => tab.get('key') === getTabName(pathname))
    const providerType = activeAccount && activeAccount.get('provider_type')

    return (
      <AnalyticsFilters
        providerType={providerType}
        onFilterChange={this.onFilterChange}
        filters={filters}
        filterOptions={filterOptions}
        showFilters={thisTabConfig.get('filters')}
      />
    )
  }

  renderContent(children, filters) {
    const {
      params,
      location: { pathname }
    } = this.props

    let content = children && React.cloneElement(children, {
      params: params,
      filters: filters,
      location: location
    })

    if (!params.account) {
      if (pathname.indexOf('contribution') >= 0) {
        // TODO: move this logic elsewhere once API support for this feature has been integrated
        content = (
          <div className="text-center">
            <FormattedMessage id="portal.analytics.contribution.selectAccount.text" values={{br: <br/>}} />
          </div>
        )
      } else {
        content = (
          <div className="text-center">
            <FormattedMessage id="portal.analytics.selectAccount.text" values={{br: <br/>}} />
          </div>
        )
      }
    }

    return (
      <PageContainer className='analytics-container'>
        {content}
      </PageContainer>
    )
  }

  render(){
    const {
      params,
      children,
      brands,
      accounts,
      groups,
      properties,
      filters,
      activeAccount,
      activeGroup,
      location: { pathname }
    } = this.props
    return (
      <Content>
        <AnalyticsViewControl
          activeAccount={activeAccount}
          activeGroup={activeGroup}
          brands={brands}
          accounts={accounts}
          groups={groups}
          properties={properties}
          params={params}
          location={this.props.location}
          activeTab={getTabName(pathname)}
        />
        <AnalyticsTabControl
          params={params}
          location={this.props.location}
        />
        {this.renderFilters()}
        {this.renderContent(children, filters)}
      </Content>
    )
  }
}

AnalyticsContainer.propTypes = {
  accountActions: React.PropTypes.object,
  accounts: React.PropTypes.instanceOf(Immutable.List),
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  brands: React.PropTypes.instanceOf(Immutable.List),
  children: React.PropTypes.node,
  filterOptions: React.PropTypes.object,
  filters: React.PropTypes.instanceOf(Immutable.Map),
  filtersActions: React.PropTypes.object,
  groupActions: React.PropTypes.object,
  groups: React.PropTypes.instanceOf(Immutable.List),
  location: React.PropTypes.object,
  params: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(Immutable.List),
  propertyActions: React.PropTypes.object,
  roles: React.PropTypes.instanceOf(Immutable.List),
  user: React.PropTypes.instanceOf(Immutable.Map)
}

AnalyticsContainer.defaultProps = {
  accounts: Immutable.List(),
  brands: Immutable.List(),
  filters: Immutable.Map(),
  groups: Immutable.List(),
  properties: Immutable.List(),
  roles: Immutable.List(),
  user: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    brands: Immutable.fromJS([{id: 'udn', name: 'UDN'}]),
    accounts: state.account.get('allAccounts'),
    groups: state.group.get('allGroups'),
    properties: state.host.get('allHosts'),
    filters: state.filters.get('filters'),
    filterOptions: state.filters.get('filterOptions'),
    roles: state.roles.get('roles'),
    user: state.user.get('currentUser')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    //TODO: Add module for brands?
    // brandActions: bindActionCreators(brandActionCreators, dispatch)
    groupActions: bindActionCreators(groupActionCreators, dispatch),
    propertyActions: bindActionCreators(propertyActionCreators, dispatch),
    filtersActions: bindActionCreators(filtersActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsContainer)

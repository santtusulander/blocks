import React from 'react'
import Immutable from 'immutable'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import * as accountActionCreators from '../../redux/modules/account'
import * as groupActionCreators from '../../redux/modules/group'
import * as propertyActionCreators from '../../redux/modules/host'
import * as filtersActionCreators from '../../redux/modules/filters'
import { getAll as getRoles } from '../../redux/modules/entities/roles/selectors'

import AnalyticsViewControl from '../../components/analytics/analytics-view-control'
import AnalyticsTabControl  from '../../components/analytics/analytics-tab-control'
import AnalyticsFilters from '../../components/analytics/analytics-filters'
import DateRanges from '../../constants/date-ranges'

//layout
import PageContainer from '../../components/layout/page-container'
import Content from '../../components/layout/content'

import { getTabName, userIsServiceProvider, accountIsServiceProviderType } from '../../util/helpers.js'
import checkPermissions from '../../util/permissions'
import * as PERMISSIONS from '../../constants/permissions'
import analyticsTabConfig from '../../constants/analytics-tab-config'

import './analytics-container.scss'

const BODY_MIN_HEIGHT = 850

class AnalyticsContainer extends React.Component {
  constructor(props){
    super(props)
    this.onFilterChange = this.onFilterChange.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.fetchActiveItems = this.fetchActiveItems.bind(this)
  }

  componentWillMount(){
    //Reset filters to default when entering analytics page
    this.props.filtersActions.resetFilters();
    this.fetchData(this.props.params, true)
    this.fetchActiveItems(this.props)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps( nextProps ) {
    const prevParams = JSON.stringify(this.props.params)
    const params = JSON.stringify(nextProps.params)

    if (params !== prevParams) {
      this.fetchActiveItems(nextProps)
      this.fetchData(nextProps.params)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    document.body.classList.remove('sticky-filters')
  }

  handleScroll() {
    const docBody = document.body
    const pageHeaderHeight = document.querySelector('.page-header-container')
      ? document.querySelector('.page-header-container').offsetHeight
      : 0
    const analyticsTabsHeight = document.querySelector('.analytics-tabs')
      ? document.querySelector('.analytics-tabs').offsetHeight
      : 0
    const pageHeaderTotalHeight = pageHeaderHeight + analyticsTabsHeight
    const analyticsContainer = document.querySelector('.analytics-container')

    if (window.innerHeight > BODY_MIN_HEIGHT && window.pageYOffset > pageHeaderTotalHeight) {
      if(!docBody.classList.contains('sticky-filters')) {
        const analyticsFiltersHeight = document.querySelector('.analytics-filters').offsetHeight
        analyticsContainer.style.marginTop = `${analyticsFiltersHeight}px`
        docBody.classList.add('sticky-filters')
      }
    } else {
      analyticsContainer.style.marginTop = 0
      docBody.classList.remove('sticky-filters')
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

    // service providers cannot see properties, UDNP-1498
    if (!userIsServiceProvider(this.props.user) &&
        (brandChanged || accountChanged || groupChanged || refresh) && params.account && params.group)
    {
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
      user,
      location: { pathname }
    } = this.props

    if (!params.account) {
      return null
    }

    const tabConfig = analyticsTabConfig.find(tab => tab.get('key') === getTabName(pathname))
    const activeAccountProviderType = activeAccount && activeAccount.get('provider_type')
    const dateRanges = [
      DateRanges.MONTH_TO_DATE,
      DateRanges.LAST_MONTH,
      DateRanges.THIS_WEEK,
      DateRanges.LAST_WEEK
    ]
    const tabConfigFilters = tabConfig.get('filters')
    const isTrafficConfig = (tabConfig.get('key') === 'traffic')
    const isSPAccount = this.props.activeAccount && accountIsServiceProviderType(this.props.activeAccount)
    //UDNP-1859: Remove 'recordType' filter from Traffic tab for SP accounts
    const showFilters = (isTrafficConfig && isSPAccount) ? tabConfigFilters.filter(item => item !== 'recordType') : tabConfigFilters

    return (
      <AnalyticsFilters
        activeAccountProviderType={activeAccountProviderType}
        currentUser={user}
        dateRanges={dateRanges}
        onFilterChange={this.onFilterChange}
        filters={filters}
        filterOptions={filterOptions}
        showFilters={showFilters}
      />
    )
  }

  renderContent(children, filters) {
    const {
      params
    } = this.props

    let content = children && React.cloneElement(children, {
      params: params,
      filters: filters,
      location: location
    })

    if (!params.account) {
      content = (
        <div className="text-center">
          <FormattedMessage id="portal.analytics.selectAccount.text" values={{br: <br/>}} />
        </div>
      )
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
          params={params}
          location={this.props.location}
          activeTab={getTabName(pathname)}
        />
        {!params.storage && <AnalyticsTabControl
          params={params}
          location={this.props.location}
          activeTab={getTabName(pathname)}
        />}
        {this.renderFilters()}
        {this.renderContent(children, filters)}
      </Content>
    )
  }
}

AnalyticsContainer.displayName = "AnalyticsContainer"
AnalyticsContainer.propTypes = {
  accountActions: React.PropTypes.object,
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  children: React.PropTypes.node,
  filterOptions: React.PropTypes.object,
  filters: React.PropTypes.instanceOf(Immutable.Map),
  filtersActions: React.PropTypes.object,
  groupActions: React.PropTypes.object,
  location: React.PropTypes.object,
  params: React.PropTypes.object,
  propertyActions: React.PropTypes.object,
  roles: React.PropTypes.instanceOf(Immutable.List),
  user: React.PropTypes.instanceOf(Immutable.Map)
}

AnalyticsContainer.defaultProps = {
  filters: Immutable.Map(),
  roles: Immutable.List(),
  user: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    filters: state.filters.get('filters'),
    filterOptions: state.filters.get('filterOptions'),
    roles: getRoles(state),
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

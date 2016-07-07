import React from 'react'
import Immutable from 'immutable'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as accountActionCreators from '../../redux/modules/account'
import * as groupActionCreators from '../../redux/modules/group'
import * as propertyActionCreators from '../../redux/modules/host'
import * as filtersActionCreators from '../../redux/modules/filters'
import * as uiActionCreators from '../../redux/modules/ui'

import AnalyticsViewControl from '../../components/analytics/analytics-view-control.jsx'
import AnalyticsFilters from '../../components/analytics/analytics-filters.jsx'

//layout
import PageContainer from '../../components/layout/page-container'
import Content from '../../components/layout/content'
import PageHeader from '../../components/layout/page-header'

import { getTabName } from '../../util/helpers.js'
import { createCSVExporters } from '../../util/analysis-csv-export'


import './analytics-container.scss'

function getNameById( list, id ) {
  const foundItem = list.find( (item) => {
    return item.get('id').toString() === id.toString()
  })

  if (foundItem) return foundItem.get('name')

  return null
}

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
      params: { brand, account, group },
      accountActions,
      groupActions } = props
    Promise.all([
      account && accountActions.fetchAccount(brand, account),
      group && groupActions.fetchGroup(brand, account, group)
    ])
  }

  fetchData(params, refresh){
    let promises = [];
    /* TODO: could be simplified? Or maybe redux module should decide what needs to be updated? */
    if(params.brand !== this.props.params.brand || refresh) {
      promises.push( this.props.accountActions.fetchAccounts(params.brand) )
    }

    if(params.brand !== this.props.params.brand ||
      params.account !== this.props.params.account || refresh) {

      promises.push( this.props.groupActions.fetchGroups(params.brand, params.account) )
    }

    if ( params.brand !== this.props.params.brand ||
      params.account !== this.props.params.account ||
      params.group !== this.props.params.group  || refresh) {

      /*No need use promise-array to wait for properties as breadcrumbs for property is only its ID (www....)*/
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
    const params = this.props.params

    if (!params.account) {
      return null
    }

    const {
      filterOptions,
      filters,
      location: { pathname, query: { property } }
    } = this.props

    return (
      <AnalyticsFilters
        onFilterChange={this.onFilterChange}
        filters={filters}
        filterOptions={filterOptions}
        showFilters={availableFilters.get(getTabName(pathname))}
      />
    )
  }

  renderContent(children, filters) {
    const params = this.props.params,
      locations = this.props.location

    if (!params.account) {
      return (
        <div className='analytics-tab-container'>
          <p className='text-center'>Please select an account<br/>
            from top left to see analytics</p>
        </div>
      )
    }

    return (
      <div className='analytics-tab-container'>
        {
          /* Render tab -content */
          children && React.cloneElement(children, {
            params: params,
            ref: 'tab',
            filters: filters,
            location: location
          } )
        }
      </div>
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
      history,
      filterOptions,
      filters,
      activeAccount,
      activeGroup,
      location: { pathname, query: { property } }
    } = this.props

    /* TODO: should  be moved to consts ? */
    const availableFilters = Immutable.fromJS({
      'traffic': ['date-range', 'service-type'],
      'visitors': ['date-range'],
      'on-off-net': ['date-range', 'on-off-net', 'service-provider'],
      'service-providers': ['date-range', 'service-provider', 'pop', 'service-type', 'on-off-net'],
      'file-error': ['date-range', 'error-code', 'service-type'],
      'url-report': ['date-range', 'error-code', 'service-type'],
      'playback-demo': ['video']
    })
    const exportCSV = () => {
      const fileNamePart = (type, item) => params[type] ? ` - ${item.get('name')}` : ''
      const fileName = `${activeAccount.get('name')}${fileNamePart('group', activeGroup)}${property ? ` - ${property}` : ''}`
      this.refs.tab.getWrappedInstance().export(createCSVExporters(fileName))
    }
    return (
      <PageContainer className='analytics-container'>
        <Content>
          <PageHeader>
            <AnalyticsViewControl
              activeAccount={activeAccount}
              activeGroup={activeGroup}
              exportCSV={exportCSV}
              brands={brands}
              accounts={accounts}
              groups={groups}
              properties={properties}
              params={params}
              location={this.props.location}
              history={history}
              activeTab={getTabName(pathname)}
            />
          </PageHeader>
          {this.renderFilters()}
          {this.renderContent(children, filters)}
        </Content>
      </PageContainer>
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
  history: React.PropTypes.object,
  location: React.PropTypes.object,
  params: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(Immutable.List),
  propertyActions: React.PropTypes.object
}

AnalyticsContainer.defaultProps = {
  accounts: Immutable.List(),
  brands: Immutable.List(),
  filters: Immutable.Map(),
  groups: Immutable.List(),
  properties: Immutable.List()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    activeHost: state.host.get('activeHost'),
    brands: Immutable.fromJS([{id: 'udn', name: 'UDN'}]),
    accounts: state.account.get('allAccounts'),
    groups: state.group.get('allGroups'),
    properties: state.host.get('allHosts'),
    filters: state.filters.get('filters'),
    filterOptions: state.filters.get('filterOptions')
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

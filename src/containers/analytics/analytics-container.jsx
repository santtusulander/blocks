import React from 'react'
import ReactDOM from 'react-dom'
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

import {getRoute} from '../../routes.jsx'
import {getTabName, getAnalyticsUrl} from '../../util/helpers.js'
import { createCSVExporters } from '../../util/analysis-csv-export'


import './analytics-container.scss'

function getNameById( list, id ) {
  const foundItem = list.find( (item) => {
    return item.get('id').toString() === id.toString()
  })

  if (foundItem) return foundItem.get('name')

  return null
}
/* NOT USED ATM - maybe needed?
function getAnalysisType( params ){
  if (params.property) return 'property'
  if (params.group) return 'group'
  if (params.account) return 'account'
  if (params.brand) return 'brand'

  return null
}
*/

class AnalyticsContainer extends React.Component {

  constructor(props){
    super(props)
    this.dataToExport = []
    this.onFilterChange = this.onFilterChange.bind(this)
  }

  componentWillMount(){
    this.fetchData(this.props.params, true)
    const { params: { brand, account, group },
      location: { query: { property } },
      activeAccount,
      activeGroup,
      activeHost,
      accountActions,
      groupActions,
      propertyActions } = this.props
    Promise.all([
      account && !activeAccount && accountActions.fetchAccount(brand, account),
      group && !activeGroup && groupActions.fetchGroup(brand, account, group),
      property && !activeHost && propertyActions.fetchHost(brand, account, group, property)
    ])
  }

  componentWillReceiveProps( nextProps ) {
    const prevParams = JSON.stringify(this.props.params)
    const params = JSON.stringify(nextProps.params)

    if (params !== prevParams ||
      this.props.location.search !== nextProps.location.search) {
      this.fetchData( nextProps.params)
    }
  }

  setBreadcrumbs() {
    let breadCrumbLinks = []
    if (this.props.params.brand) {
      breadCrumbLinks.push({
        label: getNameById(this.props.brands, this.props.params.brand),
        url: getAnalyticsUrl('brand', this.props.params.brand, this.props.params)
      })
    }
    if (this.props.params.account) {
      breadCrumbLinks.push({
        label: getNameById(this.props.accounts, this.props.params.account),
        url: getAnalyticsUrl('account', this.props.params.account, this.props.params)
      })
    }
    if (this.props.params.group) {
      breadCrumbLinks.push({
        label: getNameById(this.props.groups, this.props.params.group),
        url: getAnalyticsUrl('group', this.props.params.group, this.props.params)
      })
    }
    if (this.props.location.query.property) {
      breadCrumbLinks.push({
        label: this.props.location.query.property,
        url: getAnalyticsUrl('property', this.props.location.query.property, this.props.params)
      })
    }

    this.props.uiActions.setBreadcrumbs( breadCrumbLinks )
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

    //Set breadcrumbs when finished (breadcrumbs need brand/account/group names)
    Promise.all(promises).then(() => {
      this.setBreadcrumbs()
    });
  }

  onFilterChange( filterName, filterValue){
    this.props.filtersActions.setFilterValue({
      filterName: filterName,
      filterValue: filterValue
    } )
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
      'on-off-net': ['date-range', 'on-off-net'],
      'service-providers': ['date-range', 'service-provider', 'pop', 'service-type', 'on-off-net'],
      'file-error': ['date-range', 'error-code'],
      'url-report': ['date-range', 'error-code'],
      'playback-demo': ['video']
    })
    const setDataToExport = (...data) => this.dataToExport = data
    const exportCSV = () => {
      const fileNamePart = (type, item) => params[type] ? ` - ${item.get('name')}` : ''
      const fileName = `${activeAccount.get('name')}${fileNamePart('group', activeGroup)}${property ? ` - ${property}` : ''}`
      switch(getTabName(pathname)) {
        case 'traffic': createCSVExporters(fileName).traffic(...this.dataToExport)
        case 'visitors': createCSVExporters(fileName).visitors(...this.dataToExport)
      }
    }
    return (
      <PageContainer className='analytics-container'>
        <Content>
          <PageHeader>
            <p>ANALYTICS</p>

            <AnalyticsViewControl
              exportCSV={exportCSV}
              brands={brands}
              accounts={accounts}
              groups={groups}
              properties={properties}
              params={params}
              location={this.props.location}
              history={history}
            />

          </PageHeader>

          <AnalyticsFilters
            onFilterChange={this.onFilterChange}
            filters={filters}
            filterOptions={filterOptions}
            showFilters={availableFilters.get(getTabName(pathname))}
          />

          <div className='analytics-tab-container'>

          {
            /* Render tab -content */
            children && React.cloneElement(children, {
              params: params,
              setDataToExport: setDataToExport,
              filters: filters,
              location: this.props.location
            } )
          }

          </div>
        </Content>
      </PageContainer>
    )
  }
}

AnalyticsContainer.propTypes = {
  accounts: React.PropTypes.instanceOf(Immutable.List),
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  brands: React.PropTypes.instanceOf(Immutable.List),
  filters: React.PropTypes.instanceOf(Immutable.Map),
  groups: React.PropTypes.instanceOf(Immutable.List),
  location: React.PropTypes.object,
  params: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(Immutable.List)
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

    filtersActions: bindActionCreators(filtersActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(AnalyticsContainer)

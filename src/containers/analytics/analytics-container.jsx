import React from 'react'
import Immutable from 'immutable'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as accountActionCreators from '../../redux/modules/account'
import * as groupActionCreators from '../../redux/modules/group'
import * as propertyActionCreators from '../../redux/modules/host'
import * as filtersActionCreators from '../../redux/modules/filters'

import AnalyticsViewControl from '../../components/analytics/analytics-view-control.jsx'
import AnalyticsFilters from '../../components/analytics/analytics-filters.jsx'

import { Breadcrumbs } from '../../components/breadcrumbs.jsx'

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
  }

  componentDidMount(){
    this.props.params.brand && this.props.accountActions.fetchAccounts(this.props.params.brand)
    this.props.params.account && this.props.groupActions.fetchGroups(this.props.params.brand, this.props.params.account)
    this.props.params.group && this.props.propertyActions.fetchHosts(this.props.params.brand, this.props.params.account, this.props.params.group)

    //this.fetchData({})
  }

  componentWillReceiveProps( nextProps ) {
    const params = JSON.stringify(this.props.params)
    const prevParams = JSON.stringify(nextProps.params)


    this.fetchData( nextProps.params)
  }

  fetchData(params){
    /* TODO: could be simplified? Or maybe redux module should decide what needs to be updated? */
    if(params.brand !== this.props.params.brand) {
      this.props.accountActions.fetchAccounts(params.brand)
    }

    if(params.brand !== this.props.params.brand ||
      params.account !== this.props.params.account ) {

      this.props.groupActions.fetchGroups(params.brand, params.account)
    }

    if ( params.brand !== this.props.params.brand ||
      params.account !== this.props.params.account ||
      params.group !== this.props.params.group  ) {

      this.props.propertyActions.fetchHosts(params.brand, params.account, params.group)
    }
  }

  onFilterChange( filterName, filterValue){
    console.log('AnalyticsContainer - onFilterChange()', filterName, filterValue)
    this.props.filtersActions.setFilterValue({filterName: filterName, filterValue: filterValue} )
  }

  render(){
    { /* TODO: Breadcrumbs should be put to UI - module in redux */ }
    let breadCrumbLinks = []

    if (this.props.params.brand) breadCrumbLinks.push({label: getNameById(this.props.brands, this.props.params.brand), url: `/v2-analytics/${this.props.params.brand}`})
    if (this.props.params.account) breadCrumbLinks.push({label: getNameById(this.props.accounts, this.props.params.account), url: `/v2-analytics/${this.props.params.brand}/${this.props.params.account}`})
    if (this.props.params.group) breadCrumbLinks.push({label: getNameById(this.props.groups, this.props.params.group), url: `/v2-analytics/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}`})
    if (this.props.params.property) breadCrumbLinks.push({label: this.props.params.property, url: ''})

    const availableFilters = {
      'traffic': ['date-range', 'service-type'],
      'visitors': ['date-range'],
      'on-off-net': ['date-range', 'on-off-net'],
      'service-providers': ['date-range', 'service-provider', 'service-type', 'on-off-net']

    }

    return (
      <div className='analytics-container'>
        <Breadcrumbs links={breadCrumbLinks} />

        <AnalyticsViewControl {...this.props} />

        <AnalyticsFilters
          onFilterChange={ this.onFilterChange }
          filters={this.props.filters}
        />

        <div className='analytics-tab-container'>

        {
          /* Render tab -content */
          this.props.children && React.cloneElement(this.props.children, {filters: this.props.filters} )
        }

        </div>

      </div>
    )
  }
}

AnalyticsContainer.propTypes = {
  brands: React.PropTypes.instanceOf(Immutable.List),
  accounts: React.PropTypes.instanceOf(Immutable.List),
  groups: React.PropTypes.instanceOf(Immutable.List),
  properties: React.PropTypes.instanceOf(Immutable.List),
  filters: React.PropTypes.instanceOf(Immutable.Map)
}

function mapStateToProps(state) {
  return {
    brands: Immutable.fromJS([{id: 'udn', name: 'UDN'}]),
    accounts: state.account.get('allAccounts'),
    groups: state.group.get('allGroups'),
    properties: state.host.get('allHosts'),
    filters: state.filters.get('filters')
  }
}

function mapDispatchToProps(dispatch, ownProps) {
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

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
    this.props.accountActions.fetchAccounts(this.props.params.brand)
    this.props.groupActions.fetchGroups(this.props.params.brand, this.props.params.account)
    this.props.propertyActions.fetchHosts(this.props.params.brand, this.props.params.account, this.props.params.group)
  }

  componentWillReceiveProps( nextProps ) {
    this.fetchData(nextProps)
  }

  fetchData(nextProps){
    /* TODO: could be simplified? Or maybe redux module should decide what needs to be updated? */
    if(nextProps.params.brand !== this.props.params.brand) {
      this.props.accountActions.fetchAccounts(nextProps.params.brand)
    }

    if(nextProps.params.brand !== this.props.params.brand ||
      nextProps.params.account !== this.props.params.account ) {

      this.props.groupActions.fetchGroups(nextProps.params.brand, nextProps.params.account)
    }

    if ( nextProps.params.brand !== this.props.params.brand ||
      nextProps.params.account !== this.props.params.account ||
      nextProps.params.group !== this.props.params.group  ) {

      this.props.propertyActions.fetchHosts(nextProps.params.brand, nextProps.params.account, nextProps.params.group)
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

    return (
      <div>
        <Breadcrumbs links={breadCrumbLinks} />

        <AnalyticsViewControl {...this.props} />

        <AnalyticsFilters
          onFilterChange={ this.onFilterChange }
          filters={this.props.filters}
        />

        {
          /* Render tab -content */
          React.cloneElement(this.props.children, {filters: this.props.filters} )
        }

      </div>
    )
  }
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

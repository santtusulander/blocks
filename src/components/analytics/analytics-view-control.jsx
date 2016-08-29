import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { withRouter } from 'react-router'
import { ButtonToolbar } from 'react-bootstrap'

import * as PERMISSIONS from '../../constants/permissions'

//import HeadingDropdown from '../heading-dropdown/heading-dropdown.jsx'
import AccountSelector from '../global-account-selector/global-account-selector.jsx'
import { getTabName, getAnalyticsUrl, getContentUrl } from '../../util/helpers.js'
import TruncatedTitle from '../truncated-title'
import AnalyticsExport from '../../containers/analytics/export.jsx'

const tabs = [
  { key: 'traffic', label: 'Traffic Overview', permission: PERMISSIONS.VIEW_ANALYTICS_TRAFFIC_OVERVIEW },
  { key: 'cache-hit-rate', label: 'Cache Hit Rate', permission: PERMISSIONS.VIEW_ANALYTICS_TRAFFIC_OVERVIEW },
  { key: 'visitors', label: 'Unique Visitors', permission: PERMISSIONS.VIEW_ANALYTICS_UNIQUE_VISITORS },
  { key: 'on-off-net', label: 'SP On/Off Net', hideHierarchy: true, permission: PERMISSIONS.VIEW_ANALYTICS_SP_ON_OFF_NET},
  { key: 'service-providers', label: 'SP Contribution', hideHierarchy: true, permission: PERMISSIONS.VIEW_ANALYTICS_SP_CONTRIBUTION },
  { key: 'file-error', label: 'File Error', propertyOnly: true, permission: PERMISSIONS.VIEW_ANALYTICS_FILE_ERROR },
  { key: 'url-report', label: 'URL', propertyOnly: true, permission: PERMISSIONS.VIEW_ANALYTICS_URL },
  { key: 'playback-demo', label: 'Playback demo', hideHierarchy: true }
]

/* Not USED atm - will be used when filter dropdown is implemented
 function createDropdownOptions ( opts ) {
 return opts.map(opt => {
 return {
 link: opt.get('id').toString(),
 label: opt.get('name')
 }
 })
 }

 function createPropertyDropdownOptions ( opts ){
 return opts.map( opt => {
 return {
 link: opt,
 label: opt
 }
 })
 }
 */
const AnalyticsViewControl = (props) => {

  const {
    account,
    group,
    property
  } = props.params
  /*
   const brandOptions = createOptions( props.brands )
   const groupDropdownOptions = createDropdownOptions( props.groups )
   const propertyDropdownOptions = createPropertyDropdownOptions( props.properties )
   */
  let title = "Analytics"
  let active
  if(props.activeTab) {
    active = tabs.find(tab => tab.key === props.activeTab)
    if(active) {
      if(active.hideHierarchy) {
        title = active.label
      }
      else if(property) {
        title = `Property ${active.label}`
      }
      else if(group) {
        title = `Group ${active.label}`
      }
      else {
        title = `Account ${active.label}`
      }
    }
  }

  let activeItem;
  if (property) {
    activeItem = property
  }
  else if(group && props.activeGroup) {
    activeItem = props.activeGroup.get('name')
  }
  else if(account && props.activeAccount) {
    activeItem = props.activeAccount.get('name')
  }
  const isContentAnalytics = props.router.isActive('/content')
  const topBarTexts = {
    property: 'Back to Groups',
    group: 'Back to Accounts',
    account: 'UDN Admin',
    brand: 'UDN Admin'
  }
  if(property && isContentAnalytics) {
    delete topBarTexts.property
  }
  const topBarFunc = (tier, fetchItems, IDs) => {
    const { account, brand } = IDs
    switch(tier) {
      case 'property':
        fetchItems('group', brand, account)
        break
      case 'group':
        fetchItems('account', brand)
        break
      case 'brand':
      case 'account':
        props.router.push(getAnalyticsUrl('brand', 'udn', {}))
        break
    }
  }

  return (
    <div>
      <h5>{title}</h5>
      <div className="content-layout__header">
        <AccountSelector
          as="analytics"
          params={props.params}
          topBarTexts={topBarTexts}
          topBarAction={topBarFunc}
          onSelect={(...params) => {
            let url = isContentAnalytics ?
              `${getContentUrl(...params)}/analytics` :
              getAnalyticsUrl(...params)
            if(active && !isContentAnalytics) {
              let tab = active.key
              if(active.propertyOnly && params[0] !== 'property') {
                tab = ''
              }
              url = `${url}/${tab}`
            }
            props.router.push(url)
          }}>
          <div className="btn btn-link dropdown-toggle header-toggle">
            <h1><TruncatedTitle content={activeItem || "select account"} tooltipPlacement="bottom" className="account-management-title"/></h1>
            <span className="caret"></span>
          </div>
        </AccountSelector>
        {props.params.account &&
          <ButtonToolbar>
            <AnalyticsExport
              activeTab={getTabName(props.location.pathname)}
              params={props.params}
              />
          </ButtonToolbar>
        }
      </div>
    </div>
  )
}

AnalyticsViewControl.propTypes = {
  accounts: PropTypes.instanceOf(Immutable.List),
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  activeTab: PropTypes.string,
  brands: PropTypes.instanceOf(Immutable.List),
  groups: PropTypes.instanceOf(Immutable.List),
  location: PropTypes.object,
  params: PropTypes.object,
  properties: PropTypes.instanceOf(Immutable.List),
  router: React.PropTypes.object
}

AnalyticsViewControl.defaultProps = {
  accounts: Immutable.List(),
  activeAccount: Immutable.Map(),
  activeGroup: Immutable.Map(),
  activeHost: Immutable.Map(),
  brands: Immutable.List(),
  groups: Immutable.List(),
  properties: Immutable.List(),
  params: {}
}

export default withRouter(AnalyticsViewControl)

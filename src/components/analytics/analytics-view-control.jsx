import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { Link, withRouter } from 'react-router'
import { Nav, ButtonToolbar, Button, Dropdown } from 'react-bootstrap'
import * as PERMISSIONS from '../../constants/permissions'
import IsAllowed from '../is-allowed'

//import HeadingDropdown from '../heading-dropdown/heading-dropdown.jsx'
import AccountSelector from '../global-account-selector/global-account-selector.jsx'
import { getTabLink, getTabName, getAnalyticsUrl, getContentUrl } from '../../util/helpers.js'
import IconExport from '../icons/icon-export.jsx'



import './analytics-view-control.scss'

const tabs = [
  { key: 'traffic', label: 'Traffic Overview', permission: PERMISSIONS.VIEW_ANALYTICS_TRAFFIC_OVERVIEW },
  { key: 'visitors', label: 'Unique Visitors', permission: PERMISSIONS.VIEW_ANALYTICS_UNIQUE_VISITORS },
  { key: 'on-off-net', label: 'Service Provider On/Off Net', hideHierarchy: true, permission: PERMISSIONS.VIEW_ANALYTICS_SP_ON_OFF_NET},
  { key: 'service-providers', label: 'Service Provider Contribution', hideHierarchy: true, permission: PERMISSIONS.VIEW_ANALYTICS_SP_CONTRIBUTION },
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
    <div className="analytics-view-control">
      <h5 className="analytics-view-control__title">{title}</h5>
      <div className="analytics-view-control__header">
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
          <Dropdown.Toggle bsStyle="link" className="header-toggle">
            <h1>{activeItem || "select account"}</h1>
          </Dropdown.Toggle>
        </AccountSelector>
        {props.params.account &&
          <ButtonToolbar>
            <Button
              bsStyle="primary"
              className="has-icon"
              disabled={getTabName(props.location.pathname) === 'playback-demo'}
              onClick={props.exportCSV}>
              <IconExport />
              Export
            </Button>
          </ButtonToolbar>
        }
      </div>

      {props.params.account &&
      <Nav bsStyle="tabs">
        {tabs.reduce((lis, tab) => {
          if(!tab.propertyOnly || props.params.property) {
            const tabContent = tab.permission ?
              <IsAllowed to={tab.permission}>
                <li key={tab.key}>
                  <Link to={getTabLink(props.location, tab.key)}
                  activeClassName='active'>{tab.label}</Link>
                </li>
              </IsAllowed>
            :
              <li key={tab.key}>
                <Link to={getTabLink(props.location, tab.key)}
                activeClassName='active'>{tab.label}</Link>
              </li>

            lis.push( tabContent )
          }
          return lis
        }, [])}
      </Nav>
      }
    </div>
  )
}

AnalyticsViewControl.propTypes = {
  accounts: PropTypes.instanceOf(Immutable.List),
  activeTab: PropTypes.string,
  brands: PropTypes.instanceOf(Immutable.List),
  exportCSV: PropTypes.func,
  groups: PropTypes.instanceOf(Immutable.List),
  location: PropTypes.object,
  params: PropTypes.object,
  properties: PropTypes.instanceOf(Immutable.List),
  router: React.PropTypes.object
}

AnalyticsViewControl.defaultProps = {
  accounts: Immutable.List(),
  brands: Immutable.List(),
  groups: Immutable.List(),
  properties: Immutable.List(),
  params: {}
}

export default withRouter(AnalyticsViewControl)

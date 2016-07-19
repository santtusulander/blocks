import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { Link } from 'react-router'
import { Nav, ButtonToolbar, Button, Dropdown } from 'react-bootstrap'

//import HeadingDropdown from '../heading-dropdown/heading-dropdown.jsx'
import AccountSelector from '../global-account-selector/global-account-selector.jsx'
import { getTabLink, getTabName, getAnalyticsUrl, getContentUrl } from '../../util/helpers.js'

import './analytics-view-control.scss'

const tabs = [
  { key: 'traffic', label: 'Traffic Overview' },
  { key: 'visitors', label: 'Unique Visitors' },
  { key: 'on-off-net', label: 'Service Provider On/Off net', hideHierarchy: true },
  { key: 'service-providers', label: 'Service Provider Contribution', hideHierarchy: true },
  { key: 'file-error', label: 'File Error', propertyOnly: true },
  { key: 'url-report', label: 'URL', propertyOnly: true },
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
  const isContentAnalytics = props.history.isActive('/content')
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
        props.history.pushState(null, getAnalyticsUrl('brand', 'udn', {}))
        break
    }
  }
  return (
    <div className="analytics-view-control">
      <p className="analytics-view-control__title">{title}</p>
      <div className="analytics-view-control__header">
        <AccountSelector
          params={props.params}
          topBarTexts={topBarTexts}
          topBarAction={topBarFunc}
          user={props.user}
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
            props.history.pushState(null, url)
          }}>
          <Dropdown.Toggle bsStyle="link" className="header-toggle">
              <h1>{activeItem || "select account"}</h1>
          </Dropdown.Toggle>
        </AccountSelector>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={getTabName(props.location.pathname) === 'playback-demo'}
            onClick={props.exportCSV}>
            Export
          </Button>
        </ButtonToolbar>
      </div>

      {props.params.account &&
      <Nav bsStyle="tabs">
        {tabs.reduce((lis, tab) => {
          if(!tab.propertyOnly || props.params.property) {
            lis.push(
              <li key={tab.key}>
                <Link to={getTabLink(props.location, tab.key)}
                      activeClassName='active'>{tab.label}</Link>
              </li>
            )
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
  history: PropTypes.object,
  location: PropTypes.object,
  params: PropTypes.object,
  properties: PropTypes.instanceOf(Immutable.List),
  user: PropTypes.instanceOf(Immutable.Map)
}

AnalyticsViewControl.defaultProps = {
  accounts: Immutable.List(),
  brands: Immutable.List(),
  groups: Immutable.List(),
  properties: Immutable.List(),
  params: {},
  user: Immutable.Map()
}

export default AnalyticsViewControl

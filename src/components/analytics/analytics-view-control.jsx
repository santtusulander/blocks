import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { Link } from 'react-router'
import { Nav, ButtonToolbar, Button } from 'react-bootstrap'

import HeadingDropdown from '../heading-dropdown/heading-dropdown.jsx'

import { getTabLink, getTabName, getAnalyticsUrl } from '../../util/helpers.js'

import './analytics-view-control.scss'

function createOptions(opts) {
  return opts.map(opt => {
    return [opt.get('id').toString(), opt.get('name')]
  })
}

function createPropertyOptions(opts) {
  return opts.map(opt => {
    return [opt, opt]
  })
}

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

  const accountOptions  = createOptions(props.accounts)
  const groupOptions    = createOptions(props.groups)
  const propertyOptions = createPropertyOptions(props.properties)

  /*
   const brandOptions = createOptions( props.brands )
   const groupDropdownOptions = createDropdownOptions( props.groups )
   const propertyDropdownOptions = createPropertyDropdownOptions( props.properties )
   */

  let title = "Analytics"
  if(props.activeTab) {
    const active = tabs.find(tab => tab.key === props.activeTab)
    if(active) {
      if(active.hideHierarchy) {
        title = active.label
      }
      else if(props.params.property) {
        title = `Property ${active.label}`
      }
      else if(props.params.group) {
        title = `Group ${active.label}`
      }
      else {
        title = `Account ${active.label}`
      }
    }
  }

  return (
    <div className='analytics-view-control'>

      <p>{title}</p>

      { /* If account is not selected (Needs to be: UDN ADMIN) */
        !props.params.account &&
        <HeadingDropdown
          className="heading-dropdown"
          options={accountOptions}
          onSelect={val => {
            props.history.pushState(null, getAnalyticsUrl('account', val, props.params))
          }}
          value={props.params.group}
          type={'Account'}
        />
      }

      {groupOptions.count() > 0 &&
      <HeadingDropdown
        options={groupOptions}
        onSelect={val => {
          props.history.pushState(null, getAnalyticsUrl('group', val, props.params))
        }}
        value={props.params.group}
        defaultLabel={props.activeAccount.get('name')}
        type={'Group'}
      />
      }

      {propertyOptions.count() > 0 &&
      <HeadingDropdown
        options={propertyOptions}
        onSelect={val => {
          props.history.pushState(null, getAnalyticsUrl('property', val, props.params))
        }}
        value={props.params.property}
        type={'Property'}
      />
      }

      <ButtonToolbar className="pull-right">
        <Button
          bsStyle="primary"
          disabled={getTabName(props.location.pathname) === 'playback-demo'}
          onClick={props.exportCSV}>
          Export
        </Button>
      </ButtonToolbar>

      { /* TODO: Implement filtered dropdown, when possible (component fixed)
       <FilterDropdown
       options={ groupDropdownOptions }
       handleSelect={ (val) => {
       props.history.pushState(null, getAnalyticsUrl('group', val, props.params) )
       } }
       />

       <FilterDropdown
       options={ propertyDropdownOptions }
       handleSelect={ (val) => {
       props.history.pushState(null, getAnalyticsUrl('property', val, props.params) )
       } }
       />
       */ }

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
  properties: PropTypes.instanceOf(Immutable.List)
}

AnalyticsViewControl.defaultProps = {
  accounts: Immutable.List(),
  brands: Immutable.List(),
  groups: Immutable.List(),
  properties: Immutable.List(),
  params: {}
}

export default AnalyticsViewControl

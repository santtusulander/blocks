import React, {Component} from 'react'
import Immutable from 'immutable'
import {Link, browserHistory} from 'react-router'
import { Nav, NavItem, Dropdown, ButtonToolbar, Button } from 'react-bootstrap'

import Select from '../select.jsx'
import FilterDropdown from '../analysis/filters/filter-dropdown/filter-dropdown.jsx'

import { getRoute } from '../../routes.jsx'
import { getTabLink, getAnalyticsUrl } from '../../util/helpers.js'

import './analytics-view-control.scss'

function createOptions( opts ){
  return opts.map( opt => {
    return [ opt.get('id').toString(), opt.get('name')]
  })
}

function createPropertyOptions( opts ){
  return opts.map( opt => {
    return [ opt, opt]
  })
}

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
  /*
  const brandOptions = createOptions( props.brands )
   */

  const accountOptions = createOptions( props.accounts )
  const groupOptions = createOptions( props.groups )
  const propertyOptions = createPropertyOptions( props.properties )

  /*const groupDropdownOptions = createDropdownOptions( props.groups )
  const propertyDropdownOptions = createPropertyDropdownOptions( props.properties )
  */

  return (
    <div className='analytics-view-control'>

    { /* If account is not selected (Needs to be: UDN ADMIN) */
      !props.params.account &&
      <Select
        options={ accountOptions }
        onSelect={ (val) => {
          props.history.pushState(null, getAnalyticsUrl('account', val, props.params))
        } }
        value={ props.params.group }
      />
      }

    {groupOptions.count() > 0 &&
      <Select
        options={ groupOptions }
        onSelect={ (val) => {
          props.history.pushState(null, getAnalyticsUrl('group', val, props.params))
        } }
        value={ props.params.group }
      />
      }
      {propertyOptions.count() > 0 &&
        <Select
          options={ propertyOptions }
          onSelect={ (val) => {
            props.history.pushState(null, getAnalyticsUrl('property', val, props.params))
          } }
          value={ props.params.property }
        />
      }

      <ButtonToolbar className="pull-right">
        <Button bsStyle="primary" >Export</Button>
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


      <Nav bsStyle="tabs" >
        <li>
          <Link to={ getTabLink(props.location.pathname, 'traffic') } activeClassName='active'>Traffic</Link>
        </li>
        <li>
          <Link to={ getTabLink(props.location.pathname, 'visitors') } activeClassName='active'>Visitors</Link>
        </li>
        <li>
          <Link to={ getTabLink(props.location.pathname, 'on-off-net') } activeClassName='active'>On/Off net</Link>
        </li>
        <li>
          <Link to={ getTabLink(props.location.pathname, 'service-providers') } activeClassName='active'>Service Providers</Link>
        </li>
        <li>
          <Link to={ getTabLink(props.location.pathname, 'file-error') } activeClassName='active'>File Error</Link>
        </li>
        <li>
          <Link to={ getTabLink(props.location.pathname, 'url-report') } activeClassName='active'>Url Report</Link>
        </li>
        <li>
          <Link to={ getTabLink(props.location.pathname, 'playback-demo') } activeClassName='active'>Playback demo</Link>
        </li>
      </Nav>
    </div>
  )
}

AnalyticsViewControl.defaultProps = {
  brands: Immutable.List(),
  accounts: Immutable.List(),
  groups: Immutable.List(),
  properties: Immutable.List(),
  params: {}
}

AnalyticsViewControl.propTypes = {
  brands: React.PropTypes.instanceOf(Immutable.List),
  accounts: React.PropTypes.instanceOf(Immutable.List),
  groups: React.PropTypes.instanceOf(Immutable.List),
  properties: React.PropTypes.instanceOf(Immutable.List),
  location: React.PropTypes.object,
  history: React.PropTypes.object,
  params: React.PropTypes.object
}

export default AnalyticsViewControl

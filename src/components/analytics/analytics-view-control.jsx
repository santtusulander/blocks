import React from 'react'
import Immutable from 'immutable'
import {Link} from 'react-router'
import { Nav, ButtonToolbar, Button } from 'react-bootstrap'

import Select from '../select.jsx'

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
        options={accountOptions}
        onSelect={val => {
          props.history.pushState(null, getAnalyticsUrl('account', val, props.params))
        }}
        value={props.params.group}
      />
      }

    {groupOptions.count() > 0 &&
      <Select
        options={groupOptions}
        onSelect={val => {
          props.history.pushState(null, getAnalyticsUrl('group', val, props.params))
        } }
        value={props.params.group}
      />
      }
      {propertyOptions.count() > 0 &&
        <Select
          options={propertyOptions}
          onSelect={val => {
            props.history.pushState(null, getAnalyticsUrl('property', val, props.params))
          }}
          value={props.location.query.property}
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
          <Link to={getTabLink(props.location, 'traffic')}
            activeClassName='active'>Traffic</Link>
        </li>
        <li>
          <Link to={getTabLink(props.location, 'visitors')}
            activeClassName='active'>Visitors</Link>
        </li>
        <li>
          <Link to={getTabLink(props.location, 'on-off-net')}
            activeClassName='active'>On/Off net</Link>
        </li>
        <li>
          <Link to={getTabLink(props.location, 'service-providers')}
            activeClassName='active'>Service Providers</Link>
        </li>
        <li>
          <Link to={getTabLink(props.location, 'file-error')}
            activeClassName='active'>File Error</Link>
        </li>
        <li>
          <Link to={getTabLink(props.location, 'url-report')}
            activeClassName='active'>Url Report</Link>
        </li>
        <li>
          <Link to={getTabLink(props.location, 'playback-demo')}
            activeClassName='active'>Playback demo</Link>
        </li>
      </Nav>
    </div>
  )
}

AnalyticsViewControl.propTypes = {
  accounts: React.PropTypes.instanceOf(Immutable.List),
  brands: React.PropTypes.instanceOf(Immutable.List),
  groups: React.PropTypes.instanceOf(Immutable.List),
  history: React.PropTypes.object,
  location: React.PropTypes.object,
  params: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(Immutable.List)
}

AnalyticsViewControl.defaultProps = {
  accounts: Immutable.List(),
  brands: Immutable.List(),
  groups: Immutable.List(),
  properties: Immutable.List(),
  params: {}
}

export default AnalyticsViewControl

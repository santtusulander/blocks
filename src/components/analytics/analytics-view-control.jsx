import React, {Component} from 'react'
import Immutable from 'immutable'
import {Link, browserHistory} from 'react-router'
import { Nav, NavItem, Dropdown, ButtonToolbar, Button } from 'react-bootstrap'

import Select from '../select.jsx'
import FilterDropdown from '../analysis/filters/filter-dropdown/filter-dropdown.jsx'

import { getRoute } from '../../routes.jsx'
import {getTabLink} from '../../util/helpers.js'

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

function getAnalyticsUrl( linkType, val, params ){

  let url

  const {brand,account,group,property} = params;

  switch ( linkType ) {
    case 'brand':
      url = `${getRoute('analytics')}/${val}`
      break;

    case 'account':
      url = `${getRoute('analytics')}/${brand}/${val}`
      break;
    case 'group':
      url = `${getRoute('analytics')}/${brand}/${account}/${val}`
      break;
    case 'property':
      url = `${getRoute('analytics')}/${brand}/${account}/${group}/${val}`
      break;
  }

  return url
}

const AnalyticsViewControl = (props) => {
  /*const brandOptions = createOptions( props.brands )
  const accountOptions = createOptions( props.accounts )
  */
  const groupOptions = createOptions( props.groups )
  const propertyOptions = createPropertyOptions( props.properties )


  const groupDropdownOptions = createDropdownOptions( props.groups )
  const propertyDropdownOptions = createPropertyDropdownOptions( props.properties )

  return (
    <div className='analytics-view-control'>

    {/*
      <Select
        options={ brandOptions }
        onSelect={ (val) => {
          props.history.pushState(null, getAnalyticsUrl('brand', val, props.params))
        } }
        value={ props.params.brand }
        label={'Choose Brand'}
      />

      <Select
        options={ accountOptions }
        onSelect={ (val) => {
          props.history.pushState(null, getAnalyticsUrl('account', val, props.params) )
        } }
        value={ props.params.account }
      />
     */}

       <Select
         options={ groupOptions }
         onSelect={ (val) => {
           props.history.pushState(null, getAnalyticsUrl('group', val, props.params) )
           } }
         value={ props.params.group }
       />

         <Select
         options={ propertyOptions }
         onSelect={ (val) => {
           props.history.pushState(null, getAnalyticsUrl('property', val, props.params) )
           } }
         value={ props.params.property }
       />

      <ButtonToolbar className="pull-right">
        <Button bsStyle="primary" >Export</Button>
      </ButtonToolbar>
    { /*
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

/*AnalyticsViewControl.propTypes = {
  accounts: Immutable.List(),
  brands: Immutable.List(),
  groups: Immutable.List(),
  properties: Immutable.List()
}*/

export default AnalyticsViewControl

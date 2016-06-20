import React, {Component} from 'react'
import Immutable from 'immutable'
import {Link, browserHistory} from 'react-router'
import { Nav, NavItem, Dropdown } from 'react-bootstrap'

import Select from '../select.jsx'

import { getRoute } from '../../routes.jsx'

/* REFACTOR: this is a quick fix to get tab links from current path
    - takes the last link part out and replaces it with tabName
 */
function getTabLink( path, tabName){
  let linkArr = path.split('/')

  linkArr.pop()
  linkArr.push(tabName)
  return linkArr.join('/')

}

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
  const brandOptions = createOptions( props.brands )
  const accountOptions = createOptions( props.accounts )
  const groupOptions = createOptions( props.groups )
  const propertyOptions = createPropertyOptions( props.properties )

  return (
    <div className='view-control'>

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


      <Nav bsStyle="tabs" >
        <li>
          <Link to={ getTabLink(props.location.pathname, 'traffic') } activeClassName='active'>Traffic</Link>
        </li>
        <li>
          <Link to={ getTabLink(props.location.pathname, 'visitors') } activeClassName='active'>Visitors</Link>
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
contextTypes: {
  router: React.PropTypes.object.isRequired
}

export default AnalyticsViewControl

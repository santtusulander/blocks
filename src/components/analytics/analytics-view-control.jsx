import React from 'react'
import Immutable from 'immutable'
import {Link} from 'react-router'
import { Nav, NavItem } from 'react-bootstrap'

/* REFACTOR: this is a quick fix to get tab links from current path
    - takes the last link part out and replaces it with tabName
 */
function getTabLink( path, tabName){
  let linkArr = path.split('/')

  linkArr.pop()
  linkArr.push(tabName)
  return linkArr.join('/')

}

const AnalyticsViewControl = (props) => {
  return (
    <div className='view-control'>
      <h4>Choose brand</h4>
      {
        props.brands.map(brand => {
          return (
            <p>
              <Link to={`/v2-analytics/${brand.get('id')}`}>
                {brand.get('name')}
              </Link>
            </p>
          )
        })
      }

      <h4>Choose account</h4>
      {
        props.accounts.map(account => {
          return (
            <p>
              <Link to={`/v2-analytics/${props.params.brand}/${account.get('id')}`}>
                {account.get('name')}
              </Link>
            </p>
          )
        })
      }


      <h4>Choose group</h4>
      {
        props.groups.map( group => {
          return (
            <p>
              <Link to={`/v2-analytics/${props.params.brand}/${props.params.account}/${group.get('id')}`}>
              {group.get('name')}
              </Link>
            </p>
          )
        })
      }

      <h4>Choose Property</h4>
      {
        props.properties.map( property => {
          return (
            <p>
              <Link to={`/v2-analytics/${props.params.brand}/${props.params.account}/${props.params.group}/${property}`}>
                {property}
              </Link>
            </p>
          )
        })
      }

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

export default AnalyticsViewControl

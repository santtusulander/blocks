import React from 'react'
import { Link, withRouter } from 'react-router'
import Immutable from 'immutable'

import { getRoute } from '../../routes.jsx'
import {
  getAccountManagementUrlFromParams,
  getAnalyticsUrlFromParams,
  getContentUrlFromParams,
  getDashboardUrlFromParams,
  getNetworkUrlFromParams,
  getServicesUrlFromParams,
  getSupportUrlFromParams,
  getSecurityUrlFromParams
} from '../../util/routes.js'
import IsAllowed from '../is-allowed'


import {
  VIEW_ACCOUNT_SECTION,
  VIEW_ANALYTICS_SECTION,
  VIEW_CONTENT_SECTION,
  VIEW_SECURITY_SECTION,
  VIEW_SERVICES_SECTION,
  VIEW_SUPPORT_SECTION
} from '../../constants/permissions'

import { userIsServiceProvider } from '../../util/helpers.js'

import IconAccount from '../icons/icon-account.jsx'
import IconAnalytics from '../icons/icon-analytics.jsx'
import IconContent from '../icons/icon-content.jsx'
import IconDashboard from '../icons/icon-dashboard.jsx'
import IconServices from '../icons/icon-services.jsx'
import IconSecurity from '../icons/icon-security.jsx'
import IconSupport from '../icons/icon-support.jsx'

import './navigation.scss'

import axios from 'axios'

import { FormattedMessage } from 'react-intl'

//TODO:removet
//this is FOR TESTING token expiration
const expireToken = () => {
  axios.defaults.headers.common['X-Auth-Token'] = 'aaa';
  localStorage.setItem('EricssonUDNUserToken', 'aaa')
  console.log("Token set to: 'aaa' in axios to simulate expiration")
}

const removeToken = () => {
  localStorage.removeItem('EricssonUDNUserToken')
  delete axios.defaults.headers.common['X-Auth-Token']
  console.log("Removed token.")
}


const Navigation = (props) => {
  const params = props.params,
    router = props.router

  const contentActive = router.isActive(getRoute('content')) ? ' active' : '',
    networkActive = router.isActive(getRoute('network')) ? ' active' : '',
    analyticsActive = router.isActive(getRoute('analytics')) ? ' active' : ''

  const contentOrNetworkUrlBuilder = (params, currentUser, roles) => {
    if (router.isActive(getRoute('network'))) {
      return getNetworkUrlFromParams(params, currentUser, roles)
    } else {
      return getContentUrlFromParams(params, currentUser, roles)
    }
  }

  const isSP = userIsServiceProvider(props.currentUser)

  return (
    <nav className='navigation-sidebar text-sm'>
      <ul>
        {/* TODO: Remove button - only for testing */ }
        <li>
          <button className='btn-warning' onClick={()=> expireToken()}>EXPIRE TOKEN</button>
          <button className='btn-danger' onClick={()=> removeToken()}>REMOVE TOKEN</button>
        </li>
        {/* TODO: “Content" should link to the Account or Group that they looked at last when they navigated in content in this session.
        List view or starburst view, depending which one they used. */}
        <IsAllowed to={VIEW_CONTENT_SECTION} not={isSP}>
          <li>
            <Link to={contentOrNetworkUrlBuilder(params, props.currentUser, props.roles)} activeClassName="active" className={contentActive || networkActive}>
              <IconContent />
              <span>
                <FormattedMessage id="portal.navigation.content.text"/>
              </span>
            </Link>
          </li>
        </IsAllowed>

        {isSP &&
          <li>
            <Link to={getNetworkUrlFromParams(params, props.currentUser, props.roles)} activeClassName="active" className={contentActive || networkActive}>
              <IconContent />
              <span><FormattedMessage id="portal.navigation.network.text"/></span>
            </Link>
          </li>
        }

        {isSP &&
          <li>
            <Link to={getDashboardUrlFromParams(params)} activeClassName="active">
              <IconDashboard />
              <span>Dashboard</span>
            </Link>
          </li>
        }

        {/* Analytics should always default to account level analytics, and not depend on the content leaf. */}
        <IsAllowed to={VIEW_ANALYTICS_SECTION}>
          <li>
            <Link to={getAnalyticsUrlFromParams(params, props.currentUser, props.roles)} activeClassName="active" className={analyticsActive} >
              <IconAnalytics />
              <span><FormattedMessage id="portal.navigation.analytics.text"/></span>
            </Link>
          </li>
        </IsAllowed>

        <IsAllowed to={VIEW_SECURITY_SECTION}>
          <li>
            <Link to={getSecurityUrlFromParams(params)} activeClassName="active">
              <IconSecurity />
              <span><FormattedMessage id="portal.navigation.security.text"/></span>
            </Link>
          </li>
        </IsAllowed>

        <IsAllowed to={VIEW_SERVICES_SECTION}>
          <li>
            <Link to={getServicesUrlFromParams(params)} activeClassName="active">
              <IconServices />
              <span><FormattedMessage id="portal.navigation.services.text"/></span>
            </Link>
          </li>
        </IsAllowed>

        <IsAllowed to={VIEW_ACCOUNT_SECTION}>
          <li>
            <Link to={getAccountManagementUrlFromParams(params)} activeClassName="active">
              <IconAccount />
              <span><FormattedMessage id="portal.navigation.account.text"/></span>
            </Link>
          </li>
        </IsAllowed>

        <IsAllowed to={VIEW_SUPPORT_SECTION}>
          <li>
            <Link to={getSupportUrlFromParams(params)} activeClassName="active">
              <IconSupport />
              <span><FormattedMessage id="portal.navigation.support.text"/></span>
            </Link>
          </li>
        </IsAllowed>
      </ul>
    </nav>
  )
}

Navigation.displayName = 'Navigation'
Navigation.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  currentUser: React.PropTypes.instanceOf(Immutable.Map),
  params: React.PropTypes.object,
  roles: React.PropTypes.instanceOf(Immutable.List),
  router: React.PropTypes.object
}

export default withRouter(Navigation)

import React from 'react'
import { Link, withRouter } from 'react-router'
import Immutable from 'immutable'

import { getRoute } from '../../routes.jsx'
import {
  getAccountManagementUrlFromParams,
  getAnalyticsUrlFromParams,
  getContentUrlFromParams,
  getServicesUrlFromParams,
  getSupportUrlFromParams,
  getSecurityUrlFromParams
} from '../../util/helpers.js'
import IsAllowed from '../is-allowed'


import {VIEW_ACCOUNT_SECTION,
  VIEW_ANALYTICS_SECTION,
  VIEW_CONTENT_SECTION,
  VIEW_SECURITY_SECTION,
  VIEW_SERVICES_SECTION,
  VIEW_SUPPORT_SECTION} from '../../constants/permissions'

import IconAccount from '../icons/icon-account.jsx'
import IconAnalytics from '../icons/icon-analytics.jsx'
import IconContent from '../icons/icon-content.jsx'
import IconServices from '../icons/icon-services.jsx'
import IconSecurity from '../icons/icon-security.jsx'
import IconSupport from '../icons/icon-support.jsx'

import './navigation.scss'

const Navigation = (props) => {
  const params = props.params,
    router = props.router

  const contentActive = router.isActive(getRoute('content')) ? ' active' : '',
    analyticsActive = router.isActive(getRoute('analytics')) ? ' active' : ''

  return (
    <nav className='navigation-sidebar'>
      <ul>
        {/* TODO: “Content" should link to the Account or Group that they looked at last when they navigated in content in this session.
        List view or starburst view, depending which one they used. */}
        <IsAllowed to={VIEW_CONTENT_SECTION}>
          <li>
            <Link to={getContentUrlFromParams(params)} activeClassName="active" className={'main-nav-link' + contentActive}>
              <IconContent />
              <span>Content</span>
            </Link>
          </li>
        </IsAllowed>

        {/* Analytics should always default to account level analytics, and not depend on the content leaf. */}
        <IsAllowed to={VIEW_ANALYTICS_SECTION}>
          <li>
            <Link to={getAnalyticsUrlFromParams(params, props.currentUser, props.roles)} activeClassName="active" className={'main-nav-link' + analyticsActive} >
              <IconAnalytics />
              <span>Analytics</span>
            </Link>
          </li>
        </IsAllowed>

        <IsAllowed to={VIEW_SECURITY_SECTION}>
          <li>
            <Link to={getSecurityUrlFromParams(params)} activeClassName="active">
              <IconSecurity />
              <span>Security</span>
            </Link>
          </li>
        </IsAllowed>

        <IsAllowed to={VIEW_SERVICES_SECTION}>
          <li>
            <Link to={getServicesUrlFromParams(params)} activeClassName="active">
              <IconServices />
              <span>Services</span>
            </Link>
          </li>
        </IsAllowed>

        <IsAllowed to={VIEW_ACCOUNT_SECTION}>
          <li>
            <Link to={getAccountManagementUrlFromParams(params)} activeClassName="active">
              <IconAccount />
              <span>Account</span>
            </Link>
          </li>
        </IsAllowed>

        <IsAllowed to={VIEW_SUPPORT_SECTION}>
          <li>
            <Link to={getSupportUrlFromParams(params)} activeClassName="active">
              <IconSupport />
              <span>Support</span>
            </Link>
          </li>
        </IsAllowed>
      </ul>
    </nav>
  )
}

Navigation.displayName = 'Navigation'
Navigation.propTypes = {
  currentUser: React.PropTypes.instanceOf(Immutable.Map),
  params: React.PropTypes.object,
  roles: React.PropTypes.instanceOf(Immutable.List),
  router: React.PropTypes.object
}

export default withRouter(Navigation)

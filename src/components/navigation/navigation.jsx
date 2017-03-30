import React from 'react'
import { Link, withRouter } from 'react-router'
import Immutable from 'immutable'

import {
  getRoute,
  getAccountManagementUrlFromParams,
  getAnalyticsUrlFromParams,
  getContentUrlFromParams,
  getDashboardUrlFromParams,
  getNetworkUrlFromParams,
  getServicesUrlFromParams,
  getSupportUrlFromParams,
  getSecurityUrlFromParams
} from '../../util/routes'

import IsAllowed from '../is-allowed'

import {
  VIEW_ACCOUNT_SECTION,
  VIEW_ANALYTICS_SECTION,
  VIEW_CONTENT_SECTION,
  VIEW_SECURITY_SECTION,
  VIEW_SERVICES_SECTION,
  VIEW_SUPPORT_SECTION
} from '../../constants/permissions'

import {
  accountIsServiceProviderType,
  accountIsContentProviderType,
  userIsServiceProvider,
  userIsContentProvider
} from '../../util/helpers'

import IconAccount from '../icons/icon-account.jsx'
import IconAnalytics from '../icons/icon-analytics.jsx'
import IconBrowse from '../icons/icon-browse.jsx'
import IconContent from '../icons/icon-content.jsx'
import IconDashboard from '../icons/icon-dashboard.jsx'
import IconNetwork from '../icons/icon-network.jsx'
import IconServices from '../icons/icon-services.jsx'
import IconSecurity from '../icons/icon-security.jsx'
import IconSupport from '../icons/icon-support.jsx'

import './navigation.scss'

import { FormattedMessage } from 'react-intl'

const Navigation = ({ activeAccount, currentUser, params, roles, router }) => {
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

  const isSP = userIsServiceProvider(currentUser) || accountIsServiceProviderType(activeAccount)
  const isCP = userIsContentProvider(currentUser) || accountIsContentProviderType(activeAccount)
  const isUDNAdmin = !isSP && !isCP
  /* When users with SP accounts log in, the initial route is still '/content/udn' before we redirect to 'dashboard/udn'.
    Hence, we need to set active class for dashboard before redirecting */
  const dashboardSPActive = isSP && contentActive

  return (
    <nav className='navigation-sidebar text-sm'>
      <ul>
        {/* TODO: “Content" should link to the Account or Group that they looked at last when they navigated in content in this session.
        List view or starburst view, depending which one they used. */}
        <IsAllowed to={VIEW_CONTENT_SECTION} not={isSP}>
          <li>
            <Link to={contentOrNetworkUrlBuilder(params, currentUser, roles)} activeClassName="active" className={contentActive}>
              {isCP ? <IconContent/> : <IconBrowse />}
              <span>
                {isCP
                  ? <FormattedMessage id="portal.navigation.content.text"/>
                  : <FormattedMessage id="portal.navigation.browse.text"/>
                }
              </span>
            </Link>
          </li>
        </IsAllowed>

        {/* Hide Dashboard icon as a second item in navbar when the user is UDN admin */}
        { !isUDNAdmin &&
          <li>
            <Link to={getDashboardUrlFromParams(params)} activeClassName="active" className={dashboardSPActive}>
              <IconDashboard />
              <FormattedMessage id="portal.navigation.dashboard.text"/>
            </Link>
          </li>
        }

        {isSP &&
          <li>
            <Link to={getNetworkUrlFromParams(params, currentUser, roles)} activeClassName="active" className={networkActive}>
              <IconNetwork />
              <span><FormattedMessage id="portal.navigation.network.text"/></span>
            </Link>
          </li>
        }

        {/* Analytics should always default to account level analytics, and not depend on the content leaf. */}
        <IsAllowed to={VIEW_ANALYTICS_SECTION}>
          <li>
            <Link to={getAnalyticsUrlFromParams(params, currentUser, roles)} activeClassName="active" className={analyticsActive} >
              <IconAnalytics />
              <span><FormattedMessage id="portal.navigation.analytics.text"/></span>
            </Link>
          </li>
        </IsAllowed>

        {/* Display Dashboard icon as a third item in navbar when the user is UDN admin */}
        { isUDNAdmin &&
          <li>
            <Link to={getDashboardUrlFromParams(params)} activeClassName="active" className={dashboardSPActive}>
              <IconDashboard />
              <FormattedMessage id="portal.navigation.dashboard.text"/>
            </Link>
          </li>
        }

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
  activeAccount: React.PropTypes.object,
  currentUser: React.PropTypes.instanceOf(Immutable.Map),
  params: React.PropTypes.object,
  roles: React.PropTypes.instanceOf(Immutable.List),
  router: React.PropTypes.object
}

export default withRouter(Navigation)

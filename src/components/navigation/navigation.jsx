import React from 'react'
import { Link } from 'react-router'

import { getRoute } from '../../routes.jsx'
import { generateNestedLink, getAnalyticsUrlFromParams, getContentUrlFromParams } from '../../util/helpers.js'

import IconAccount from '../icons/icon-account.jsx'
import IconAnalytics from '../icons/icon-analytics.jsx'
import IconContent from '../icons/icon-content.jsx'
import IconServices from '../icons/icon-services.jsx'
import IconSecurity from '../icons/icon-security.jsx'
import IconSupport from '../icons/icon-support.jsx'

import './navigation.scss'

const Navigation = (props) => {
  const params = props.params,
    activeAccountId = params.account || null,
    activeGroupId = params.group || null,
    activePropertyName = params.property || null

  /* REFACTOR: temp fix to show active nav item  */
  const contentActive = new RegExp( getRoute('content'), 'g' ).test(props.pathname) ? ' active' : ''
  const analyticsActive = new RegExp( getRoute('analytics'), 'g' ).test(props.pathname) ? ' active' : ''

  return (
    <nav className='navigation-sidebar'>
      <ul>
        {/* TODO: “Content" should link to the Account or Group that they looked at last when they navigated in content in this session.
        List view or starburst view, depending which one they used. */}
        <li>
          <Link to={getContentUrlFromParams(params)} activeClassName="active" className={'main-nav-link' + contentActive}>
            <IconContent />
            <span>Content</span>
          </Link>
        </li>

        { /* Analytics should always default to account level analytics, and not depend on the content leaf. */}
        <li>
          <Link to={getAnalyticsUrlFromParams(params)} activeClassName="active" className={'main-nav-link' + analyticsActive} >
            <IconAnalytics />
            <span>Analytics</span>
          </Link>
        </li>

        <li>
          <Link to={`/security`} activeClassName="active">
            <IconSecurity />
            <span>Security</span>
          </Link>
        </li>

        <li>
          <Link to={`/services`} activeClassName="active">
            <IconServices />
            <span>Services</span>
          </Link>
        </li>

        <li>
          <Link to={ `${getRoute('accountManagement')}/${activeAccountId}`} activeClassName="active">
            <IconAccount />
            <span>Account</span>
          </Link>
        </li>

        <li>
          <Link to={'/support'} activeClassName="active">
            <IconSupport />
            <span>Support</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation

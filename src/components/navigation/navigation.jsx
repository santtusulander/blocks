import React from 'react'
import { Link } from 'react-router'

import { getRoute } from '../../routes.jsx'

import IconAccount from '../icons/icon-account.jsx'
import IconAnalytics from '../icons/icon-analytics.jsx'
import IconContent from '../icons/icon-content.jsx'
import IconEricsson from '../icons/icon-ericsson.jsx'
import IconServices from '../icons/icon-services.jsx'
import IconSecurity from '../icons/icon-security.jsx'
import IconSupport from '../icons/icon-support.jsx'

import './navigation.scss'

function generateNestedLink( base, linkArr ){
  linkArr = linkArr.filter( (e) => {
    return e
  })

  return base + '/' + linkArr.join("/")
}

const Navigation = (props) => {
  const activeAccountId = props.activeAccount && props.activeAccount.get('id') || null;
  const activeGroupId = props.activeGroup && props.activeGroup.get('id') || null;
  const activeHostId = props.activeHost && props.activeHost.get('id') || null;

  const contentUrl = activeAccountId ? `${ getRoute('content') }/accounts/udn/${activeAccountId}` : `${ getRoute('content') }/accounts/udn`

  const analyticsUrl = generateNestedLink( getRoute('analytics'), ['udn', activeAccountId, activeGroupId, activeHostId] )

  return (
    <nav className='navigation-sidebar'>
      <ul>

        <li className='logo'>
          <Link to={`/content/accounts/udn`}>
            <IconEricsson />
          </Link>
        </li>

        <li>
          <Link to={contentUrl} activeClassName="active">
            <IconContent />
            <span>Content</span>
          </Link>
        </li>

        <li>
          <Link to={analyticsUrl} activeClassName="active">
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
          <Link to={'/account-management'} activeClassName="active">
            <IconAccount />
            <span>Account</span>
          </Link>
        </li>

        <li>
          <a href="#">
            <IconSupport />
            <span>Support</span>
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation

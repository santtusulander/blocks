import React from 'react'
import { Link } from 'react-router'

import { getRoute } from '../../routes.jsx'
import { generateNestedLink } from '../../util/helpers.js'

import IconAccount from '../icons/icon-account.jsx'
import IconAnalytics from '../icons/icon-analytics.jsx'
import IconContent from '../icons/icon-content.jsx'
import IconEricsson from '../icons/icon-ericsson.jsx'
import IconServices from '../icons/icon-services.jsx'
import IconSecurity from '../icons/icon-security.jsx'
import IconSupport from '../icons/icon-support.jsx'

import './navigation.scss'

const Navigation = (props) => {
  const activeAccountId = props.activeAccount && props.activeAccount.get('id') || null;
  const activeGroupId = props.activeGroup && props.activeGroup.get('id') || null;

  //const activeHostId = props.activeHost && props.activeHost.get('id') || null;

  //const contentUrl = activeGroupId ? `${ getRoute('content') }/groups/udn/${activeAccountId}/${activeGroupId}` : activeAccountId ? `${ getRoute('content') }/accounts/udn/${activeAccountId}` : `${ getRoute('content') }/accounts/udn`
  const contentUrl = activeAccountId ? `${ getRoute('content') }/groups/udn/${activeAccountId}` : `${ getRoute('content') }/accounts/udn`
    //: activeAccountId ? `${ getRoute('content') }/accounts/udn/${activeAccountId}` : `${ getRoute('content') }/accounts/udn`

  //Analytics should always default to account level analytics, and not depend on the content leaf.
  const analyticsUrl = generateNestedLink( getRoute('analytics'), ['udn', activeAccountId, activeGroupId] )

  //Alternative -- create from url -params (if deep link is needed)
  //const {account, host, group, property} = props.params;
  //const analyticsUrl = generateNestedLink( getRoute('analytics'), ['udn', account, group, property] )

  /* REFACTOR: temp fix to show active nav item  */
  const contentActive = new RegExp( getRoute('content'), 'g' ).test(props.pathname) ? ' active' : ''
  const analyticsActive = new RegExp( getRoute('analytics'), 'g' ).test(props.pathname) ? ' active' : ''

  return (
    <nav className='navigation-sidebar'>
      <ul>
        {/* TODO: the logo should link to the level where they select accounts,
        for CPs it should link to where they select groups.*/}
        <li className='logo'>
          <Link to={`/content/accounts/udn`}>
            <IconEricsson />
          </Link>
        </li>

        {/* TODO: “Content" should link to the Account or Group that they looked at last when they navigated in content in this session.
        List view or starburst view, depending which one they used. */}
        <li>
          <Link to={contentUrl} activeClassName="active" className={'main-nav-link' + contentActive}>
            <IconContent />
            <span>Content</span>
          </Link>
        </li>

        { /* Analytics should always default to account level analytics, and not depend on the content leaf. */}
        <li>
          <Link to={analyticsUrl} activeClassName="active" className={'main-nav-link' + analyticsActive} >
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

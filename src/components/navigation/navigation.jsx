import React from 'react'

import IconAccount from '../icons/icon-account.jsx'
import IconAnalytics from '../icons/icon-analytics.jsx'
import IconContent from '../icons/icon-content.jsx'
import IconServices from '../icons/icon-services.jsx'
import IconSecurity from '../icons/icon-security.jsx'
import IconSupport from '../icons/icon-support.jsx'

import './navigation.scss'

const Navigation = (props) => {
  return (
    <nav className='navigation-sidebar'>
      <ul>
          <li className='active'>
            <a href="#">
              <IconContent />
              <span>Content</span>
            </a>
          </li>

        <li>
          <a href="#">
            <IconAnalytics />
            <span>Analytics</span>
          </a>
        </li>

        <li>
          <a href="#">
            <IconSecurity />
            <span>Security</span>
          </a>
        </li>

        <li>
          <a href="#">
            <IconServices />
            <span>Services</span>
          </a>
        </li>

        <li className='active'>
          <a href="#">
            <IconAccount />
            <span>Account</span>
          </a>
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

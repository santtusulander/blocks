import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import * as PERMISSIONS from '../../constants/permissions.js'
import {
  userIsCloudProvider
} from '../../util/helpers.js'
import {
  getAnalyticsUrl,
  getContentUrl,
  getUrl
} from '../../util/routes.js'
import IsAllowed from '../is-allowed'
import TruncatedTitle from '../truncated-title'
import IconCaretDown from '../icons/icon-caret-down'
import AccountSelector from '../global-account-selector/global-account-selector.jsx'

function AccountSelectorItem({ account, activeAccount, brand, router, user }) {
  const activeAccountName = activeAccount && account ? activeAccount.get('name') : 'UDN Admin'
  const activeAccountNameNoPlaceholder = activeAccount && account ? activeAccount.get('name') : ''
  const itemSelector = (...params) => {
    // This check is done to prevent UDN admin from accidentally hitting
    // the account detail endpoint, which they don't have permission for
    if (router.isActive('/content') || router.isActive('/network')) {
      if (params[0] === 'account' && userIsCloudProvider(user)) {
        params[0] = 'groups'
      }
    }

    if (router.isActive('/content') || router.isActive('/network')) {
      router.push(getContentUrl(...params))
    } else if (router.isActive('/analysis')) {
      router.push(getAnalyticsUrl(...params))
    } else if (router.isActive('/account-management')) {
      router.push(getUrl('/account-management', ...params))
    } else if (router.isActive('/security')) {
      router.push(getUrl('/security', ...params))
    } else if (router.isActive('/support')) {
      router.push(getUrl('/support', ...params))
    } else if (router.isActive('/dashboard')) {
      router.push(getUrl('/dashboard', ...params))
    }
  }

  return (
    <li className="header__account-selector">
      <IsAllowed to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
        <AccountSelector
          as="header"
          params={{ brand, account }}
          topBarTexts={{ brand: 'UDN Admin', account: 'UDN Admin' }}
          topBarAction={() => itemSelector('brand', 'udn', {})}
          onSelect={itemSelector}
          restrictedTo="account">
          <div className="btn btn-link dropdown-toggle header-toggle">
            <TruncatedTitle content={activeAccount && activeAccountName} tooltipPlacement="bottom" className="account-property-title"/>
            <IconCaretDown />
          </div>
        </AccountSelector>
      </IsAllowed>
      <IsAllowed not={true} to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
        <div className="active-account-name">{activeAccountNameNoPlaceholder}</div>
      </IsAllowed>
    </li>
  )
}

AccountSelectorItem.displayName = 'AccountSelectorItem'
AccountSelectorItem.propTypes = {
  account: PropTypes.string,
  activeAccount: PropTypes.instanceOf(Immutable.Map),
  brand: PropTypes.string,
  router: PropTypes.object,
  user: PropTypes.instanceOf(Immutable.Map)
}
AccountSelectorItem.defaultProps = {
  activeAccount: new Immutable.Map(),
  user: new Immutable.Map()
}

export default AccountSelectorItem

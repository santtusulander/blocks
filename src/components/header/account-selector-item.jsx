import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import * as PERMISSIONS from '../../constants/permissions.js'

import {
  getAnalyticsUrl,
  getContentUrl,
  getUrl
} from '../../util/routes.js'
import IsAllowed from '../shared/permission-wrappers/is-allowed'
import TruncatedTitle from '../shared/page-elements/truncated-title'
import IconCaretDown from '../shared/icons/icon-caret-down'
import { AccountSelector } from '../drillable-menu/containers'

function AccountSelectorItem({ activeAccount, router, params }) {
  const activeAccountName = params.account ? activeAccount.get('name') : 'UDN Admin'
  const activeAccountNameNoPlaceholder = params.account ? activeAccount.get('name') : ''

  const onItemClick = ({ nodeInfo, id }) => {
    const parametersToBuildRoute = [nodeInfo.entityType, id, nodeInfo.parents]

    if (router.isActive('/content') || router.isActive('/network')) {
      router.push(getContentUrl(...parametersToBuildRoute))
    } else if (router.isActive('/analysis')) {
      router.push(getAnalyticsUrl(...parametersToBuildRoute))
    } else if (router.isActive('/account-management')) {
      router.push(getUrl('/account-management', ...parametersToBuildRoute))
    } else if (router.isActive('/security')) {
      router.push(getUrl('/security', ...parametersToBuildRoute))
    } else if (router.isActive('/support')) {
      router.push(getUrl('/support', ...parametersToBuildRoute))
    } else if (router.isActive('/dashboard')) {
      router.push(getUrl('/dashboard', ...parametersToBuildRoute))
    }
  }

  return (
    <li className="header__account-selector">
      <IsAllowed to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
        <AccountSelector params={params} levels={[ 'brand' ]} onItemClick={onItemClick}>
          <div className="btn btn-link dropdown-toggle header-toggle">
            <TruncatedTitle content={activeAccountName} tooltipPlacement="bottom" className="account-property-title"/>
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
  activeAccount: PropTypes.instanceOf(Immutable.Map),
  params: PropTypes.object,
  router: PropTypes.object
}
AccountSelectorItem.defaultProps = {
  activeAccount: Immutable.Map()
}

export default AccountSelectorItem

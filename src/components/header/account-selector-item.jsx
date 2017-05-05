import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import Immutable from 'immutable'

import * as PERMISSIONS from '../../constants/permissions.js'

import {
  getAnalyticsUrlFromParams,
  getContentUrlFromParams,
  getSecurityUrlFromParams,
  getDashboardUrlFromParams,
  getServicesUrlFromParams,
  getSupportUrlFromParams,
  getAccountManagementUrlFromParams
} from '../../util/routes.js'
import IsAllowed from '../shared/permission-wrappers/is-allowed'
import TruncatedTitle from '../shared/page-elements/truncated-title'
import IconCaretDown from '../shared/icons/icon-caret-down'
import AccountSelector from '../global-account-selector/account-selector-container'

function AccountSelectorItem({ activeAccount, router, params }) {
  const activeAccountName = params.account ? activeAccount.get('name') : <FormattedMessage id="portal.content.property.topBar.brand.label" />
  const activeAccountNameNoPlaceholder = params.account ? activeAccount.get('name') : ''

  const onItemClick = ({ nodeInfo, id }) => {
    const parametersToBuildRoute = { [nodeInfo.entityType]: id, ...nodeInfo.parents }

    if (router.isActive('/content') || router.isActive('/network')) {
      router.push(getContentUrlFromParams(parametersToBuildRoute))
    } else if (router.isActive('/analysis')) {
      router.push(getAnalyticsUrlFromParams(parametersToBuildRoute))
    } else if (router.isActive('/account-management')) {
      router.push(getAccountManagementUrlFromParams(parametersToBuildRoute))
    } else if (router.isActive('/security')) {
      router.push(getSecurityUrlFromParams(parametersToBuildRoute))
    } else if (router.isActive('/support')) {
      router.push(getSupportUrlFromParams(parametersToBuildRoute))
    } else if (router.isActive('/dashboard')) {
      router.push(getDashboardUrlFromParams(parametersToBuildRoute))
    } else if (router.isActive('/services')) {
      router.push(getServicesUrlFromParams(parametersToBuildRoute))
    }
  }

  return (
    <li className="header__account-selector">
      <IsAllowed to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
        <AccountSelector
          alwaysActiveTitle={true}
          params={params}
          levels={[ 'brand' ]}
          onItemClick={onItemClick}>
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

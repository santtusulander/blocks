import React from 'react'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { ButtonToolbar } from 'react-bootstrap'
import { Link, withRouter } from 'react-router'
import { Map } from 'immutable'

import PageHeader from '../layout/page-header'
import AccountSelector from '../global-account-selector/global-account-selector'
import TruncatedTitle from '../truncated-title'

import IconChart from '../icons/icon-chart.jsx'
import IconCaretDown from '../icons/icon-caret-down'
import IconConfiguration from '../icons/icon-configuration.jsx'

import {
  getContentUrl,
  getNetworkUrl
} from '../../util/routes.js'
import { userIsCloudProvider } from '../../util/helpers'

const StorageHeader = ({
  currentUser,
  intl,
  params,
  router
}) => {
  const itemSelectorTexts = {
    storage: intl.formatMessage({ id: 'portal.storage.topBar.storage.label' }),
    group: intl.formatMessage({ id: 'portal.storage.topBar.group.label' }),
    account: intl.formatMessage({ id: 'portal.storage.topBar.account.label' }),
    brand: intl.formatMessage({ id: 'portal.storage.topBar.brand.label' })
  }

  const itemSelectorTopBarAction = (tier, fetchItems, IDs) => {
    const { account } = IDs
    switch (tier) {
      case 'property':
        fetchItems('group', 'udn', account)
        break
      case 'group':
        fetchItems('account', 'udn')
        break
      case 'brand':
      case 'account':
        router.push(getContentUrl('brand', 'udn', {}))
        break
    }
  }

  return (
    <PageHeader pageSubTitle={<FormattedMessage id="portal.storage.summaryPage.title"/>}>
      <AccountSelector
        as="storageSummary"
        params={params}
        topBarTexts={itemSelectorTexts}
        topBarAction={itemSelectorTopBarAction}
        onSelect={(...params) => {
          // the code for this function is copied from property-header.jsx file!
          if (params[0] === 'account' && userIsCloudProvider(currentUser)) {
            params[0] = 'groups'
          }

          const url = router.isActive('network')
            ? getNetworkUrl(...params)
            : getContentUrl(...params)

          if (url) {
            router.push(url)
          }
        }}>
        <div className="btn btn-link dropdown-toggle header-toggle">
          <h1>
            <TruncatedTitle content={params.storage}
                            tooltipPlacement="bottom"
                            className="account-property-title"/>
          </h1>
          <IconCaretDown />
        </div>
      </AccountSelector>
      <ButtonToolbar>
        <Link className="btn btn-primary btn-icon"
              // to prop should be uncommented when (UNDP-2932) finishes
              // to={`${getAnalyticsUrl('storage', params.storage, params)}`}>
              >
          <IconChart/>
        </Link>
        <Link className="btn btn-primary btn-icon"
              // to prop should be uncommented when (UNDP-2932) finishes
              // to={`${getContentUrl('property', params.property, params)}/configuration`}>
              >
          <IconConfiguration/>
        </Link>
      </ButtonToolbar>
    </PageHeader>
  )
}

StorageHeader.displayName = 'StorageHeader'

StorageHeader.propTypes = {
  currentUser: React.PropTypes.instanceOf(Map),
  intl: intlShape,
  params: React.PropTypes.object,
  router: React.PropTypes.object
}

export default withRouter(injectIntl(StorageHeader))

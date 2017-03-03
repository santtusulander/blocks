import React from 'react'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { ButtonToolbar } from 'react-bootstrap'
import { Link } from 'react-router'

import PageHeader from '../layout/page-header'
import AccountSelector from '../global-account-selector/global-account-selector'
import TruncatedTitle from '../truncated-title'

import IconChart from '../icons/icon-chart.jsx'
import IconCaretDown from '../icons/icon-caret-down'
import IconConfiguration from '../icons/icon-configuration.jsx'

import { getContentUrl } from '../../util/routes.js'

const StorageHeader = ({ intl, router }) => {

  const itemSelectorTexts = {
    storage: intl.formatMessage({ id: 'portal.storage.topBar.storage.label' }),
    group: intl.formatMessage({ id: 'portal.storage.topBar.group.label' }),
    account: intl.formatMessage({ id: 'portal.storage.topBar.account.label' }),
    brand: intl.formatMessage({ id: 'portal.storage.topBar.brand.label' })
  }

  const itemSelectorTopBarAction = (tier, fetchItems, IDs) => {
    const { account } = IDs
    switch (tier) {
      case 'storage':
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
    <PageHeader pageSubtitle={<FormattedMessage id="portal.storage.summaryPage.title"/>}>
      <AccountSelector
        as="storageSummary"
        // params={params}
        topBarTexts={itemSelectorTexts}
        topBarAction={itemSelectorTopBarAction}
        // onSelect={(...params) => {
          // This check is done to prevent UDN admin from accidentally hitting
          // the account detail endpoint, which they don't have permission for
          // if (params[0] === 'account' && userIsCloudProvider(currentUser)) {
            // params[0] = 'groups'
          // }

          // const url = router.isActive('network')
            // ? getNetworkUrl(...params)
            // : getContentUrl(...params)

          // const isOnPropertyTier = params[0] === 'property'
          // We perform this check to prevent routing to unsupported routes
          // For example, prevent clicking to SP group route (not yet supported)
          // if (url) {
            // router.push(isOnPropertyTier ? `${url}/${currentTab}` : url)
          // }
        // }}>
        >
        <div className="btn btn-link dropdown-toggle header-toggle">
          <h1>
            <TruncatedTitle content={{}}
                            // content={params.property}
                            tooltipPlacement="bottom"
                            className="account-property-title"/>
          </h1>
          <IconCaretDown />
        </div>
      </AccountSelector>
      <ButtonToolbar>
        <Link className="btn btn-success btn-icon"
              // to={`${getAnalyticsUrl('property', params.property, params)}`}>
              to='#'>
          <IconChart/>
        </Link>
        <Link className="btn btn-success btn-icon"
              // to={`${getContentUrl('property', params.property, params)}/configuration`}>
              to='#'>
          <IconConfiguration/>
        </Link>
      </ButtonToolbar>
    </PageHeader>
  )
}

StorageHeader.displayName = 'StorageHeader'

StorageHeader.propTypes = {
  intl: intlShape,
  router: React.PropTypes.object
}

export default injectIntl(StorageHeader)

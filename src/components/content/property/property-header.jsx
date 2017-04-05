import React from 'react';
import { Map } from 'immutable'
import { Link, withRouter } from 'react-router'
import { ButtonToolbar, Button } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'

import { MODIFY_PROPERTY, DELETE_PROPERTY } from '../../../constants/permissions'
import IsAllowed from '../../shared/permission-wrappers/is-allowed'

import {
  getAnalyticsUrl,
  getContentUrl,
  getNetworkUrl
} from '../../../util/routes.js'
import { userIsCloudProvider } from '../../../util/helpers'

import PageHeader from '../../shared/layout/page-header'
import AccountSelector from '../../global-account-selector/global-account-selector'
import TruncatedTitle from '../../truncated-title'

import IconTrash from '../../shared/icons/icon-trash.jsx'
import IconChart from '../../shared/icons/icon-chart.jsx'
import IconConfiguration from '../../shared/icons/icon-configuration.jsx'
import IconCaretDown from '../../shared/icons/icon-caret-down'

const PropertyHeader = ({ currentUser, deleteProperty, intl, params, router, currentTab, togglePurge }) => {

  const itemSelectorTexts = {
    property: intl.formatMessage({ id: 'portal.content.property.topBar.property.label' }),
    group: intl.formatMessage({ id: 'portal.content.property.topBar.group.label' }),
    account: intl.formatMessage({ id: 'portal.content.property.topBar.account.label' }),
    brand: intl.formatMessage({ id: 'portal.content.property.topBar.brand.label' })
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
    <PageHeader pageSubTitle={<FormattedMessage id="portal.properties.propertyContentSummary.text"/>}>
      <AccountSelector
        as="propertySummary"
        params={params}
        topBarTexts={itemSelectorTexts}
        topBarAction={itemSelectorTopBarAction}
        onSelect={(...params) => {
          // This check is done to prevent UDN admin from accidentally hitting
          // the account detail endpoint, which they don't have permission for
          if (params[0] === 'account' && userIsCloudProvider(currentUser)) {
            params[0] = 'groups'
          }

          const url = router.isActive('network')
            ? getNetworkUrl(...params)
            : getContentUrl(...params)

          const isOnPropertyTier = params[0] === 'property'
          // We perform this check to prevent routing to unsupported routes
          // For example, prevent clicking to SP group route (not yet supported)
          if (url) {
            router.push(isOnPropertyTier ? `${url}/${currentTab}` : url)
          }
        }}>
        <div className="btn btn-link dropdown-toggle header-toggle">
          <h1>
            <TruncatedTitle content={params.property}
                            tooltipPlacement="bottom"
                            className="account-property-title"/>
          </h1>
          <IconCaretDown />
        </div>
      </AccountSelector>
      <ButtonToolbar>
        <IsAllowed to={MODIFY_PROPERTY}>
          <Button bsStyle="primary" onClick={togglePurge}><FormattedMessage id="portal.content.property.header.purge.label"/></Button>
        </IsAllowed>
        <Link className="btn btn-success btn-icon"
              to={`${getAnalyticsUrl('property', params.property, params)}`}>
          <IconChart/>
        </Link>
        <Link className="btn btn-success btn-icon"
              to={`${getContentUrl('property', params.property, params)}/configuration`}>
          <IconConfiguration/>
        </Link>
        <IsAllowed to={DELETE_PROPERTY}>
          <Button bsStyle="danger" className="btn-icon" onClick={deleteProperty}>
            <IconTrash/>
          </Button>
        </IsAllowed>
      </ButtonToolbar>
    </PageHeader>
  )
}

PropertyHeader.displayName = "PropertyHeader"
PropertyHeader.defaultProps = {
  currentTab: 'summary'
}
PropertyHeader.propTypes = {
  currentTab: React.PropTypes.string,
  currentUser: React.PropTypes.instanceOf(Map),
  deleteProperty: React.PropTypes.func,
  intl: React.PropTypes.object,
  params: React.PropTypes.object,
  router: React.PropTypes.object,
  togglePurge: React.PropTypes.func
}


export default withRouter(injectIntl(PropertyHeader))

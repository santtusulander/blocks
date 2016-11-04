import React, { PropTypes } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import Immutable from 'immutable'

import PageHeader from '../layout/page-header'
import AccountSelector from '../global-account-selector/global-account-selector'
import IsAllowed from '../is-allowed'
import TruncatedTitle from '../truncated-title'

import * as PERMISSIONS from '../../constants/permissions.js'

const SecurityPageHeader = ({ activeAccount, intl, itemSelectorFunc, params }) => {
  const { account } = params
  let headerText = account ? activeAccount.get('name') : intl.formatMessage({id: 'portal.account.manage.selectAccount.text'})

  return (
    <PageHeader pageSubTitle={<FormattedMessage id="portal.security.header.text"/>}>
      <IsAllowed to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
        <AccountSelector
          as="security"
          params={params}
          topBarTexts={{ brand: 'UDN Admin', account: 'UDN Admin' }}
          topBarAction={() => itemSelectorFunc('brand', 'udn', {})}
          onSelect={itemSelectorFunc}
          restrictedTo="account">
          <div className="btn btn-link dropdown-toggle header-toggle">
            <h1><TruncatedTitle content={headerText} tooltipPlacement="bottom" /></h1>
            <span className="caret" />
          </div>
        </AccountSelector>
      </IsAllowed>
      <IsAllowed not={true} to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
        <h1><TruncatedTitle content={headerText} tooltipPlacement="bottom" /></h1>
      </IsAllowed>
     </PageHeader>
  )
}

SecurityPageHeader.propTypes = {
  activeAccount: PropTypes.instanceOf(Immutable.Map),
  intl: PropTypes.object,
  itemSelectorFunc: PropTypes.func,
  params: PropTypes.object
}

export default injectIntl(SecurityPageHeader)

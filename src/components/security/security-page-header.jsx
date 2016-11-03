import React, { PropTypes } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'

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
          as="accountManagement"
          params={params}
          topBarTexts={{ brand: 'UDN Admin' }}
          topBarAction={() => itemSelectorFunc('brand', 'udn', {})}
          onSelect={itemSelectorFunc}
          restrictedTo="account">
          <div className="btn btn-link dropdown-toggle header-toggle">
            <h1><TruncatedTitle content={activeAccount.get('name') ||  <FormattedMessage id="portal.accountManagement.noActiveAccount.text"/>}
              tooltipPlacement="bottom" className="account-property-title"/></h1>
            <span className="caret"></span>
          </div>
        </AccountSelector>
      </IsAllowed>
      <IsAllowed not={true} to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
        <h1>{headerText}</h1>
      </IsAllowed>
     </PageHeader>
  )
}

SecurityPageHeader.propTypes = {
  activeAccount: PropTypes.string,
  intl: PropTypes.object,
  itemSelectorFunc: PropTypes.func,
  params: PropTypes.object
}

export default injectIntl(SecurityPageHeader)

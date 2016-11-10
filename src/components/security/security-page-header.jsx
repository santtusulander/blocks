import React, { PropTypes } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'

import AccountSelector from '../global-account-selector/global-account-selector'
import PageHeader from '../layout/page-header'
import TruncatedTitle from '../truncated-title'
import IconCaretDown from '../icons/icon-caret-down'

const SecurityPageHeader = ({ activeAccount, activeGroup, intl, itemSelectorFunc, params }) => {
  const { account, group } = params
  const restriction = account ? "group" : null
  let headerText = intl.formatMessage({id: 'portal.account.manage.selectAccount.text'})

  if (group) {
    headerText = activeGroup
  } else if (account) {
    headerText = activeAccount
  }

  return (
    <PageHeader pageSubTitle={<FormattedMessage id="portal.security.header.text"/>}>
        <AccountSelector
          as="security"
          params={params}
          topBarTexts={{ brand: 'UDN Admin', account: 'UDN Admin' }}
          topBarAction={() => itemSelectorFunc('brand', 'udn', {})}
          onSelect={itemSelectorFunc}
          restrictedTo={restriction}
          startTier={account ? "group" : "account"}
          drillable={true}>
          <div className="btn btn-link dropdown-toggle header-toggle">
            <h1><TruncatedTitle content={headerText} tooltipPlacement="bottom" /></h1>
            <IconCaretDown />
          </div>
        </AccountSelector>
     </PageHeader>
  )
}

SecurityPageHeader.propTypes = {
  activeAccount: PropTypes.string,
  activeGroup: PropTypes.string,
  intl: PropTypes.object,
  itemSelectorFunc: PropTypes.func,
  params: PropTypes.object
}

export default injectIntl(SecurityPageHeader)

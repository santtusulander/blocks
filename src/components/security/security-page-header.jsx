import React, { PropTypes } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'

import AccountSelector from '../global-account-selector/account-selector-container'
import PageHeader from '../shared/layout/page-header'
import TruncatedTitle from '../shared/page-elements/truncated-title'
import IconCaretDown from '../shared/icons/icon-caret-down'

const SecurityPageHeader = ({ activeAccount, activeGroup, intl, itemSelectorFunc, params }) => {
  let headerText = intl.formatMessage({id: 'portal.account.manage.selectAccount.text'})

  if (activeGroup) {
    headerText = activeGroup
  } else if (activeAccount) {
    headerText = activeAccount
  }

  return (
    <PageHeader pageSubTitle={<FormattedMessage id="portal.security.header.text"/>}>
        <AccountSelector
          params={params}
          onItemClick={itemSelectorFunc}
          levels={[ 'brand', 'account' ]}>
          <div className="btn btn-link dropdown-toggle header-toggle">
            <h1><TruncatedTitle content={headerText} tooltipPlacement="bottom" /></h1>
            <IconCaretDown />
          </div>
        </AccountSelector>
     </PageHeader>
  )
}

SecurityPageHeader.displayName = "SecurityPageHeader"
SecurityPageHeader.propTypes = {
  activeAccount: PropTypes.string,
  activeGroup: PropTypes.string,
  intl: PropTypes.object,
  itemSelectorFunc: PropTypes.func,
  params: PropTypes.object
}

export default injectIntl(SecurityPageHeader)

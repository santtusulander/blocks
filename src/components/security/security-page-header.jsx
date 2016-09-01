import React, { PropTypes } from 'react'
import { injectIntl } from 'react-intl'

import PageHeader from '../layout/page-header'

import { FormattedMessage } from 'react-intl'

const SecurityPageHeader = ({ activeAccount, intl }) => {
  return (
    <PageHeader pageSubTitle={<FormattedMessage id="portal.security.header.text"/>}>
      <h1>{activeAccount || intl.formatMessage({id: 'portal.account.manage.selectAccount.text'})}</h1>
    </PageHeader>
  )
}

SecurityPageHeader.propTypes = {
  activeAccount: PropTypes.string,
  intl: PropTypes.object
}

export default injectIntl(SecurityPageHeader)

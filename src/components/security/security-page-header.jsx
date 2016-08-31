import React, { PropTypes } from 'react'
import { injectIntl } from 'react-intl'

import PageHeader from '../layout/page-header'

import { FormattedMessage } from 'react-intl'

const SecurityPageHeader = ({ activeAccount }) => {
  return (
    <PageHeader pageSubTitle={<FormattedMessage id="portal.security.header.text"/>}>
      <h1>{activeAccount || this.props.intl.formatMessage({id: 'portal.account.manage.selectAccount.text'})}</h1>
    </PageHeader>
  )
}

SecurityPageHeader.propTypes = {
  activeAccount: PropTypes.string
}

export default injectIntl(SecurityPageHeader)

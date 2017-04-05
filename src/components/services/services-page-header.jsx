import React, { PropTypes } from 'react'
import { injectIntl } from 'react-intl'

import PageHeader from '../shared/layout/page-header'

import { FormattedMessage } from 'react-intl'

const ServicesPageHeader = ({ activeAccount, intl }) => {
  return (
    <PageHeader pageSubTitle={<FormattedMessage id="portal.services.header.text"/>}>
      <h1>{activeAccount || intl.formatMessage({id: 'portal.account.manage.selectAccount.text'})}</h1>
    </PageHeader>
  )
}

ServicesPageHeader.displayName = "ServicesPageHeader"
ServicesPageHeader.propTypes = {
  activeAccount: PropTypes.string,
  intl: PropTypes.object
}

export default injectIntl(ServicesPageHeader)

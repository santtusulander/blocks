import React, { PropTypes } from 'react'

import PageHeader from '../layout/page-header'

import {FormattedMessage} from 'react-intl'

const ServicesPageHeader = ({ activeAccount }) => {
  return (
    <PageHeader pageSubTitle={<FormattedMessage id="portal.services.header.text"/>}>
      <h1>{activeAccount || 'select account'}</h1>
    </PageHeader>
  )
}

ServicesPageHeader.propTypes = {
  activeAccount: PropTypes.string
}

export default ServicesPageHeader

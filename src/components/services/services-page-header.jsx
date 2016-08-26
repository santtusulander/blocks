import React, { PropTypes } from 'react'

import PageHeader from '../layout/page-header'

import {FormattedMessage} from 'react-intl'

const ServicesPageHeader = ({ activeAccount }) => {
  return (
    <PageHeader>
      <h5><FormattedMessage id="portal.services.header.text"/></h5>
      <h1>{activeAccount || 'select account'}</h1>
    </PageHeader>
  )
}

ServicesPageHeader.propTypes = {
  activeAccount: PropTypes.string
}

export default ServicesPageHeader

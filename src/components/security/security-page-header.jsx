import React, { PropTypes } from 'react'

import PageHeader from '../layout/page-header'

import {FormattedMessage} from 'react-intl'

const SecurityPageHeader = ({ activeAccount }) => {
  return (
    <PageHeader>
      <h5><FormattedMessage id="portal.security.header.text"/></h5>
      <h1>{activeAccount || 'select account'}</h1>
    </PageHeader>
  )
}

SecurityPageHeader.propTypes = {
  activeAccount: PropTypes.string
}

export default SecurityPageHeader

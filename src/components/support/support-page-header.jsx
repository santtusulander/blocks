import React, { PropTypes } from 'react'

import PageHeader from '../layout/page-header'

const SupportPageHeader = ({ activeTicket }) => {
  return (
    <PageHeader>
      <p>CUSTOMER SUPPORT</p>
      <h1>{activeTicket || 'select support ticket'}</h1>
    </PageHeader>
  )
}

SupportPageHeader.propTypes = {
  activeTicket: PropTypes.string
}

export default SupportPageHeader

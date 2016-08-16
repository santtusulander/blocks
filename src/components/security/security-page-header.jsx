import React, { PropTypes } from 'react'

import PageHeader from '../layout/page-header'

const SecurityPageHeader = ({ activeAccount }) => {
  return (
    <PageHeader>
      <h5>SECURITY</h5>
      <h1>{activeAccount || 'select account'}</h1>
    </PageHeader>
  )
}

SecurityPageHeader.propTypes = {
  activeAccount: PropTypes.string
}

export default SecurityPageHeader

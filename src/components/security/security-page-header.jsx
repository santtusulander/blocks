import React, { PropTypes } from 'react'

import PageHeader from '../layout/page-header'

const SecurityPageHeader = ({ activeAccount }) => {
  return (
    <PageHeader>
      <p>SECURITY</p>
      <h1>{activeAccount || 'select account'}</h1>
    </PageHeader>
  )
}

SecurityPageHeader.propTypes = {
  activeAccount: PropTypes.string
}

export default SecurityPageHeader

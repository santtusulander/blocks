import React, { PropTypes } from 'react'

import PageHeader from '../layout/page-header'

const ServicesPageHeader = ({ activeAccount }) => {
  return (
    <PageHeader>
      <h5>SERVICES</h5>
      <h1>{activeAccount || 'select account'}</h1>
    </PageHeader>
  )
}

ServicesPageHeader.propTypes = {
  activeAccount: PropTypes.string
}

export default ServicesPageHeader

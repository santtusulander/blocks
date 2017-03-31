import React from 'react'
import { Link } from 'react-router'

import IconChart from '../icons/icon-chart.jsx'

function AnalyticsLink({ url }) {
  return (
    <Link
      className="btn btn-primary btn-icon"
      to={url()}>
      <IconChart />
    </Link>
  )
}

AnalyticsLink.displayName = "AnalyticsLink"
AnalyticsLink.propTypes = {
  url: React.PropTypes.func
}

export default AnalyticsLink

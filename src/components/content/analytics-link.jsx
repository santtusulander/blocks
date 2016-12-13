import React from 'react'
import { Link } from 'react-router'

import IconChart from '../icons/icon-chart.jsx'

const AnalyticsLink = props => {
  return (
    <Link
      className="btn btn-primary btn-icon"
      to={props.url()}>
      <IconChart />
    </Link>
  )
}

AnalyticsLink.propTypes = {
  url: React.PropTypes.func
}

export default AnalyticsLink

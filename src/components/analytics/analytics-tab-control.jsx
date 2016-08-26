import React, { PropTypes } from 'react'
import { Link, withRouter } from 'react-router'
import { Nav } from 'react-bootstrap'

import * as PERMISSIONS from '../../constants/permissions'
import IsAllowed from '../is-allowed'

import { getTabLink } from '../../util/helpers.js'

const tabs = [
  { key: 'traffic', label: 'Traffic Overview', permission: PERMISSIONS.VIEW_ANALYTICS_TRAFFIC_OVERVIEW },
  { key: 'visitors', label: 'Unique Visitors', permission: PERMISSIONS.VIEW_ANALYTICS_UNIQUE_VISITORS },
  { key: 'on-off-net', label: 'SP On/Off Net', hideHierarchy: true, permission: PERMISSIONS.VIEW_ANALYTICS_SP_ON_OFF_NET},
  { key: 'service-providers', label: 'SP Contribution', hideHierarchy: true, permission: PERMISSIONS.VIEW_ANALYTICS_SP_CONTRIBUTION },
  { key: 'file-error', label: 'File Error', propertyOnly: true, permission: PERMISSIONS.VIEW_ANALYTICS_FILE_ERROR },
  { key: 'url-report', label: 'URL', propertyOnly: true, permission: PERMISSIONS.VIEW_ANALYTICS_URL },
  { key: 'playback-demo', label: 'Playback demo', hideHierarchy: true }
]

const AnalyticsTabControl = (props) => {
  return (
    <div>
      {props.params.account &&
      <Nav bsStyle="tabs">
        {tabs.reduce((lis, tab) => {
          if(!tab.propertyOnly || props.params.property) {
            const tabContent = tab.permission ?
              <IsAllowed key={tab.key} to={tab.permission}>
                <li>
                  <Link to={getTabLink(props.location, tab.key)}
                  activeClassName='active'>{tab.label}</Link>
                </li>
              </IsAllowed>
            :
              <li key={tab.key}>
                <Link to={getTabLink(props.location, tab.key)}
                activeClassName='active'>{tab.label}</Link>
              </li>

            lis.push( tabContent )
          }
          return lis
        }, [])}
      </Nav>
      }
    </div>
  )
}


AnalyticsTabControl.propTypes = {
  location: PropTypes.object,
  params: PropTypes.object
}

AnalyticsTabControl.defaultProps = {
  params: {}
}

export default withRouter(AnalyticsTabControl)

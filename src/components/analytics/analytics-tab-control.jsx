import React, { PropTypes } from 'react'
import { Link, withRouter } from 'react-router'
import { injectIntl } from 'react-intl'

import Tabs from '../tabs'
import * as PERMISSIONS from '../../constants/permissions'
import IsAllowed from '../is-allowed'

import { getTabLink } from '../../util/helpers.js'

const AnalyticsTabControl = (props) => {
  const tabs = [
    {
      key: 'traffic',
      label: props.intl.formatMessage({id: 'portal.analytics.tabs.traffic.label'}),
      permission: PERMISSIONS.VIEW_ANALYTICS_TRAFFIC_OVERVIEW
    },
    {
      key: 'cache-hit-rate',
      label: props.intl.formatMessage({id: 'portal.analytics.tabs.cacheHitRate.label'}),
      permission: PERMISSIONS.VIEW_ANALYTICS_TRAFFIC_OVERVIEW
    },
    {
      key: 'visitors',
      label: props.intl.formatMessage({id: 'portal.analytics.tabs.visitors.label'}),
      permission: PERMISSIONS.VIEW_ANALYTICS_UNIQUE_VISITORS
    },
    {
      key: 'on-off-net',
      label: props.intl.formatMessage({id: 'portal.analytics.tabs.onOffNet.label'}),
      hideHierarchy: true,
      permission: PERMISSIONS.VIEW_ANALYTICS_SP_ON_OFF_NET
    },
    {
      key: 'contribution',
      label: props.intl.formatMessage({id: 'portal.analytics.tabs.contribution.label'}),
      hideHierarchy: true,
      // TODO: Temporarily disabled as a part of UDNP-1534
      // permission: PERMISSIONS.VIEW_ANALYTICS_SP_CONTRIBUTION
      permission: PERMISSIONS.ALLOW_ALWAYS
    },
    {
      key: 'storage',
      label: props.intl.formatMessage({id: 'portal.analytics.tabs.storage.label'}),
      permission: PERMISSIONS.VIEW_ANALYTICS_STORAGE
    },
    {
      key: 'file-error',
      label: props.intl.formatMessage({id: 'portal.analytics.tabs.fileError.label'}),
      propertyOnly: true,
      permission: PERMISSIONS.VIEW_ANALYTICS_FILE_ERROR
    },
    {
      key: 'url-report',
      label: props.intl.formatMessage({id: 'portal.analytics.tabs.urlReport.label'}),
      propertyOnly: true,
      permission: PERMISSIONS.VIEW_ANALYTICS_URL
    }
    // UDNP-1938: Temporarily hide Playback Demo since it's not needed at the moment
    // and we don't have time to fix the errors on it for 1.1.1
    /*,
    {
      key: 'playback-demo',
      label: props.intl.formatMessage({id: 'portal.analytics.tabs.playbackDemo.label'}),
      permission: PERMISSIONS.VIEW_ANALYTICS_PLAYBACK_DEMO,
      hideHierarchy: true
    }*/
  ]

  const { params } = props

  return (
    <div>
      <Tabs activeKey={props.activeTab} className="analytics-tabs">
        {tabs.reduce((lis, tab) => {
          if(!tab.propertyOnly || params.property) {
            const tabContent = tab.permission ?
              (<IsAllowed key={tab.key} to={tab.permission} data-eventKey={tab.key}>
                <li role="tab">
                  <Link to={getTabLink(props.location, tab.key)}
                  activeClassName='active'>{tab.label}</Link>
                </li>
              </IsAllowed>)
            :
              (<li key={tab.key} role="tab" data-eventKey={tab.key}>
                <Link to={getTabLink(props.location, tab.key)}
                activeClassName='active'>{tab.label}</Link>
              </li>)

            lis.push( tabContent )
          }
          return lis
        }, [])}
      </Tabs>
    </div>
  )
}

AnalyticsTabControl.displayName = "AnalyticsTabControl"

AnalyticsTabControl.propTypes = {
  activeTab: PropTypes.string,
  intl: PropTypes.object,
  location: PropTypes.object,
  params: PropTypes.object
}

AnalyticsTabControl.defaultProps = {
  params: {}
}

export default withRouter(injectIntl(AnalyticsTabControl))

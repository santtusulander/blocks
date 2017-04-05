import React, { PropTypes } from 'react'
import { Link, withRouter } from 'react-router'
import { Nav } from 'react-bootstrap'
import { injectIntl } from 'react-intl'

import * as PERMISSIONS from '../../../constants/permissions'
import IsAllowed from '../../shared/permission-wrappers/is-allowed'

import { getTabLink } from '../../../util/helpers.js'

const PropertyTabControl = (props) => {
  const tabs = [
    {
      key: 'summary',
      label: props.intl.formatMessage({ id: 'portal.content.property.tabs.summary.label' }),
      permission: PERMISSIONS.VIEW_ANALYTICS_TRAFFIC_OVERVIEW
    },
    {
      key: 'purge-status',
      label: props.intl.formatMessage({ id: 'portal.content.property.tabs.purgeStatus.label' }),
      permission: PERMISSIONS.VIEW_PROPERTY_PURGE_STATUS
    }
  ]

  return (
    <Nav bsStyle="tabs">
      {tabs.reduce((lis, tab) => {
        const tabContent = (
          <IsAllowed key={tab.key} to={tab.permission}>
            <li role="tab">
              <Link to={getTabLink(props.location, tab.key)}
                    activeClassName='active'>{tab.label}</Link>
            </li>
          </IsAllowed>
        )
        lis.push(tabContent)
        return lis
      }, [])}
    </Nav>
  )
}

PropertyTabControl.displayName = "PropertyTabControl"
PropertyTabControl.propTypes = {
  intl: PropTypes.object,
  location: PropTypes.object
}

export default withRouter(injectIntl(PropertyTabControl))

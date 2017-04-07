import React from 'react';
import { Link, withRouter } from 'react-router'
import { ButtonToolbar, Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import { MODIFY_PROPERTY, DELETE_PROPERTY } from '../../../constants/permissions'
import IsAllowed from '../../shared/permission-wrappers/is-allowed'

import {
  getAnalyticsUrl,
  getContentUrl,
  getNetworkUrl
} from '../../../util/routes.js'

import PageHeader from '../../shared/layout/page-header'
import { AccountSelector } from '../../drillable-menu/containers'
import TruncatedTitle from '../../shared/page-elements/truncated-title'

import IconTrash from '../../shared/icons/icon-trash.jsx'
import IconChart from '../../shared/icons/icon-chart.jsx'
import IconConfiguration from '../../shared/icons/icon-configuration.jsx'
import IconCaretDown from '../../shared/icons/icon-caret-down'

const PropertyHeader = ({ deleteProperty, params, router, currentTab, togglePurge }) => {

  return (
    <PageHeader pageSubTitle={<FormattedMessage id="portal.properties.propertyContentSummary.text"/>}>
      <AccountSelector
        params={params}
        onItemClick={(entity) => {

          const { nodeInfo, idKey = 'id' } = entity

          const url = router.isActive('network')
            ? getNetworkUrl(nodeInfo.entityType, entity[idKey], nodeInfo.parents)
            : getContentUrl(nodeInfo.entityType, entity[idKey], nodeInfo.parents)

          const isOnPropertyTier = nodeInfo.entityType === 'property'
          // We perform this check to prevent routing to unsupported routes
          // For example, prevent clicking to SP group route (not yet supported)
          if (url) {
            router.push(isOnPropertyTier ? `${url}/${currentTab}` : url)
          }
        }}>
        <div className="btn btn-link dropdown-toggle header-toggle">
          <h1>
            <TruncatedTitle content={params.property}
                            tooltipPlacement="bottom"
                            className="account-property-title"/>
          </h1>
          <IconCaretDown />
        </div>
      </AccountSelector>
      <ButtonToolbar>
        <IsAllowed to={MODIFY_PROPERTY}>
          <Button bsStyle="primary" onClick={togglePurge}><FormattedMessage id="portal.content.property.header.purge.label"/></Button>
        </IsAllowed>
        <Link className="btn btn-success btn-icon"
              to={`${getAnalyticsUrl('property', params.property, params)}`}>
          <IconChart/>
        </Link>
        <Link className="btn btn-success btn-icon"
              to={`${getContentUrl('property', params.property, params)}/configuration`}>
          <IconConfiguration/>
        </Link>
        <IsAllowed to={DELETE_PROPERTY}>
          <Button bsStyle="danger" className="btn-icon" onClick={deleteProperty}>
            <IconTrash/>
          </Button>
        </IsAllowed>
      </ButtonToolbar>
    </PageHeader>
  )
}

PropertyHeader.displayName = "PropertyHeader"
PropertyHeader.defaultProps = {
  currentTab: 'summary'
}
PropertyHeader.propTypes = {
  currentTab: React.PropTypes.string,
  deleteProperty: React.PropTypes.func,
  params: React.PropTypes.object,
  router: React.PropTypes.object,
  togglePurge: React.PropTypes.func
}


export default withRouter(PropertyHeader)

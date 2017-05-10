import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { ButtonToolbar, Button } from 'react-bootstrap'
import { Link, withRouter } from 'react-router'

import PageHeader from '../shared/layout/page-header'
import AccountSelector from '../global-account-selector/account-selector-container'
import TruncatedTitle from '../shared/page-elements/truncated-title'

import IconChart from '../shared/icons/icon-chart.jsx'
import IconCaretDown from '../shared/icons/icon-caret-down'
import IconConfiguration from '../shared/icons/icon-configuration.jsx'
import IsAllowed from '../shared/permission-wrappers/is-allowed'

import * as PERMISSIONS from '../../constants/permissions.js'

import {
  getAnalyticsUrl,
  getContentUrl,
  getNetworkUrl
} from '../../util/routes.js'

const StorageHeader = ({
  params,
  router,
  toggleConfigModal
}) => {

  const { splat, storage } = params
  const accountSelectorTitle = (splat && splat.length > 0) ? splat.split('/').slice(-1).shift() : storage

  return (
    <PageHeader pageSubTitle={<FormattedMessage id="portal.storage.summaryPage.title"/>}>
      <AccountSelector
        params={params}
        onItemClick={(entity) => {

          const { nodeInfo, idKey = 'id' } = entity

          const url = router.isActive('network')
            ? getNetworkUrl(nodeInfo.entityType, entity[idKey], nodeInfo.parents)
            : getContentUrl(nodeInfo.entityType, entity[idKey], nodeInfo.parents)

          if (url) {
            router.push(url)
          }
        }}>
        <div className="btn btn-link dropdown-toggle header-toggle">
          <h1>
            <TruncatedTitle content={accountSelectorTitle}
                            tooltipPlacement="bottom"
                            className="account-property-title"/>
          </h1>
          <IconCaretDown />
        </div>
      </AccountSelector>
      <ButtonToolbar>
        <IsAllowed to={PERMISSIONS.VIEW_ANALYTICS_STORAGE}>
          <Link className="btn btn-primary btn-icon"
                to={`${getAnalyticsUrl('storage', params.storage, params)}`}>
            <IconChart/>
          </Link>
        </IsAllowed>
        {/*TODO: Remove the following false condition once the API for editing ingest_point(CIS-322) is ready*/}
        { false &&
        <IsAllowed to={PERMISSIONS.MODIFY_STORAGE}>
          <Button
            className="btn btn-primary btn-icon"
            onClick={() => {
              toggleConfigModal()
            }}>
            <IconConfiguration/>
          </Button>

        </IsAllowed>
        }
      </ButtonToolbar>
    </PageHeader>
  )
}

StorageHeader.displayName = 'StorageHeader'

StorageHeader.propTypes = {
  params: React.PropTypes.object,
  router: React.PropTypes.object,
  toggleConfigModal: React.PropTypes.func
}

export default withRouter(injectIntl(StorageHeader))

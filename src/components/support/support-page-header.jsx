import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { FormattedMessage } from 'react-intl'

import { getRoute } from '../../util/routes'
import { getUrl, getSupportUrlFromParams } from '../../util/routes'
import PageHeader from '../shared/layout/page-header'
import AccountSelector from '../global-account-selector/account-selector-container'
import IsAllowed from '../shared/permission-wrappers/is-allowed'
import TruncatedTitle from '../shared/page-elements/truncated-title'
import IconCaretDown from '../shared/icons/icon-caret-down'

import * as PERMISSIONS from '../../constants/permissions.js'

const SupportPageHeader = (props) => {
  const {
    activeAccount,
    params,
    router
  } = props;
  const subPage = getTabName(router, params);

  return (
    <PageHeader pageSubTitle={<FormattedMessage id="portal.navigation.support.text"/>}>
      <IsAllowed to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
        <AccountSelector
          params={params}
          levels={[ 'brand', 'account' ]}
          onItemClick={(entity) => {

            const { nodeInfo, idKey = 'id' } = entity
            router.push(`${getUrl(getRoute('support'), nodeInfo.entityType, entity[idKey], nodeInfo.parents)}/${subPage}`)

          }}>
          <div className="btn btn-link dropdown-toggle header-toggle">
            <h1><TruncatedTitle content={activeAccount.get('name') || 'No active account'}
              tooltipPlacement="bottom" className="account-management-title"/></h1>
            <IconCaretDown />
          </div>
        </AccountSelector>
      </IsAllowed>
      <IsAllowed not={true} to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
        <h1>{activeAccount.get('name') || 'No active account'}</h1>
      </IsAllowed>
    </PageHeader>
  )
}

function getTabName(router, params) {
  const baseUrl = getSupportUrlFromParams(params);
  if (router.isActive(`${baseUrl}/tickets`)) {
    return 'tickets';
  } else if (router.isActive(`${baseUrl}/tools`)) {
    return 'tools';
  } else if (router.isActive(`${baseUrl}/documentation`)) {
    return 'documentation';
  }

  return '';
}

SupportPageHeader.displayName = "SupportPageHeader"
SupportPageHeader.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Map),
  params: PropTypes.object,
  router: PropTypes.object
}

export default SupportPageHeader

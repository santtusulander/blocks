import React, { PropTypes } from 'react'
import { Dropdown } from 'react-bootstrap'
import { Map } from 'immutable'

import { getRoute } from '../../routes'
import { getUrl, getSupportUrlFromParams } from '../../util/helpers'
import PageHeader from '../layout/page-header'
import AccountSelector from '../global-account-selector/global-account-selector'
import IsAllowed from '../../components/is-allowed'
import * as PERMISSIONS from '../../constants/permissions.js'

const SupportPageHeader = (props) => {
  const {
    activeAccount,
    params,
    params: {brand, account},
    router
  } = props;
  const subPage = getTabName(router, params);

  return (
    <PageHeader>
      <h5>SUPPORT</h5>
      <IsAllowed to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
        <AccountSelector
          as="support"
          params={{ brand, account }}
          topBarTexts={{ brand: 'UDN Admin' }}
          topBarAction={() => router.push(`${getRoute('support')}/${brand}`)}
          onSelect={(...params) => router.push(`${getUrl(getRoute('support'), ...params)}/${subPage}`)}
          restrictedTo="account">
          <Dropdown.Toggle bsStyle="link" className="header-toggle">
            <h1>{activeAccount.get('name') || 'No active account'}</h1>
          </Dropdown.Toggle>
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

SupportPageHeader.propTypes = {
  account: PropTypes.string,
  activeAccount: React.PropTypes.instanceOf(Map),
  params: PropTypes.object,
  router: PropTypes.object
}

export default SupportPageHeader

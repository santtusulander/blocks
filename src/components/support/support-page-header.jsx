import React, { PropTypes } from 'react'
import { Dropdown } from 'react-bootstrap'
import { Map } from 'immutable'

import { getRoute } from '../../routes'
import { getUrl, getSupportUrlFromParams } from '../../util/helpers'
import PageHeader from '../layout/page-header'
import AccountSelector from '../global-account-selector/global-account-selector'



const SupportPageHeader = (props) => {
  const {
    activeAccount,
    params,
    params: {brand, account},
    router,
    user
  } = props;
  const subPage = getTabName(router, params);

  return (
    <PageHeader>
      <p>SUPPORT</p>
      <AccountSelector
        as="support"
        params={{ brand, account }}
        topBarTexts={{ brand: 'UDN Admin' }}
        topBarAction={() => router.push(`${getRoute('support')}/${brand}`)}
        onSelect={(...params) => router.push(`${getUrl(getRoute('support'), ...params)}/${subPage}`)}
        restrictedTo="account"
        user={user}>
        <Dropdown.Toggle bsStyle="link" className="header-toggle">
          <h1>{activeAccount.get('name') || 'No active account'}</h1>
        </Dropdown.Toggle>
      </AccountSelector>
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
  router: PropTypes.object,
  user: React.PropTypes.instanceOf(Map)
}

export default SupportPageHeader

import React from 'react'
import { FormattedMessage } from 'react-intl';

import PageContainer from '../../../components/shared/layout/page-container'

const AccountManagementSystemUsers = () => {
  return (
    <PageContainer>
      <p className="text-center">
        <FormattedMessage id="portal.user.list.accountNotSelected.text" values={{br: <br/>}}/>
      </p>
    </PageContainer>
  )
}

AccountManagementSystemUsers.displayName = 'AccountManagementSystemUsers'
AccountManagementSystemUsers.propTypes = {}

export default AccountManagementSystemUsers

import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

import {getById as getAccountById} from '../../../redux/modules/entities/accounts/selectors'
import { getFetchingByTag } from '../../../redux/modules/fetching/selectors'

import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'

import {
  ACCOUNT_TYPE_CONTENT_PROVIDER,
  ACCOUNT_TYPE_SERVICE_PROVIDER,
  ACCOUNT_TYPE_CLOUD_PROVIDER
} from '../../../constants/account-management-options'

import { DOCUMENTATION_PATH } from '../../../constants/support-documentation'
import {
  LANGUAGE_CODE_ENGLISH_US,
  LANGUAGE_CODE_ENGLISH_GB,
  LANGUAGE_CODE_CHINESE,
  LANGUAGE_CODE_SPANISH,
  LANGUAGE_CODE_FRENCH
} from '../../../constants/user'

import { getCurrentUser } from '../../../redux/modules/user'


const SupportTabDocumentation = ({ providerType: accountType, locale, isFetching }) => {

  let apiPath = ''
  let documentPath = ''
  let documentationObj = {}

  switch (locale) {
    case LANGUAGE_CODE_CHINESE:
      documentationObj = DOCUMENTATION_PATH.ch
      break;

    case LANGUAGE_CODE_SPANISH:
      documentationObj = DOCUMENTATION_PATH.sp
      break;

    case LANGUAGE_CODE_FRENCH:
      documentationObj = DOCUMENTATION_PATH.fr
      break;

    case LANGUAGE_CODE_ENGLISH:
    default:
      documentationObj = DOCUMENTATION_PATH.en
      break;
  }

  apiPath = documentationObj.purge_and_reporting_api_documentation_link
  switch (accountType) {
    case ACCOUNT_TYPE_CONTENT_PROVIDER:
      documentPath = documentationObj.cp_user_guide_link
      break
    case ACCOUNT_TYPE_SERVICE_PROVIDER:
      // SP should have documentation without purge feature details
      apiPath = documentationObj.reporting_api_documentation_link
      documentPath = documentationObj.sp_user_guide_link
      break
    case ACCOUNT_TYPE_CLOUD_PROVIDER:
      documentPath = documentationObj.cloud_provider_user_guide_link
      break
  }

  if (isFetching) {
    return (<LoadingSpinner/>)
  }

  return (
    <div className="account-support-documentation text-center">
      <div className="section">
        <h3><FormattedMessage id="portal.support.documentation.userGuide.header" /></h3>
        <p className="section-body"><FormattedMessage id="portal.support.documentation.body.text" values={{br: <br/>}} /></p>
        <p>
          <a href={documentPath}
            target="_blank"
            className="btn btn-primary">
            <FormattedMessage id="portal.support.documentation.body.link" />
          </a>
        </p>
      </div>

      <div className="section">
        <h3><FormattedMessage id="portal.support.documentation.APIGuide.header" /></h3>
        <p className="section-body"><FormattedMessage id="portal.support.API.documentation.body.text" values={{br: <br/>}} /></p>
        <p>
          <a href={apiPath}
            target="_blank"
            className="btn btn-primary">
            <FormattedMessage id="portal.support.API.documentation.body.link" />
          </a>
        </p>
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const currentUser = getCurrentUser(state)
  const accountId = currentUser && currentUser.get('account_id')
  const currentAccount = getAccountById(state, accountId)
  const providerType = currentAccount && currentAccount.get('provider_type')
  return {
    locale: currentUser && currentUser.get('locale'),
    providerType,
    isFetching: getFetchingByTag(state, 'account')
  }
}

SupportTabDocumentation.displayName = 'SupportTabDocumentation'
SupportTabDocumentation.propTypes = {
  isFetching: PropTypes.bool,
  locale: PropTypes.string,
  providerType: PropTypes.number
}

export default connect(mapStateToProps)(SupportTabDocumentation)

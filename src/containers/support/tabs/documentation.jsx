import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { fromJS } from 'immutable'
import { connect } from 'react-redux'
import {
  ROLES_MAPPING,
  ACCOUNT_TYPE_CONTENT_PROVIDER,
  ACCOUNT_TYPE_SERVICE_PROVIDER,
  ACCOUNT_TYPE_CLOUD_PROVIDER
} from '../../../constants/account-management-options'

import { DOCUMENTATION_PATH } from '../../../constants/support-documentation'
import {
  LANGUAGE_CODE_ENGLISH,
  LANGUAGE_CODE_CHINESE,
  LANGUAGE_CODE_SPANISH,
  LANGUAGE_CODE_FRENCH
} from '../../../constants/user'

class SupportTabDocumentation extends React.Component {

  render() {
    const { currentUserRole, locale } = this.props
    const role = fromJS(ROLES_MAPPING).find((obj) => {
      return obj.get('id') === currentUserRole
    })

    const accountType = role.get('accountTypes').get(0)

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

    return (
      <div className="account-support-documentation">
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
}

function mapStateToProps(state) {
  const currentUser = state.user.get('currentUser')

  return {
    currentUserRole: currentUser && currentUser.get('roles').get(0),
    locale: currentUser && currentUser.get('locale')
  }
}

SupportTabDocumentation.displayName = 'SupportTabDocumentation'
SupportTabDocumentation.propTypes = {
  currentUserRole: PropTypes.number,
  locale: PropTypes.string
}

export default connect(mapStateToProps)(SupportTabDocumentation)

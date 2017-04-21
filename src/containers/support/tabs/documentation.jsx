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
import {
  ACCOUNT_CONTENT_PROVIDER_USER_GUIDE_PATH,
  ACCOUNT_SERVICE_PROVIDER_USER_GUIDE_PATH,
  ACCOUNT_CLOUD_PROVIDER_USER_GUIDE_PATH,
  API_DOCUMENTATION_PATH
} from '../../../constants/support-documentation'

class SupportTabDocumentation extends React.Component {
  render() {
    const { currentUserRole } = this.props
    const role = fromJS(ROLES_MAPPING).find(obj => obj.get('id') === currentUserRole)
    const accountType = role.get('accountTypes').get(0)

    let documentPath = ""

    switch (accountType) {
      case ACCOUNT_TYPE_CONTENT_PROVIDER:
        documentPath = ACCOUNT_CONTENT_PROVIDER_USER_GUIDE_PATH
        break
      case ACCOUNT_TYPE_SERVICE_PROVIDER:
        documentPath = ACCOUNT_SERVICE_PROVIDER_USER_GUIDE_PATH
        break
      case ACCOUNT_TYPE_CLOUD_PROVIDER:
        documentPath = ACCOUNT_CLOUD_PROVIDER_USER_GUIDE_PATH
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
            <a href={API_DOCUMENTATION_PATH}
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
  return {
    currentUserRole: state.user.get('currentUser').get('roles').get(0)
  };
}

SupportTabDocumentation.displayName = 'SupportTabDocumentation'
SupportTabDocumentation.propTypes = {
  currentUserRole: PropTypes.number
}

export default connect(mapStateToProps)(SupportTabDocumentation)

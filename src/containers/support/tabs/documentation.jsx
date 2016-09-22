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

class SupportTabDocumentation extends React.Component {
  render() {
    const { currentUserRole } = this.props
    const role = fromJS(ROLES_MAPPING).find(obj => obj.get('id') === currentUserRole)
    const accountType = role.get('accountTypes').get(0)

    let documentPath = ""

    switch (accountType) {
      case ACCOUNT_TYPE_CONTENT_PROVIDER:
        documentPath = "/assets/pdf/CP_User_Guide.pdf"
        break
      case ACCOUNT_TYPE_SERVICE_PROVIDER:
        documentPath = "/assets/pdf/SP_User_Guide.pdf"
        break
      case ACCOUNT_TYPE_CLOUD_PROVIDER:
        documentPath = "/assets/pdf/UDN_Admin_Guide.pdf"
        break
    }

    return (
      <div className="account-support-documentation text-center">
        <p className="lead"><FormattedMessage id="portal.support.documentation.body.text" values={{br: <br/>}} /></p>
        <p>
          <a href={documentPath}
            target="_blank"
            className="btn btn-primary">
            <FormattedMessage id="portal.support.documentation.body.link" />
          </a>
        </p>
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
  currentUserRole: PropTypes.number,
  documentPath: PropTypes.string
}

export default connect(mapStateToProps)(SupportTabDocumentation)

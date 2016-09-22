import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { fromJS } from 'immutable'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import {
  ROLES_MAPPING
} from '../../../constants/account-management-options'

class SupportTabDocumentation extends React.Component {
  render() {
    const { currentUserRole } = this.props
    const role = fromJS(ROLES_MAPPING).find(obj => obj.get('id') === currentUserRole)
    const accountType = role.get('accountTypes').get(0)

    let documentPath = ""

    // TODO: replace magic numbers with enums once they're merged
    switch (accountType) {
      case 1:
        documentPath = "/assets/pdf/CP_User_Guide.pdf"
        break
      case 2:
        documentPath = "/assets/pdf/SP_User_Guide.pdf"
        break
      case 3:
        documentPath = "/assets/pdf/UDN_Admin_Guide.pdf"
        break
    }

    return (
      <div className="account-support-documentation">
        <p><FormattedMessage id="portal.support.documentation.body.text" /></p>
        <p>
          <a href={documentPath} target="_blank">
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

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

import './documentation.scss'

class SupportTabDocumentation extends React.Component {
  render() {
    const { currentUserRole } = this.props
    const role = fromJS(ROLES_MAPPING).find(obj => obj.get('id') === currentUserRole)
    const accountType = role.get('accountTypes').get(0)

    let documentPath = ""

    switch (accountType) {
      case ACCOUNT_TYPE_CONTENT_PROVIDER:
        documentPath = "https://docs.google.com/uc?id=0B7P_-quuMHdqNlBLMV9xOG1VY1k&export=pdf"
        break
      case ACCOUNT_TYPE_SERVICE_PROVIDER:
        documentPath = "https://docs.google.com/uc?id=0B7P_-quuMHdqcVlPbkVFTUR5d0U&export=pdf"
        break
      case ACCOUNT_TYPE_CLOUD_PROVIDER:
        documentPath = "https://docs.google.com/uc?id=0B7P_-quuMHdqN0xRLXltY0Zjb1U&export=pdf"
        break
    }

    const APIdocumentPath = "https://doc-0s-6k-docs.googleusercontent.com/docs/securesc/m2osprpdkpsvri3c87mvo1tsj6nmtp71/50n2iuocdlrcgckea2g2thjg8f9tf7ch/1492711200000/05635225967415231415/07254079547932312855/0B9BiKzBEVL3wTHl1eHBMb3hzT2M?e=pdf"

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
            <a href={APIdocumentPath}
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

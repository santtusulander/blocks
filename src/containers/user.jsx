import React, { PropTypes } from 'react'
import { List, Map } from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { injectIntl } from 'react-intl';

import * as uiActionCreators from '../redux/modules/ui'
import * as userActionCreators from '../redux/modules/user'

import { getRolesForUser } from '../util/helpers'

import PageContainer from '../components/layout/page-container'
import PageHeader from '../components/layout/page-header'
import Content from '../components/layout/content'
import UserEditForm from '../components/user/edit-form'

class User extends React.Component {
  constructor(props) {
    super (props);

    this.notificationTimeout = null
    this.saveUser = this.saveUser.bind(this)
    this.savePassword = this.savePassword.bind(this)
    this.showNotification = this.showNotification.bind(this)
  }

  saveUser(user) {
    const message = this.props.intl.formatMessage({id: 'portal.accountManagement.userUpdated.text'})

    return this.props.userActions.updateUser(this.props.currentUser.get('email'), user)
      .then((response) => {
        if (!response.error) {
          this.showNotification(message)
        } else {
          this.props.uiActions.showInfoDialog({
            title: 'Error',
            content: response.payload.data.message,
            okButton: true,
            cancel: () => this.props.uiActions.hideInfoDialog()
          })
        }

        return response
      }
    )
  }

  savePassword(password) {

    const updatePasswordPromise = this.props.userActions.updatePassword(this.props.currentUser.get('email'), password)

    return updatePasswordPromise.then((response) => {
      if (!response.error) {
        this.showNotification(this.props.intl.formatMessage({id: 'portal.accountManagement.passwordUpdated.text'}))
      }

      return response
    })
  }

  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.uiActions.changeNotification(message)
    this.notificationTimeout = setTimeout(this.props.uiActions.changeNotification, 10000)
  }

  render() {
    const { currentUser, roles } = this.props;
    const initialValues = currentUser ? {
      email: currentUser.get('email'),
      first_name: currentUser.get('first_name'),
      last_name: currentUser.get('last_name'),
      middle_name: currentUser.get('middle_name'),
      phone: {phone_number: currentUser.get('phone_number'), phone_country_code: currentUser.get('phone_country_code') },
      timezone: currentUser.get('timezone'),
      tfa_toggle: !!currentUser.get('tfa'),
      tfa: currentUser.get('tfa'),
      changingPassword: false
    } : {}

    return (
      <Content>
        <PageHeader pageSubTitle={'UDN admin'}>
          <h1>{currentUser.get('first_name')} {currentUser.get('last_name')}</h1>
        </PageHeader>
        <PageContainer>
          <UserEditForm
            initialValues={initialValues}
            onSave={this.saveUser}
            onSavePassword={this.savePassword}
            />
        </PageContainer>
      </Content>
    )
  }
}

User.displayName = 'User'
User.propTypes = {
  currentUser: PropTypes.instanceOf(Map),
  intl: PropTypes.object,
  roles: PropTypes.instanceOf(List),
  uiActions: PropTypes.object,
  userActions: PropTypes.object
}

User.defaultProps = {
  currentUser: Map(),
  roles: List()
}

function mapStateToProps(state) {
  return {
    roles: state.roles.get('roles'),
    currentUser: state.user.get('currentUser'),
    userFetching: state.user.get('fetching')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    userActions: bindActionCreators(userActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(User));

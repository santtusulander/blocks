import React, { PropTypes } from 'react'
import { List, Map } from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { injectIntl } from 'react-intl';

import * as uiActionCreators from '../redux/modules/ui'
import * as userActionCreators from '../redux/modules/user'

import { parseResponseError } from '../redux/util'

import roleNameActions from '../redux/modules/entities/role-names/actions'
import { getById as getRoleNameById } from '../redux/modules/entities/role-names/selectors'
import { getCurrentUser } from '../redux/modules/user'

import PageContainer from '../components/shared/layout/page-container'
import PageHeader from '../components/shared/layout/page-header'
import Content from '../components/shared/layout/content'
import UserEditForm from '../components/user/edit-form'

class User extends React.Component {
  constructor(props) {
    super (props);

    this.notificationTimeout = null
    this.saveUser = this.saveUser.bind(this)
    this.savePassword = this.savePassword.bind(this)
    this.showNotification = this.showNotification.bind(this)
  }

  componentWillMount() {
    this.props.fetchRoleNames()
  }

  saveUser(user) {
    const message = this.props.intl.formatMessage({id: 'portal.accountManagement.userUpdated.text'})

    return this.props.userActions.updateUser(this.props.currentUser.get('email'), user)
      .then((response) => {
        if (!response.error) {
          this.showNotification(message)
        } else {
          this.props.uiActions.showInfoDialog({
            title: this.props.intl.formatMessage({id: "portal.errorModal.error.text"}),
            content: parseResponseError(response.payload),
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
    const { currentUser } = this.props;
    const initialValues = currentUser ? {
      email: currentUser.get('email'),
      first_name: currentUser.get('first_name'),
      last_name: currentUser.get('last_name'),
      middle_name: currentUser.get('middle_name'),
      phone_country_code: currentUser.get('phone_country_code'),
      phone_number: currentUser.get('phone_number'),
      full_phone_number: `${currentUser.get('phone_country_code')}${currentUser.get('phone_number')}`,
      timezone: currentUser.get('timezone'),
      tfa_toggle: !!currentUser.get('tfa'),
      tfa: currentUser.get('tfa'),
      changingPassword: false
    } : {}

    return (
      <Content>
        <PageHeader pageSubTitle={this.props.currentUserRoleName}>
          <h1>{currentUser.get('first_name')} {currentUser.get('last_name')}</h1>
        </PageHeader>
        <PageContainer>
          <UserEditForm
            initialTfa={currentUser.get('tfa')}
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
  currentUserRoleName: PropTypes.string,
  fetchRoleNames: PropTypes.func,
  intl: PropTypes.object,
  uiActions: PropTypes.object,
  userActions: PropTypes.object
}

User.defaultProps = {
  currentUser: Map(),
  roles: List()
}

/* istanbul ignore next */
const mapStateToProps = (state) => {
  const currentUser = getCurrentUser(state)
  const currentUserPrimaryRoleId = currentUser && currentUser.get('roles').first()
  const currentUserRoleName = currentUserPrimaryRoleId && getRoleNameById(state, currentUserPrimaryRoleId) ? getRoleNameById(state, currentUserPrimaryRoleId).get('name') : ''

  return {
    currentUserRoleName,
    currentUser,
    userFetching: state.user.get('fetching')
  }
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    userActions: bindActionCreators(userActionCreators, dispatch),

    fetchRoleNames: () => dispatch(roleNameActions.fetchAll({}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(User));

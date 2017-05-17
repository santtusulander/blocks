import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { FormattedMessage } from 'react-intl'

import AccountManagementUserEditForm from './form'

import SidePanel from '../../shared/side-panel'

import { getCheckboxArrayOptions } from '../../../util/group-helpers'
import { getRoleOptionsById , roleIsEditableByCurrentUser } from '../../../util/helpers'

class UserEditModal extends React.Component {
  constructor(props) {
    super(props)

    this.getRoleOptions = this.getRoleOptions.bind(this)
  }

  getRoleOptions() {
    const {roles, user, allowedRoles} = this.props
    const userRoleId = user.getIn(['roles', 0])
    const roleOptions = getRoleOptionsById(roles, userRoleId) || List()
    return roleOptions
            .filter(role => roleIsEditableByCurrentUser(allowedRoles, role.get('id')))
            .map(role => [role.get('id'), role.get('name')]).toJS()
  }

  render() {
    const { user, groups, show, onSave, onCancel } = this.props

    const initialValues = user ? {
      email: user.get('email'),
      role: user.get('roles').toJS().pop(),
      groups: user.get('group_id'),
      first_name: user.get('first_name'),
      last_name: user.get('last_name'),
      full_phone_number: ` ${user.get('phone_country_code')}${user.get('phone_number')}`,
      phone_country_code: user.get('phone_country_code'),
      phone_number: user.get('phone_number')
    } : {}

    const title = <FormattedMessage id='portal.account.editUser.title' />

    return (
      <SidePanel
        show={show}
        title={title}
        cancel={onCancel}
      >
          <AccountManagementUserEditForm
            initialValues={initialValues}
            groupOptions={getCheckboxArrayOptions(groups)}
            roleOptions={this.getRoleOptions()}
            onSave={onSave}
            onCancel={onCancel}
          />
      </SidePanel>
    )
  }
}

UserEditModal.displayName = "UserEditModal"

UserEditModal.propTypes = {
  allowedRoles: PropTypes.instanceOf(List),
  groups: PropTypes.instanceOf(List),
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  roles: PropTypes.instanceOf(List),
  show: PropTypes.bool,
  user: PropTypes.instanceOf(Map)
}

UserEditModal.defaultProps = {
  user: Map(),
  groups: List()
}

export default UserEditModal

import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import UserEditForm from './form'
import { Modal } from 'react-bootstrap'

import { ROLES_MAPPING } from '../../../constants/account-management-options'

import { getCheckboxArrayOptions } from '../../../util/group-helpers'

class UserEditModal extends React.Component {
  constructor(props) {
    super(props)

    this.getRoleOptions = this.getRoleOptions.bind(this)
  }

  getRoleOptions() {
    return ROLES_MAPPING
      .filter(role => role.accountTypes.includes(this.props.accountType))
      .map(mapped_role => [
        mapped_role.id,
        this.props.roles.find(role => role.get('id') === mapped_role.id).get('name')
      ])
  }

  render() {
    const { user, groups, show, onSave, onCancel } = this.props
    const initialValues = user ? {
      email: user.get('email'),
      role: user.get('roles').toJS().pop(),
      groups: user.get('group_id'),
      first_name: user.get('first_name'),
      last_name: user.get('last_name'),
      phone: user.get('phone_country_code') + user.get('phone_number'),
      phone_number: user.get('phone_number'),
      phone_country_code: user.get('phone_country_code')
    } : {}

    return (
      <Modal dialogClassName="user-form-sidebar" show={show}>
        <Modal.Header>
          <h1>Edit User</h1>
        </Modal.Header>

        <Modal.Body>
          <UserEditForm
            initialValues={initialValues}
            groupOptions={getCheckboxArrayOptions(groups)}
            roleOptions={this.getRoleOptions()}
            onSave={onSave}
            onCancel={onCancel}
          />
        </Modal.Body>
      </Modal>
    )
  }
}

UserEditModal.displayName = "UserEditModal"

UserEditModal.propTypes = {
  accountType: PropTypes.number,
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

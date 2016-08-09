import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import UserEditForm from './form'
import { Modal } from 'react-bootstrap'

import { getCheckboxArrayOptions } from '../../../util/group-helpers'

class UserEditModal extends React.Component {
  constructor(props) {
    super(props)

    this.getRolesForUser = this.getRolesForUser.bind(this)
  }

  getRolesForUser(user) {
    let roles = []
    const mappedRoles = this.props.roles.size ?
      user.get('roles').map(roleId => (
        {
          id: roleId,
          name: this.props.roles.find(role => role.get('id') === roleId).get('name')
        }
      )).toJS()
      : []
    mappedRoles.forEach(role => {
      roles.push([role.id, role.name])
    })
    return roles
  }

  render() {
    const { user, groups, show, onSave, onCancel } = this.props
    const initialValues = user ? {
      email: user.get('email'),
      role: user.get('roles').toJS().pop(),
      groups: user.get('group_id'),
      first_name: user.get('first_name'),
      last_name: user.get('last_name'),
      phone_number: user.get('phone_number')
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
            roleOptions={this.getRolesForUser(user)}
            onSave={onSave}
            onCancel={onCancel}
          />
        </Modal.Body>
      </Modal>
    )
  }
}

UserEditModal.propTypes = {
  groups: PropTypes.instanceOf(List),
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  roles: React.PropTypes.instanceOf(List),
  show: PropTypes.bool,
  user: PropTypes.instanceOf(Map)
}

UserEditModal.defaultProps = {
  user: Map(),
  groups: List()
}

export default UserEditModal

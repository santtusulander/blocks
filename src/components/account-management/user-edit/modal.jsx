import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import UserEditForm from './form'
import { Modal } from 'react-bootstrap'

import { getOptions } from '../../../util/group-helpers'


class UserEditModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { user, groups, show, onSave, onCancel } = this.props
    const initialValues = user ? {
      email: user.get('email'),
      roles: user.get('roles').toJS(),
      groups: [user.get('group_id')]
    } : {}

    return (
      <Modal dialogClassName="user-form-sidebar" show={show}>
        <Modal.Header>
          <h1>Edit User</h1>
          <p>Lorem Ipsum dolor</p>
        </Modal.Header>

        <Modal.Body>
          <UserEditForm
            initialValues={initialValues}
            groupOptions={getOptions(groups)}
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
  show: PropTypes.bool,
  user: PropTypes.instanceOf(Map)
}

UserEditModal.defaultProps = {
  user: Map(),
  groups: List()
}

export default UserEditModal

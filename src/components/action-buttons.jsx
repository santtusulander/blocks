import React, {PropTypes} from 'react'
import {Button} from 'react-bootstrap'

import IconEdit from './icons/icon-edit'
import IconTrash from './icons/icon-trash'
import IsAllowed from './is-allowed'

import { ALLOW_ALWAYS } from '../constants/permissions'

const ActionButtons = ({ onEdit, onDelete, permissions }) =>
    <div className='action-buttons'>
      <IsAllowed to={permissions ? permissions.modify : ALLOW_ALWAYS}>
        <Button id='edit-button' onClick={onEdit} className="btn btn-icon btn-primary">
          <IconEdit />
        </Button>
      </IsAllowed>
      <IsAllowed to={permissions ? permissions.delete : ALLOW_ALWAYS}>
        <Button id='delete-button' onClick={onDelete} className="btn btn-icon btn-danger">
          <IconTrash/>
        </Button>
      </IsAllowed>
    </div>

ActionButtons.propTypes = {
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  permissions: PropTypes.object
}

export default ActionButtons

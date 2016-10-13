import React, {PropTypes} from 'react'
import {Button} from 'react-bootstrap'

import IconEdit from './icons/icon-edit.jsx'
import IconTrash from './icons/icon-trash.jsx'

const ActionButtons = props =>
    <div className='action-buttons'>
      {props.onEdit &&
      <Button id='edit-button' onClick={props.onEdit} className="btn btn-icon">
        <IconEdit />
      </Button>
      }
      {props.onDelete &&
      <Button id='delete-button'
        onClick={props.onDelete}
        className="btn btn-icon"
        disabled={props.disabled}>
        <IconTrash/>
      </Button>
      }
    </div>

ActionButtons.propTypes = {
  disabled: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
}

export default ActionButtons

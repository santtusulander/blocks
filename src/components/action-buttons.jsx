import React, {PropTypes} from 'react'
import {Button} from 'react-bootstrap'

import IconEdit from './icons/icon-edit.jsx'
import IconTrash from './icons/icon-trash.jsx'

const ActionButtons = props =>
    <div className='action-buttons'>
      <Button id='edit-button' onClick={props.onEdit} className="btn btn-icon">
        <IconEdit />
      </Button>
      <Button id='delete-button' onClick={props.onDelete} className="btn btn-icon">
        <IconTrash/>
      </Button>
    </div>

ActionButtons.propTypes = {
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
}

export default ActionButtons

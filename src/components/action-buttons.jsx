import React, {PropTypes} from 'react'
import {Button} from 'react-bootstrap'
import classNames from 'classnames'

import IconEdit from './icons/icon-edit.jsx'
import IconTrash from './icons/icon-trash.jsx'

const ActionButtons = ({ disabled, onEdit, onDelete, secondaryBtns }) => {
  let className = classNames(
    'action-buttons',
    {
      'primary': !secondaryBtns,
      'secondary': secondaryBtns
    }
  );

  return (
    <div className={className}>
      {onEdit &&
      <Button id='edit-button' onClick={onEdit} className="btn btn-icon">
        <IconEdit />
      </Button>
      }
      {onDelete &&
      <Button id='delete-button'
        onClick={onDelete}
        className="btn btn-icon"
        disabled={disabled}>
        <IconTrash/>
      </Button>
      }
    </div>
  )
}

ActionButtons.propTypes = {
  disabled: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  secondaryBtns: PropTypes.string
}

export default ActionButtons

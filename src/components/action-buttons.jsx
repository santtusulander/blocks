import React, {PropTypes} from 'react'
import {Button} from 'react-bootstrap'
import classNames from 'classnames'

import IconEdit from './icons/icon-edit.jsx'
import IconTrash from './icons/icon-trash.jsx'
import IconArrowUp from './icons/icon-arrow-up.jsx'
import IconArrowDown from './icons/icon-arrow-down.jsx'

const ActionButtons = ({ arrowDownDisabled, arrowUpDisabled, deleteDisabled, onArrowDown, onArrowUp, onEdit, onDelete, secondaryBtn }) => {
  let className = classNames(
    'action-buttons',
    {
      'primary': !secondaryBtn,
      'secondary': secondaryBtn
    }
  );

  return (
    <div className={className}>
      {onArrowUp &&
      <Button
        id='arrow-down-button'
        onClick={onArrowUp}
        className="btn btn-icon"
        disabled={arrowUpDisabled}>
        <IconArrowUp />
      </Button>
      }

      {onArrowDown &&
      <Button
        id='arrow-up-button'
        onClick={onArrowDown}
        className="btn btn-icon"
        disabled={arrowDownDisabled}>
        <IconArrowDown />
      </Button>
      }

      {onEdit &&
      <Button
        id='edit-button'
        onClick={onEdit}
        className="btn btn-icon">
        <IconEdit />
      </Button>
      }

      {onDelete &&
      <Button
        id='delete-button'
        onClick={onDelete}
        className="btn btn-icon"
        disabled={deleteDisabled}>
        <IconTrash/>
      </Button>
      }
    </div>
  )
}

ActionButtons.propTypes = {
  arrowDownDisabled: PropTypes.String,
  arrowUpDisabled: PropTypes.String,
  deleteDisabled: PropTypes.func,
  onArrowDown: PropTypes.func,
  onArrowUp: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  secondaryBtn: PropTypes.string
}

export default ActionButtons

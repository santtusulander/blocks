import React, {PropTypes} from 'react'
import {Button} from 'react-bootstrap'
import classNames from 'classnames'

import IsAllowed from './is-allowed'
import IconEdit from './icons/icon-edit.jsx'
import IconTrash from './icons/icon-trash.jsx'
import IconArrowUp from './icons/icon-arrow-up.jsx'
import IconArrowDown from './icons/icon-arrow-down.jsx'

import { ALLOW_ALWAYS } from '../constants/permissions'

const ActionButtons = ({ arrowDownDisabled, arrowUpDisabled, className, deleteDisabled, onArrowDown, onArrowUp, onEdit, onDelete, permissions }) => {
  let finalClassName = classNames(
    'action-buttons',
    {
      'primary': !className
    },
    className
  );

  return (
    <div className={finalClassName}>
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
      <IsAllowed to={permissions ? permissions.modify : ALLOW_ALWAYS}>
        <Button
          id='edit-button'
          onClick={onEdit}
          className="btn btn-icon">
          <IconEdit />
        </Button>
      </IsAllowed>
      }

      {onDelete &&
      <IsAllowed to={permissions ? permissions.delete : ALLOW_ALWAYS}>
        <Button
          id='delete-button'
          onClick={onDelete}
          className="btn btn-icon"
          disabled={deleteDisabled}>
          <IconTrash/>
        </Button>
      </IsAllowed>
      }
    </div>
  )
}

ActionButtons.propTypes = {
  arrowDownDisabled: PropTypes.bool,
  arrowUpDisabled: PropTypes.bool,
  className: PropTypes.string,
  deleteDisabled: PropTypes.bool,
  onArrowDown: PropTypes.func,
  onArrowUp: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  permissions: PropTypes.object
}

export default ActionButtons

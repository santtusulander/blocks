import React, {PropTypes} from 'react'
import {Button} from 'react-bootstrap'
import classNames from 'classnames'

import IsAllowed from '../is-allowed'
import IconEdit from './icons/icon-edit.jsx'
import IconTrash from './icons/icon-trash.jsx'
import IconClose from './icons/icon-close.jsx'
import IconArrowUp from './icons/icon-arrow-up.jsx'
import IconArrowDown from './icons/icon-arrow-down.jsx'

import { ALLOW_ALWAYS } from '../../constants/permissions'

function ActionButtons ({ arrowDownDisabled, arrowUpDisabled, className, deleteDisabled, removeDisabled, onArrowDown, onArrowUp, onEdit, onDelete, onRemove, permissions }) {
  const finalClassName = classNames(
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
        onClick={onArrowUp}
        className="btn btn-icon arrow-down-button"
        disabled={arrowUpDisabled}>
        <IconArrowUp />
      </Button>
      }

      {onArrowDown &&
      <Button
        onClick={onArrowDown}
        className="btn btn-icon arrow-up-button"
        disabled={arrowDownDisabled}>
        <IconArrowDown />
      </Button>
      }

      {onEdit &&
      <IsAllowed to={permissions ? permissions.modify : ALLOW_ALWAYS}>
        <Button
          onClick={onEdit}
          className="btn btn-icon edit-button">
          <IconEdit />
        </Button>
      </IsAllowed>
      }

      {onDelete &&
      <IsAllowed to={permissions ? permissions.delete : ALLOW_ALWAYS}>
        <Button
          onClick={onDelete}
          className="btn btn-icon delete-button"
          disabled={deleteDisabled}>
          <IconTrash/>
        </Button>
      </IsAllowed>
      }

      {onRemove &&
      <IsAllowed to={permissions ? permissions.delete : ALLOW_ALWAYS}>
        <Button
          onClick={onRemove}
          className="btn btn-icon remove-button"
          disabled={removeDisabled}>
          <IconClose/>
        </Button>
      </IsAllowed>
      }
    </div>
  )
}

ActionButtons.displayName = "ActionButtons"
ActionButtons.propTypes = {
  arrowDownDisabled: PropTypes.bool,
  arrowUpDisabled: PropTypes.bool,
  className: PropTypes.string,
  deleteDisabled: PropTypes.bool,
  onArrowDown: PropTypes.func,
  onArrowUp: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
  permissions: PropTypes.object,
  removeDisabled: PropTypes.bool
}

export default ActionButtons

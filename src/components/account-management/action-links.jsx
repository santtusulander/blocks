import React, { PropTypes } from 'react'
import IconTrash from '../icons/icon-trash.jsx'

export const ActionLinks = props =>
  <div className="cell-text-center">
    <a className="edit-link" onClick={props.onEdit}>
      EDIT
    </a>
    <a id="delete" onClick={props.onDelete}>
      <IconTrash className="delete-icon"/>
    </a>
  </div>

ActionLinks.propTypes = {
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
}

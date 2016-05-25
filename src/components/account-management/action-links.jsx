import React, { PropTypes } from 'react'
import IconTrash from '../icons/icon-trash.jsx'

export const ActionLinks = props =>
  <div className="cell-text-center">
    <a className="edit-user-link" onClick={props.edit}>
      EDIT
    </a>
    <a onClick={props.delete}>
      <IconTrash className="delete-user-icon"/>
    </a>
  </div>

ActionLinks.propTypes = {
  delete: PropTypes.func,
  edit: PropTypes.func
}

import React, {PropTypes} from 'react'
import {Button} from 'react-bootstrap'

import IconTrash from '../icons/icon-trash.jsx'

const ActionLinks = props =>
    <div className='action-links cell-text-center'>
      <a id='edit-link' className='action-link-edit' onClick={props.onEdit}>EDIT</a>
      <Button onClick={props.onDelete} className="btn-link btn-icon">
        <IconTrash/>
      </Button>
    </div>

ActionLinks.propTypes = {
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
}

export default ActionLinks

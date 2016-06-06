import React, {PropTypes} from 'react'

import UDNButton from '../button.js'
import IconTrash from '../icons/icon-trash.jsx'

const ActionLinks = props =>
    <div className='action-links cell-text-center'>
      <a id='edit-link' className='action-link-edit' onClick={props.onEdit}>EDIT</a>
      <UDNButton id='delete-button' bsStyle='primary' icon={true} onClick={props.onDelete}>
        <IconTrash/>
      </UDNButton>
    </div>

ActionLinks.propTypes = {
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
}

export default ActionLinks

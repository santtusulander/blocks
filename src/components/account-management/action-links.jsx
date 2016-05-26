import React from 'react'

import { ButtonWrapper } from '../button.js'
import IconTrash from '../icons/icon-trash.jsx'

const ActionLinks = (props) => {
  return (
    <div className='actionLinks'>
      <a className='actionLinkEdit' onClick={ props.onEdit } >Edit</a>
      <ButtonWrapper bsStyle='btn-primary' icon='true' onClick={props.onDelete}><IconTrash /></ButtonWrapper>
    </div>
  )
}

export default ActionLinks

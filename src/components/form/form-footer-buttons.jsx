import React, { PropTypes } from 'react'
import { ButtonToolbar } from 'react-bootstrap'

const FormFooterButtons = ({children, deleteBtn}) => {
  return (
    <div className='modal-footer'>
      { deleteBtn &&
        <ButtonToolbar className="pull-left">
          {deleteBtn}
        </ButtonToolbar>
      }
      <ButtonToolbar className="pull-right">
        {children}
      </ButtonToolbar>
    </div>
  )
}

FormFooterButtons.displayName = 'FormFooterButtons'
FormFooterButtons.propTypes = {
  children: PropTypes.array,
  deleteBtn: PropTypes.node
}

export default FormFooterButtons

import React, { PropTypes } from 'react'
import { ButtonToolbar } from 'react-bootstrap'

const FormFooterButtons = ({children}) => {
  return (
    <div className='modal-footer'>
      <ButtonToolbar className="pull-right">
        {children}
      </ButtonToolbar>
    </div>
  )
}

FormFooterButtons.displayName = 'FormFooterButtons'
FormFooterButtons.propTypes = {
  children: PropTypes.array
}

export default FormFooterButtons

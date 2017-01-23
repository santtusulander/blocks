import React, { PropTypes } from 'react'
import { ButtonToolbar } from 'react-bootstrap'

const FormFooterButtons = ({children, autoAlign}) => {
  const footerButtonsElems = autoAlign ? (
    <ButtonToolbar className="pull-right">
      {children}
    </ButtonToolbar>
  ) : children

  return (
    <div className='modal-footer'>
      {footerButtonsElems}
    </div>
  )
}

FormFooterButtons.displayName = 'FormFooterButtons'
FormFooterButtons.propTypes = {
  autoAlign: PropTypes.bool,
  children: PropTypes.array
}
FormFooterButtons.defaultProps = {
  autoAlign: true
}

export default FormFooterButtons

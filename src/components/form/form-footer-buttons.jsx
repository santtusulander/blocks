import React, { PropTypes } from 'react'
import { ButtonToolbar } from 'react-bootstrap'


const getAlignStyle = (val) => {
  const key = 'textAlign'

  return ['left', 'right', 'center'].includes(val)
    ? {[key]: val}
    : {[key]: FormFooterButtons.defaultProps.alignment}
}

const FormFooterButtons = ({children, alignment}) => {
  return (
    <div
      className='modal-footer'
      style={getAlignStyle(alignment)}
    >
      <ButtonToolbar>
        {children}
      </ButtonToolbar>
    </div>
  )
}

FormFooterButtons.displayName = 'FormFooterButtons'
FormFooterButtons.propTypes = {
  alignment: PropTypes.string,
  children: PropTypes.array
}

FormFooterButtons.defaultProps = {
  alignment: 'right'
}

export default FormFooterButtons

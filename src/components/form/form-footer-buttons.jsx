import React, { PropTypes } from 'react'
import { ButtonToolbar } from 'react-bootstrap'


const getAlignStyle = (align) => {
  const alignOptions = ['left', 'right', 'center'];
  const textAlign = alignOptions.includes(align)
    ? align
    : FormFooterButtons.defaultProps.align;

  return { textAlign };
};

const FormFooterButtons = ({children, align}) => {
  const alignItems = getAlignStyle(align);
  return (
    <div
      className='modal-footer'
      style={alignItems}
    >
      <ButtonToolbar>
        {children}
      </ButtonToolbar>
    </div>
  )
}

FormFooterButtons.displayName = 'FormFooterButtons'
FormFooterButtons.propTypes = {
  align: PropTypes.string,
  children: PropTypes.array
}

FormFooterButtons.defaultProps = {
  align: 'right'
}

export default FormFooterButtons

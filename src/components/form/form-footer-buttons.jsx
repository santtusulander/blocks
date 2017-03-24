import React, { PropTypes } from 'react'
import { ButtonToolbar } from 'react-bootstrap'

/** Available aligning options @type {string[]} */
const alignOptions = ['left', 'right', 'center'];

/**
 * Get align direction
 * @param {string} textAlign - one of {@link alignOptions}
 * @return {{textAlign: string}} align
 */
const getAlignStyle = (textAlign) => alignOptions.includes(textAlign) ?
  { textAlign } :
  { textAlign: FormFooterButtons.defaultProps.align };

/**
 * Buttons wrapper with configurable alignment
 * @param {React.element} children - elements to wrap
 * @param {string} align - align direction
 * @return {React.element}
 */
const FormFooterButtons = ({children, align, className}) => {
  const alignItems = getAlignStyle(align);
  return (
    <div className={`modal-footer ${className}`} style={alignItems}>
      <ButtonToolbar>
        {children}
      </ButtonToolbar>
    </div>
  )
}

FormFooterButtons.displayName = 'FormFooterButtons'
FormFooterButtons.propTypes = {
  align: PropTypes.oneOf(alignOptions),
  children: PropTypes.array,
  className: PropTypes.string
}

FormFooterButtons.defaultProps = {
  align: 'right'
}

export default FormFooterButtons

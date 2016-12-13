import React, { PropTypes } from 'react'
import { FormControl, FormGroup, InputGroup, ControlLabel } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

const Input = ({ required = true, addonAfter, labelID, children, isVisible = true, ...inputProps }) =>
  isVisible &&
    <FormGroup>
      <ControlLabel>
        <FormattedMessage id={labelID}/>{required && ' *'}
      </ControlLabel>
      <InputGroup>
        <FormControl {...inputProps}/>
        {addonAfter &&
          <InputGroup.Addon>
            {addonAfter}
          </InputGroup.Addon>}
      </InputGroup>
      {children}
    </FormGroup>

Input.propTypes = {
  addonAfter: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  isVisible: PropTypes.bool,
  labelID: PropTypes.string,
  required: PropTypes.bool
}

export default Input

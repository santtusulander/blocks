import React, { PropTypes } from 'react'
import { FormControl, FormGroup, InputGroup, ControlLabel, HelpBlock } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

const Input = ({ id, className, disabled, required = true, addonAfter, labelID, type = 'text', meta: { error, dirty }, isVisible = true, input }) => {
  return isVisible &&
    <FormGroup controlId={id} validationState={dirty && error ? 'error' : null}>
      <ControlLabel>
        <FormattedMessage id={labelID}/>{required && ' *'}
      </ControlLabel>
      <InputGroup>
        <FormControl
          {...input}
          disabled={disabled}
          className={className}
          componentClass="input"
          type={type}/>
        <FormControl.Feedback />
        {addonAfter &&
          <InputGroup.Addon>
            {addonAfter}
          </InputGroup.Addon>}
      </InputGroup>
      {dirty && error && <HelpBlock className='error-msg' id={id + '-err'}>{error}</HelpBlock>}
    </FormGroup>
}
Input.propTypes = {
  addonAfter: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  isVisible: PropTypes.bool,
  labelID: PropTypes.string,
  required: PropTypes.bool
}

export default Input

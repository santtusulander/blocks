import React, { PropTypes } from 'react'
import { FormControl, FormGroup, InputGroup, ControlLabel, HelpBlock } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

const Input = ({ id, required = true, addonAfter, labelID, type = 'text', meta: { error, touched }, isVisible = true, input }) =>
  isVisible &&
    <FormGroup controlId={id} validationState={(touched && error) && 'error'}>
      <ControlLabel>
        <FormattedMessage id={labelID}/>{required && ' *'}
      </ControlLabel>
      <InputGroup>
        <FormControl componentClass="input" type={type} value={input.value} onChange={input.onChange} />
        <FormControl.Feedback />
        {addonAfter &&
          <InputGroup.Addon>
            {addonAfter}
          </InputGroup.Addon>}
      </InputGroup>
      {touched && error && <HelpBlock className='error-msg' id={id + '-err'}>{error}</HelpBlock>}
    </FormGroup>

Input.propTypes = {
  addonAfter: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  isVisible: PropTypes.bool,
  labelID: PropTypes.string,
  required: PropTypes.bool
}

export default Input

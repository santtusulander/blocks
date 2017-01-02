import React, { PropTypes } from 'react';
import {ControlLabel, FormGroup, FormControl, InputGroup, HelpBlock} from 'react-bootstrap';

import { getReduxFormValidationState } from '../../util/helpers'

const FieldFormGroup  = ({ addonAfter, input, placeholder, type, label, meta: { touched, error }, className, required = true }) => {
  const componentClass = type === 'select' ? 'select' : type === 'textarea' ? 'textarea' : 'input'
  return (
    <FormGroup controlId={input.name} validationState={getReduxFormValidationState(input)}>
      <ControlLabel>{label} {required && ' *'}</ControlLabel>

      <InputGroup>
        <FormControl
          {...input}
          className={className}
          componentClass={componentClass}
          type={type}
          placeholder={placeholder}
          value={input.value}
          onChange={input.onChange}
        />

        <FormControl.Feedback />

        { addonAfter &&
          <InputGroup.Addon>
            {addonAfter}
          </InputGroup.Addon>
        }
      </InputGroup>

      {error && touched &&
        <HelpBlock className='error-msg'>{error}</HelpBlock>
      }
    </FormGroup>
  );
}

FieldFormGroup.propTypes = {
  addonAfter: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  children: PropTypes.object,
  className: PropTypes.string,
  input: PropTypes.object,
  label: PropTypes.object,
  meta: PropTypes.object,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string
}

export default FieldFormGroup

import React, { PropTypes } from 'react';
import {ControlLabel, FormGroup, FormControl, InputGroup, HelpBlock} from 'react-bootstrap';

import { getReduxFormValidationState } from '../../util/helpers'

const FieldFormGroup  = ({ addonAfter, input, placeholder, type, label, meta, className, disabled, ErrorComponent, required }) => {
  const componentClass = type === 'select' ? 'select' : type === 'textarea' ? 'textarea' : 'input'
  return (
    <FormGroup controlId={input.name} validationState={getReduxFormValidationState(input)}>
      {label && <ControlLabel>{label}{required && ' *'}</ControlLabel>}

      <InputGroup>
        <FormControl
          {...input}
          className={className}
          componentClass={componentClass}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
        />

        <FormControl.Feedback />

        { addonAfter &&
          <InputGroup.Addon>
            {addonAfter}
          </InputGroup.Addon>
        }
      </InputGroup>

      {meta.error && meta.touched &&
        <ErrorComponent {...meta}/>
      }
    </FormGroup>
  );
}

FieldFormGroup.displayName = 'FieldFormGroup'

FieldFormGroup.defaultProps = {
  ErrorComponent: ({ error }) => <HelpBlock className='error-msg'>{error}</HelpBlock>,
  required: true
}

FieldFormGroup.propTypes = {
  ErrorComponent: PropTypes.node,
  addonAfter: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  input: PropTypes.object,
  label: PropTypes.object,
  meta: PropTypes.object,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string
}

export default FieldFormGroup

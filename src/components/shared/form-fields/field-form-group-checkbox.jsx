import React, { PropTypes } from 'react';
import {FormGroup, ControlLabel, InputGroup, HelpBlock} from 'react-bootstrap';

import Checkbox from '../form-elements/checkbox.jsx'
import { getReduxFormValidationState } from '../../../util/helpers'

const FieldFormGroupCheckbox  = ({
  addonAfter,
  className,
  input,
  meta,
  meta: {
    touched,
    error
  },
  disabled,
  label,
  required = true
}) => {
  return (
    <FormGroup controlId={input.name} validationState={getReduxFormValidationState(meta)}>
      {label && <ControlLabel>{label}{required && ' *'}</ControlLabel>}

      <InputGroup>
        <Checkbox
          className={className}
          disabled={disabled}
          {...input}
        />

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

FieldFormGroupCheckbox.displayName = 'FieldFormGroupCheckboxes'
FieldFormGroupCheckbox.propTypes = {
  addonAfter: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  input: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  meta: PropTypes.object,
  required: PropTypes.bool
}

export default FieldFormGroupCheckbox

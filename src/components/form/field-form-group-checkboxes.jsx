import React, { PropTypes } from 'react';
import {FormGroup, ControlLabel, InputGroup, HelpBlock} from 'react-bootstrap';

import CheckboxArray from '../checkboxes.jsx'
import { getReduxFormValidationState } from '../../util/helpers'

const FieldFormGroupCheckboxes  = ({ addonAfter, input, meta, meta: { touched, error }, disabled,
  iterable, label, required = true }) => {
  return (
    <FormGroup controlId={input.name} validationState={getReduxFormValidationState(meta)}>
      {label && <ControlLabel>{label}{required && ' *'}</ControlLabel>}

      <InputGroup>
        <CheckboxArray
          disabled={disabled}
          field={input}
          iterable={iterable}
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

FieldFormGroupCheckboxes.displayName = 'FieldFormGroupCheckboxes'
FieldFormGroupCheckboxes.propTypes = {
  addonAfter: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  input: PropTypes.object,
  iterable: PropTypes.array,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  meta: PropTypes.object,
  options: PropTypes.array,
  required: PropTypes.bool
}

export default FieldFormGroupCheckboxes

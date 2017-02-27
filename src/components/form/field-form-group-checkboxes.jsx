import React, { PropTypes } from 'react';
import {FormGroup, ControlLabel, InputGroup, HelpBlock} from 'react-bootstrap';

import CheckboxArray from '../checkboxes.jsx'

const FieldFormGroupCheckboxes = ({
  addonAfter,
  className,
  input,
  meta: {
    dirty,
    error
  },
  disabled,
  iterable,
  label,
  required = true
}) => {
  return (
    <FormGroup controlId={input.name}>
      {label && <ControlLabel>{label}{required && ' *'}</ControlLabel>}

      <InputGroup>
        <CheckboxArray
          className={className}
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
      {error && dirty &&
        <p className='has-error'>
          <HelpBlock className='error-msg'>{error}</HelpBlock>
        </p>
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
  required: PropTypes.bool
}

export default FieldFormGroupCheckboxes

import React, { PropTypes } from 'react';
import {FormGroup, ControlLabel, InputGroup, HelpBlock} from 'react-bootstrap';

import Select from '../select.jsx'
import { getReduxFormValidationState } from '../../util/helpers'

const FieldFormGroupSelect  = ({ addonAfter, input, options, numericValues, className, disabled, meta: { dirty, error }, label }) => {
  return (
    <FormGroup controlId={input.name} validationState={getReduxFormValidationState(input)}>
      <ControlLabel>{label}</ControlLabel>

      <InputGroup>
        <Select
          {...input}
          numericValues={numericValues}
          disabled={disabled}
          className={className}
          onSelect={e => input.onChange(e)}
          options={options}
        />

          { addonAfter &&
            <InputGroup.Addon>
              {addonAfter}
            </InputGroup.Addon>
          }
        </InputGroup>
      {error && dirty &&
        <HelpBlock className='error-msg'>{error}</HelpBlock>
      }
    </FormGroup>
  );
}

FieldFormGroupSelect.propTypes = {
  addonAfter: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  input: PropTypes.object,
  label: PropTypes.object,
  meta: PropTypes.object,
  numericValues: PropTypes.bool,
  options: PropTypes.array
}

export default FieldFormGroupSelect

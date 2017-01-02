import React, { PropTypes } from 'react';
import {FormGroup, ControlLabel, InputGroup, HelpBlock} from 'react-bootstrap';
import Select from '../select.jsx'

const FieldFormGroupSelect  = ({ addonAfter, input, options, numericValues, className, disabled, meta: { dirty, error }, label }) => {
  return (
    <FormGroup controlId={input.name} validationState={dirty && error ? 'error' : null}>
      <ControlLabel>{label}</ControlLabel>

      <InputGroup>
        <Select
          numericValues={numericValues}
          disabled={disabled || false}
          className={className}
          onSelect={e => input.onChange(e)}
          options={options}
          value={input.value} />

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

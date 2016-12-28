import React, { PropTypes } from 'react';
import {FormGroup, ControlLabel, InputGroup, HelpBlock} from 'react-bootstrap';
import Select from '../select.jsx'

const FieldFormGroupSelect  = ({ addonAfter, input, options, numericValues, className, label, disabled, meta: { dirty, touched, error }, children }) => {
  return (
    <FormGroup controlId={input.name} validationState={dirty && error ? 'error' : null}>
      <ControlLabel>{children}</ControlLabel>

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
  children: PropTypes.object,
  input: PropTypes.object,
  label: PropTypes.object,
  meta: PropTypes.object,
  placeholder: PropTypes.string,
  type: PropTypes.string

}

export default FieldFormGroupSelect

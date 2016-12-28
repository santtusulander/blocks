import React, { PropTypes } from 'react';
import {FormGroup, ControlLabel, HelpBlock} from 'react-bootstrap';
import { List } from 'immutable'
import MultiOptionSelector from '../multi-option-selector'

const FieldFormGroupMultiOptionSelector  = ({ input, options, meta: { dirty, touched, error }, className, children }) => {
  return (
    <FormGroup className={className} controlId={input.name} validationState={touched && error ? 'error' : null}>
      <ControlLabel>{children}</ControlLabel>

      <MultiOptionSelector
        options={options}
        field={{
          value: List(input.value||[]),
          onChange: val => input.onChange(val)
        }}
      />

      {error && dirty &&
        <HelpBlock className='error-msg'>{error}</HelpBlock>
      }
    </FormGroup>
  );
}

FieldFormGroupMultiOptionSelector.propTypes = {
  children: PropTypes.object,
  input: PropTypes.object,
  meta: PropTypes.object,
  options: PropTypes.array
}

export default FieldFormGroupMultiOptionSelector

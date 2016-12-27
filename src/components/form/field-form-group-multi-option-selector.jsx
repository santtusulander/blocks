import React, { PropTypes } from 'react';
import {List} from 'immutable'
import {FormGroup, ControlLabel, HelpBlock} from 'react-bootstrap';

import MultiOptionSelector from '../multi-option-selector'

const FieldFormGroupMultiOptionSelector  = ({ input, options, meta: { dirty, touched, error }, children }) => {
  return (
    <FormGroup controlId={input.name} validationState={touched && error ? 'error' : null}>
      <ControlLabel>{children}</ControlLabel>

        <MultiOptionSelector
          options={options}
          field={{
            onChange: val => {input.onChange(val)},
            value: List(input.value||[])
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
  label: PropTypes.object,
  meta: PropTypes.object,
  placeholder: PropTypes.string,
  type: PropTypes.string

}

export default FieldFormGroupMultiOptionSelector

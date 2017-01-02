import React, { PropTypes } from 'react';
import {FormGroup, ControlLabel, HelpBlock} from 'react-bootstrap';
import { List } from 'immutable'
import MultiOptionSelector from '../multi-option-selector'
import { getReduxFormValidationState } from '../../util/helpers'

const FieldFormGroupMultiOptionSelector  = ({ input, options, meta: { dirty, touched, error }, className, label }) => {
  return (
    <FormGroup className={className} controlId={input.name} validationState={getReduxFormValidationState(input)}>
      <ControlLabel>{label}</ControlLabel>

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
  className: PropTypes.string,
  input: PropTypes.object,
  label: PropTypes.object,
  meta: PropTypes.object,
  options: PropTypes.array
}

export default FieldFormGroupMultiOptionSelector

import React, { PropTypes } from 'react';
import {FormGroup, ControlLabel, HelpBlock} from 'react-bootstrap';

import MultiOptionSelector from '../multi-option-selector'

const FieldFormGroupMultiOptionSelector  = ({ input, options, meta: { dirty, touched, error }, className, children }) => {
  return (
    <FormGroup className controlId={input.name} validationState={touched && error ? 'error' : null}>
      <ControlLabel>{children}</ControlLabel>

      <MultiOptionSelector
        options={options}
        value={input.value}
        onChange={val => input.onChange(val)}
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

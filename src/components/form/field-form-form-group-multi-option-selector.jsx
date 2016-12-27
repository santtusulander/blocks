import React, { PropTypes } from 'react';
import {FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';

const FieldFormGroupMultiOptionSelector  = ({ input, placeholder, type, meta: { dirty, touched, error }, children }) => {
  return (
    <FormGroup controlId={input.name} validationState={touched && error ? 'error' : null}>
      <ControlLabel>{children}</ControlLabel>

      <FormControl type={type} placeholder={placeholder} value={input.value} onChange={input.onChange} />
      <FormControl.Feedback />

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

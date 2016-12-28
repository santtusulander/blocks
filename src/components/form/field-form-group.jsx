import React, { PropTypes } from 'react';
import {FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';

const FieldFormGroup  = ({ input, placeholder, type, meta: { dirty, touched, error }, className, children }) => {
  const componentClass = type === 'select' ? 'select' : type === 'textarea' ? 'textarea' : 'input'

  return (
    <FormGroup controlId={input.name} validationState={touched && error ? 'error' : null}>
      <ControlLabel>{children}</ControlLabel>

      <FormControl componentClass={componentClass}
                   className={className}
                   type={type}
                   placeholder={placeholder}
                   value={input.value}
                   onChange={input.onChange} />
      <FormControl.Feedback />

      {error && dirty &&
        <HelpBlock className='error-msg'>{error}</HelpBlock>
      }
    </FormGroup>
  );
}

FieldFormGroup.propTypes = {
  children: PropTypes.object,
  className: PropTypes.string,
  input: PropTypes.object,
  meta: PropTypes.object,
  placeholder: PropTypes.string,
  type: PropTypes.string

}

export default FieldFormGroup

import React, { PropTypes } from 'react';
import {ControlLabel, FormGroup, FormControl, InputGroup, HelpBlock} from 'react-bootstrap';

const FieldFormGroup  = ({ addonAfter, input, placeholder, type, meta: { dirty, touched, error }, className, children, required = true }) => {
  const componentClass = type === 'select' ? 'select' : type === 'textarea' ? 'textarea' : 'input'

  return (
    <FormGroup controlId={input.name} validationState={dirty && error ? 'error' : null}>
      <ControlLabel>{children} {required && ' *'}</ControlLabel>

      <InputGroup>
        <FormControl
          className={className}
          componentClass={componentClass}
          type={type}
          placeholder={placeholder}
          value={input.value}
          onChange={input.onChange}
        />

        <FormControl.Feedback />

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

FieldFormGroup.propTypes = {
  addonAfter: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  children: PropTypes.object,
  input: PropTypes.object,
  meta: PropTypes.object,
  placeholder: PropTypes.string,
  type: PropTypes.string
}

export default FieldFormGroup

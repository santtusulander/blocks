import React, { PropTypes } from 'react'
import { ControlLabel, FormGroup, FormControl, InputGroup } from 'react-bootstrap';

import { getReduxFormValidationState } from '../../util/helpers'
import DefaultErrorBlock from './default-error-block'

const FieldFormGroup = ({ addonAfter, addonBefore, input, placeholder, type, label, inputRef, meta, ErrorComponent, className, disabled, required }) => {

  const componentClass = type === 'select' ? 'select' : type === 'textarea' ? 'textarea' : 'input'
  return (
    <FormGroup controlId={input.name} validationState={getReduxFormValidationState(meta)}>
      {label && <ControlLabel>{label}{required && ' *'}</ControlLabel>}

      <InputGroup>

        {addonBefore &&
          <InputGroup.Addon bsClass="input-group-addon addon-before">
            {addonBefore}
          </InputGroup.Addon>
        }

        <FormControl
          {...input}
          {...{ inputRef }}
          className={className}
          componentClass={componentClass}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
        />

        { addonAfter &&
          <InputGroup.Addon>
            {addonAfter}
          </InputGroup.Addon>
        }
      </InputGroup>

      {meta.error && meta.touched &&
        <ErrorComponent {...meta}/>
      }
    </FormGroup>
  )
}

FieldFormGroup.displayName = 'FieldFormGroup'
FieldFormGroup.defaultProps = {
  ErrorComponent: DefaultErrorBlock,
  required: true
}

FieldFormGroup.propTypes = {
  ErrorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  addonAfter: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  addonBefore: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  input: PropTypes.object,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  meta: PropTypes.object,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string
}

export default FieldFormGroup

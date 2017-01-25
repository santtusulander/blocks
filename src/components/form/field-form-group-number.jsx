import React, { PropTypes } from 'react'
import { ControlLabel, FormGroup, InputGroup } from 'react-bootstrap'

import { getReduxFormValidationState } from '../../util/helpers'
import DefaultErrorBlock from './default-error-block'
import NumberInput from '../number-input'

const FieldFormGroupNumber = ({
  addonAfter,
  addonBefore,
  className,
  disabled,
  input,
  label,
  inputRef,
  meta,
  placeholder,
  required,
  ErrorComponent
}) => {

  return (
    <FormGroup controlId={input.name} validationState={getReduxFormValidationState(meta)}>
      {label && <ControlLabel>{label}{required && ' *'}</ControlLabel>}

      <InputGroup>

        {addonBefore &&
          <InputGroup.Addon bsClass="input-group-addon addon-before">
            {addonBefore}
          </InputGroup.Addon>
        }

        <NumberInput
          {...input}
          {...{ inputRef }}
          className={className}
          disabled={disabled}
          placeholder={placeholder} />


        {addonAfter &&
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

FieldFormGroupNumber.displayName = 'FieldFormGroupNumber'
FieldFormGroupNumber.defaultProps = {
  ErrorComponent: DefaultErrorBlock,
  required: true
}

FieldFormGroupNumber.propTypes = {
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
  required: PropTypes.bool
}

export default FieldFormGroupNumber

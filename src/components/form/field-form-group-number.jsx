import React, { PropTypes } from 'react'
import { ControlLabel, FormGroup, InputGroup } from 'react-bootstrap'

import { getReduxFormValidationState } from '../../util/helpers'
import DefaultErrorBlock from './default-error-block'
import NumberInput from '../number-input'

const FieldFormGroupNumber = ({ addonAfter, input, placeholder, label, inputRef, meta, ErrorComponent, className, disabled, required }) => {

  return (
    <FormGroup controlId={input.name} validationState={getReduxFormValidationState(meta)}>
      {label && <ControlLabel>{label}{required && ' *'}</ControlLabel>}

      <InputGroup>
        <InputGroup className="number-input-group">

          <NumberInput
            {...input}
            {...{ inputRef }}
            className={className}
            disabled={disabled}
            placeholder={placeholder} />

        </InputGroup>

        { addonAfter &&
          <InputGroup.Addon>
            {addonAfter}
          </InputGroup.Addon>
        }

        {meta.error && meta.touched &&
          <ErrorComponent {...meta}/>
        }

      </InputGroup>

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

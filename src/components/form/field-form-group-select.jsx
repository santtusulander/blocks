import React, { PropTypes } from 'react';
import {FormGroup, ControlLabel, InputGroup, HelpBlock} from 'react-bootstrap';

import Select from '../select.jsx'
import { getReduxFormValidationState } from '../../util/helpers'

const FieldFormGroupSelect  = ({ addonAfter, addonBefore, input, options, numericValues, className, disabled, meta, meta: { touched, error }, label, required = true }) => {
  return (
    <FormGroup controlId={input.name} validationState={getReduxFormValidationState(meta)}>
      {label && <ControlLabel>{label}{required && ' *'}</ControlLabel>}
      <InputGroup>
        { addonBefore &&
          <InputGroup.Addon bsClass="input-group-addon addon-before">
            {addonBefore}
          </InputGroup.Addon>
        }

        <Select
          {...input}
          numericValues={numericValues}
          disabled={disabled}
          className={className}
          onSelect={e => {input.onChange(e)}}
          onTouch={e => input.onBlur(e)}
          options={options}
        />

        { addonAfter &&
          <InputGroup.Addon>
            {addonAfter}
          </InputGroup.Addon>
        }
      </InputGroup>

      {error && touched &&
        <HelpBlock className="error-msg">{error}</HelpBlock>
      }
    </FormGroup>
  );
}

FieldFormGroupSelect.displayName = 'FieldFormGroupSelect'
FieldFormGroupSelect.propTypes = {
  addonAfter: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  addonBefore: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  input: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  meta: PropTypes.object,
  numericValues: PropTypes.bool,
  options: PropTypes.array,
  required: PropTypes.bool
}

export default FieldFormGroupSelect

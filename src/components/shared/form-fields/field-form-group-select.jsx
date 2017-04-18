import React, { PropTypes } from 'react';
import {FormGroup, ControlLabel, InputGroup} from 'react-bootstrap';

import Select from '../form-elements/select.jsx'
import { getReduxFormValidationState } from '../../../util/helpers'
import DefaultErrorBlock from '../form-elements/default-error-block'

const FieldFormGroupSelect  = ({ addonAfter, addonAfterLabel, addonBefore,
                                 input, options, numericValues, className,
                                 ErrorComponent, disabled, meta, meta: { touched, error },
                                 label, emptyLabel, required = true, unselectedValue }) => {
  return (
    <FormGroup controlId={input.name} validationState={getReduxFormValidationState(meta)}>
      {label &&
        <ControlLabel>
          {label}{required && ' *'}
          {addonAfterLabel &&
            <InputGroup.Addon className="addon-after-label">
              {addonAfterLabel}
            </InputGroup.Addon>
          }
        </ControlLabel>
      }

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
          onSelect={e => {
            input.onChange(e)
          }}
          onTouch={e => input.onBlur(e)}
          options={options}
          emptyLabel={emptyLabel}
          unselectedValue={unselectedValue}
        />

        { addonAfter &&
          <InputGroup.Addon>
            {addonAfter}
          </InputGroup.Addon>
        }
      </InputGroup>

      {error && touched &&
        <ErrorComponent {...meta}/>
      }
    </FormGroup>
  );
}

FieldFormGroupSelect.displayName = 'FieldFormGroupSelect'

FieldFormGroupSelect.defaultProps = {
  ErrorComponent: DefaultErrorBlock
}

FieldFormGroupSelect.propTypes = {
  ErrorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  addonAfter: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  addonAfterLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  addonBefore: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  emptyLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  input: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  meta: PropTypes.object,
  numericValues: PropTypes.bool,
  options: PropTypes.array,
  required: PropTypes.bool,
  unselectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object])
}

export default FieldFormGroupSelect

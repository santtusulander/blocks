import React, { PropTypes } from 'react';
import {FormGroup, ControlLabel, HelpBlock, InputGroup} from 'react-bootstrap';
import { List } from 'immutable'
import SortableMultiSelector from '../sortable-multi-selector'
import { getReduxFormValidationState } from '../../util/helpers'

const FieldSortableMultiSelector  = ({ addonAfter, addonAfterLabel, addonBefore,
                                              input, options, meta: { touched, error },
                                              className, label, required = true,
                                              disabled = false}) => {
  return (
    <FormGroup className={className} controlId={input.name} validationState={getReduxFormValidationState(input)}>
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

      {addonBefore &&
        <InputGroup.Addon>
          {addonBefore}
        </InputGroup.Addon>
      }

      <SortableMultiSelector
        disabled={disabled}
        options={options}
        {...input}
      />

      {addonAfter &&
        <InputGroup.Addon>
          {addonAfter}
        </InputGroup.Addon>
      }

      {error && touched &&
        <HelpBlock className='error-msg'>{error}</HelpBlock>
      }
    </FormGroup>
  );
}

FieldSortableMultiSelector.displayName = 'FieldSortableMultiSelector'
FieldSortableMultiSelector.propTypes = {
  addonAfter: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  addonAfterLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  addonBefore: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  input: PropTypes.object,
  label: PropTypes.object,
  meta: PropTypes.object,
  options: PropTypes.array,
  required: PropTypes.bool
}

export default FieldSortableMultiSelector

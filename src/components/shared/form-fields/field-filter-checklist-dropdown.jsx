import React, { PropTypes } from 'react';
import {FormGroup, ControlLabel, InputGroup} from 'react-bootstrap';
import { List } from 'immutable'

import FilterChecklistDropdown from '../form-elements/filter-checklist-dropdown'
import DefaultErrorBlock from '../form-elements/default-error-block'

const FieldFilterChecklistDropdown  = ({ addonAfter, addonAfterLabel, addonBefore,
                                 input, options, className, defaultAllSelected,
                                 ErrorComponent, disabled, meta, meta: { touched, error },
                                 label, required = true }) => {
  return (
    <FormGroup controlId={input.name}>
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

        <FilterChecklistDropdown
          {...input}
          defaultAllSelected={defaultAllSelected}
          disabled={disabled}
          className={className}
          options={options}
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

FieldFilterChecklistDropdown.displayName = 'FieldFilterChecklistDropdown'

FieldFilterChecklistDropdown.defaultProps = {
  ErrorComponent: DefaultErrorBlock
}

FieldFilterChecklistDropdown.propTypes = {
  ErrorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  addonAfter: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  addonAfterLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  addonBefore: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  className: PropTypes.string,
  defaultAllSelected: PropTypes.bool,
  disabled: PropTypes.bool,
  input: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  meta: PropTypes.object,
  options: React.PropTypes.instanceOf(List),
  required: PropTypes.bool
}

export default FieldFilterChecklistDropdown

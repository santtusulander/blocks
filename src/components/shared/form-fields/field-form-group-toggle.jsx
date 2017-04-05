import React, { PropTypes } from 'react';
import { FormGroup, ControlLabel, InputGroup } from 'react-bootstrap';
import Toggle from '../form-elements/toggle.jsx'

const FieldFormGroupToggle = ({ addonAfter, addonAfterLabel, addonBefore, input, onToggle, offText = 'OFF', onText = 'ON', className, readonly, label }) => {
  onToggle = onToggle ? onToggle : e => input.onChange(e)
  return (
    <FormGroup controlId={input.name} className={className}>
      <ControlLabel>
        {label}
        {addonAfterLabel &&
          <InputGroup.Addon className="addon-after-label">
            {addonAfterLabel}
          </InputGroup.Addon>
        }
      </ControlLabel>

      {addonBefore &&
        <InputGroup.Addon>
          {addonBefore}
        </InputGroup.Addon>
      }

      <Toggle value={input.value}
              changeValue={onToggle}
              onText={onText}
              offText={offText}
              readonly={readonly}
      />

      {addonAfter &&
        <InputGroup.Addon>
          {addonAfter}
        </InputGroup.Addon>
      }
    </FormGroup>
  );
}

FieldFormGroupToggle.displayName = 'FieldFormGroupToggle'
FieldFormGroupToggle.propTypes = {
  addonAfter: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  addonAfterLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  addonBefore: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  className: PropTypes.string,
  input: PropTypes.object,
  label: PropTypes.object,
  offText: PropTypes.string,
  onText: PropTypes.string,
  onToggle: PropTypes.func,
  readonly: PropTypes.bool
}

export default FieldFormGroupToggle

import React, { PropTypes } from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import Toggle from '../toggle.jsx'

const FieldFormGroupToggle  = ({ input, onToggle, offText, onText, className, readonly, label }) => {
  onToggle = onToggle ? onToggle : e => input.onChange(e)
  return (
    <FormGroup controlId={input.name} className={className}>
      <ControlLabel>{label}</ControlLabel>
      <Toggle value={input.value}
              changeValue={onToggle}
              onText={onText}
              offText={offText}
              readonly={readonly}
      />
    </FormGroup>
  );
}

FieldFormGroupToggle.propTypes = {
  className: PropTypes.string,
  input: PropTypes.object,
  label: PropTypes.object,
  offText: PropTypes.string,
  onText: PropTypes.string,
  onToggle: PropTypes.func,
  readonly: PropTypes.bool
}

export default FieldFormGroupToggle

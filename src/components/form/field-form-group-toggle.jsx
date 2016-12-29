import React, { PropTypes } from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import Toggle from '../toggle.jsx'

const FieldFormGroupToggle  = ({ input, onToggle, offText, onText, className, readonly, children }) => {
  return (
    <FormGroup controlId={input.name} className={className}>
      <ControlLabel>{children}</ControlLabel>
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
  children: PropTypes.object,
  className: PropTypes.string,
  input: PropTypes.object,
  meta: PropTypes.object,
  offText: PropTypes.string,
  onText: PropTypes.string,
  onToggle: PropTypes.func,
  readOnly: PropTypes.bool
}

export default FieldFormGroupToggle

import React, { PropTypes } from 'react';

import Select from './select.jsx'

const SelectWrapper = ({ numericValues, className, onChange, disabled, options, value }) =>
      <Select
        numericValues={numericValues}
        disabled={disabled || false}
        className={className}
        onSelect={e => onChange(e)}
        options={options}
        value={value}
      />

SelectWrapper.displayName = 'SelectWrapper'
SelectWrapper.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  numericValues: PropTypes.bool,
  onChange: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
};

SelectWrapper.defaultProps = {
  options: []
}

export default SelectWrapper

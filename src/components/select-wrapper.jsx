import React, { PropTypes } from 'react';

import Select from './select.jsx'

const SelectWrapper = ({ className, onChange, disabled, options, value }) => {
  return (
      <Select
        disabled={disabled || false}
        className={className}
        onSelect={e => onChange(e)}
        options={options}
        value={value}
      />
  )
}

SelectWrapper.displayName = 'SelectWrapper'
SelectWrapper.propTypes = {
  className: PropTypes.string,
  options: PropTypes.array
};

SelectWrapper.defaultProps = {
  options: []
}

module.exports = SelectWrapper

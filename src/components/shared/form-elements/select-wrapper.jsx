import React, { PropTypes } from 'react';

import Select from './select'

const SelectWrapper = ({ numericValues, className, onChange, disabled, options, value, label }) => {
  const select = (
    <Select
      numericValues={numericValues}
      disabled={disabled || false}
      className={className}
      onSelect={e => onChange(e)}
      options={options}
      value={value} />
  )

  if (label && label !== '') {
    return (
    <div className='form-group'>
      <label className='control-label dropdown-label'>{label}</label>
        {select}
    </div>
    )
  }

  return select
}

SelectWrapper.displayName = 'SelectWrapper'
SelectWrapper.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  numericValues: PropTypes.bool,
  onChange: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
};

SelectWrapper.defaultProps = {
  options: []
}

export default SelectWrapper

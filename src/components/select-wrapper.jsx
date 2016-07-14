import React, { PropTypes } from 'react';

import Select from './select.jsx'

const SelectWrapper = (props) => {
  return (
      <Select
        numericValues={props.numericValues}
        className={ props.className }
        onSelect={ e => props.onChange( e ) }
        options={ props.options }
        value={ props.value }
      />
  )
}

SelectWrapper.displayName = 'SelectWrapper'
SelectWrapper.propTypes = {
  className: PropTypes.string,
  numericValues: PropTypes.bool,
  options: PropTypes.array
};

SelectWrapper.defaultProps = {
  options: []
}

module.exports = SelectWrapper

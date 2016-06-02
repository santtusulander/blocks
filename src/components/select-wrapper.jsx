import React, { PropTypes } from 'react';

import Select from './select.jsx'

const SelectWrapper = (props) => {

  console.log(props)

  return (
      <Select
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
  options: PropTypes.array
};

SelectWrapper.defaultProps = {
  options: []
}

module.exports = SelectWrapper

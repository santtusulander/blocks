import React from 'react';

import { Dropdown, MenuItem } from 'react-bootstrap'

class Select extends React.Component {
  constructor(props) {
    super(props);

    this.selectOption = this.selectOption.bind(this)
    this.selectedOption = ''
  }
  selectOption(e) {
    this.props.onSelect(e.target.getAttribute('data-value'))
  }
  render() {
    let className = 'dropdown-select'
    if(this.props.className) {
      className = className + ' ' + this.props.className
    }
    return (
      <Dropdown id="" className={className}
        onSelect={this.selectOption}>
        <Dropdown.Toggle>
          {this.props.options.find(option =>
            option[0] === this.props.value)[1]}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {this.props.options.map((options, i) =>
            <MenuItem key={i} data-value={options[0]}
              className={this.props.value === options[0] && 'hidden'}>
              {options[1]}
            </MenuItem>
          )}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
Select.displayName = 'Select'
Select.propTypes = {
  className: React.PropTypes.string,
  onSelect: React.PropTypes.func,
  options: React.PropTypes.array,
  value: React.PropTypes.string
};

module.exports = Select

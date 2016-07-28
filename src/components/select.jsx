import React, { PropTypes, Component } from 'react';

import { Dropdown, MenuItem } from 'react-bootstrap'
import IconSelectCaret from '../components/icons/icon-select-caret'

class Select extends Component {
  constructor(props) {
    super(props);

    this.selectOption = this.selectOption.bind(this)
    this.getMenuItem = this.getMenuItem.bind(this)
    this.getOptionLabel = this.getOptionLabel.bind(this)
    this.getOptionValue = this.getOptionValue.bind(this)
    this.getSelected = this.getSelected.bind(this)
  }

  selectOption(e) {
    const value = e.target.getAttribute('data-value')
    this.props.onSelect(this.props.numericValues ? Number(value) : value)
  }

  getMenuItem(option, i) {
    const value = this.getOptionValue(option)
    const label = this.getOptionLabel(option)
    return (
      <MenuItem
        key={i}
        data-value={value}
        className={this.props.value === value && 'hidden'}>
        {label}
      </MenuItem>
    )
  }

  getOptionLabel(option) {
    return Array.isArray(option) ? option[1] : option.label
  }

  getOptionValue(option) {
    return Array.isArray(option) ? option[0] : option.value
  }

  getSelected() {
    return this.props.options.find((option) => {
      return this.getOptionValue(option) === this.props.value
    })
  }

  render() {
    let className = 'dropdown-select'
    if (this.props.className) {
      className = className + ' ' + this.props.className
    }

    const selected = this.getSelected()
    const label = selected ? this.getOptionLabel(selected) : this.props.emptyLabel

    return (
      <Dropdown id="" disabled={this.props.disabled} className={className}
                onSelect={this.selectOption}>
        <Dropdown.Toggle noCaret={true}>
          <IconSelectCaret/>
          {label}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {this.props.options.map(this.getMenuItem)}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
Select.displayName = 'Select'
Select.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  numericValues: PropTypes.bool,
  onSelect: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  emptyLabel: PropTypes.string
}

Select.defaultProps = {
  options: [],
  disabled: false,
  emptyLabel: 'Please Select'
}

export default Select

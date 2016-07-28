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
    this.getOptionIcon = this.getOptionIcon.bind(this)
    this.getSelected = this.getSelected.bind(this)
    this.getSelectedItem = this.getSelectedItem.bind(this)
  }

  selectOption(e, value) {
    this.props.onSelect(this.props.numericValues ? Number(value) : value)
  }

  getMenuItem(option, i) {
    const value = this.getOptionValue(option)
    const label = this.getOptionLabel(option)
    const Icon = this.getOptionIcon(option)

    return (
      <MenuItem
        key={i}
        data-value={value}
        eventKey={value}
        className={this.props.value === value && 'hidden'}>
        {Icon && <div className="dropdown-select__option-icon"><Icon/></div>}
        <div className="dropdown-select__option-label">{label}</div>
      </MenuItem>
    )
  }

  getOptionIcon(option) {
    return Array.isArray(option) ? option[2] : option.icon
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

  getSelectedItem() {
    const selected = this.getSelected()
    const label = selected ? this.getOptionLabel(selected) : this.props.emptyLabel
    const Icon = selected ? this.getOptionIcon(selected) : null

    return (
      <div className="dropdown-select__selected-item">
        {Icon && <div className="dropdown-select__option-icon"><Icon/></div>}
        <div className="dropdown-select__option-label">{label}</div>
      </div>
    )
  }

  render() {
    let className = 'dropdown-select'
    if (this.props.className) {
      className = className + ' ' + this.props.className
    }

    return (
      <Dropdown id="" disabled={this.props.disabled} className={className}
                onSelect={this.selectOption}>
        <Dropdown.Toggle noCaret={true}>
          <IconSelectCaret/>
          {this.getSelectedItem()}
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

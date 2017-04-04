import React, { PropTypes, Component } from 'react';

import { Dropdown, MenuItem } from 'react-bootstrap'
import IconSelectCaret from '../components/shared/icons/icon-select-caret'

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

  selectOption(eventKey) {
    this.props.onSelect(this.props.numericValues ? Number(eventKey) : eventKey)
  }

  getMenuItem(option, i) {
    const value = this.getOptionValue(option)
    const label = this.getOptionLabel(option)
    const icon = this.getOptionIcon(option)

    return (
      <MenuItem
        key={i}
        data-value={value}
        eventKey={value}
        className={this.props.value === value && 'hidden'}>
        {icon && <div className="dropdown-select__option-icon">{icon}</div>}
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
    const icon = selected ? this.getOptionIcon(selected) : null

    return (
      <div className="dropdown-select__selected-item">
        {icon && <div className="dropdown-select__option-icon">{icon}</div>}
        <div className="dropdown-select__option-label">{label}</div>
      </div>
    )
  }

  render() {
    let className = 'dropdown-select'
    if (this.props.className) {
      className = className + ' ' + this.props.className
    }
    const { onTouch, unselectedValue } = this.props
    return (
      <Dropdown id="select" disabled={this.props.disabled} className={className}
                onSelect={this.selectOption} onClose={onTouch}>
        <Dropdown.Toggle noCaret={true} className={this.props.disabled && 'disabled'}>
          <IconSelectCaret/>
          {this.getSelectedItem()}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {(this.getSelected() && (unselectedValue !== undefined)) &&
            <MenuItem eventKey={unselectedValue}>
              <div className="dropdown-select__option-label">
                {this.props.emptyLabel}
              </div>
            </MenuItem>
          }
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
  emptyLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.object]),
  numericValues: PropTypes.bool,
  onSelect: PropTypes.func,
  onTouch: PropTypes.func,
  options: PropTypes.array,
  unselectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object])
}

Select.defaultProps = {
  options: [],
  disabled: false,
  emptyLabel: 'Please Select'
}

export default Select

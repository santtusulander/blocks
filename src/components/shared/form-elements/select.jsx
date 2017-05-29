import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl'

import { Dropdown, MenuItem } from 'react-bootstrap'
import IconSelectCaret from '../icons/icon-select-caret'

class Select extends Component {
  constructor(props) {
    super(props);

    this.selectOption = this.selectOption.bind(this)
    this.getMenuItem = this.getMenuItem.bind(this)
    this.getOptionLabel = this.getOptionLabel.bind(this)
    this.getOptionSecondLabel = this.getOptionSecondLabel.bind(this)
    this.getOptionValue = this.getOptionValue.bind(this)
    this.getOptionIcon = this.getOptionIcon.bind(this)
    this.getSelected = this.getSelected.bind(this)
    this.getSelectedItem = this.getSelectedItem.bind(this)
  }

  componentWillMount() {
    if (this.props.autoselectFirst) {
      this.autoSelectFirstItem(this.props)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.autoselectFirst) {
      this.autoSelectFirstItem(nextProps)
    }
  }

  autoSelectFirstItem(props) {
    const selectedValue = this.getOptionValue(this.getSelected(props))
    if (selectedValue !== this.props.value) {
      this.selectOption(selectedValue)
    }
  }

  selectOption(eventKey) {
    this.props.onSelect(this.props.numericValues ? Number(eventKey) : eventKey)
  }

  getMenuItem(option, i) {
    const value = this.getOptionValue(option)
    const label = this.getOptionLabel(option)
    const secondLabel = this.getOptionSecondLabel(option)
    const icon = this.getOptionIcon(option)

    return (
      <MenuItem
        key={i}
        data-value={value}
        eventKey={value}
        className={this.props.value === value && 'hidden'}>
        {icon && <div className="dropdown-select__option-icon">{icon}</div>}
        <div className="dropdown-select__option-label">{label}</div>
        {secondLabel && <div className="dropdown-select__option-second-label">{secondLabel}</div>}
      </MenuItem>
    )
  }

  getOptionSecondLabel(option) {
    return Array.isArray(option) ? option[3] : option.secondLabel
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

  getSelected(props = this.props) {
    const selected = props.options.find((option) => {
      return this.getOptionValue(option) === props.value
    })

    // Autoselect first option item
    if (props.autoselectFirst && !selected) {
      return props.options[0]
    } else {
      return selected
    }
  }

  getSelectedItem() {
    const selected = this.getSelected()
    const label = selected ? this.getOptionLabel(selected) : this.props.emptyLabel
    const secondLabel = selected ? this.getOptionSecondLabel(selected) : ''
    const icon = selected ? this.getOptionIcon(selected) : null

    return (
      <div className="dropdown-select__selected-item">
        {icon && <div className="dropdown-select__option-icon">{icon}</div>}
        <div className="dropdown-select__option-label">{label}</div>
        {secondLabel && <div>{secondLabel}</div>}
      </div>
    )
  }

  render() {
    let className = 'dropdown-select'
    if (this.props.className) {
      className = className + ' ' + this.props.className
    }
    const { onFocus, onTouch, unselectedValue } = this.props
    return (

      <Dropdown id="select" disabled={this.props.disabled} className={className}
                onSelect={this.selectOption} onClose={onTouch}
                // UDNP-3338 onFocus function comes from underlying input of redux-form Field element
                // and as redux-form uses focus status to hide error messages on Field, I'm passing
                // onFocus to onClick so if there's any error tooltip/message it would disappear
                // whenever user opens select dropdown. This way dropdown select element would behave
                // like any other form element.
                onClick={onFocus}>
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
  autoselectFirst: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  emptyLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.object]),
  numericValues: PropTypes.bool,
  onFocus: PropTypes.func,
  onSelect: PropTypes.func,
  onTouch: PropTypes.func,
  options: PropTypes.array,
  unselectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object])
}

Select.defaultProps = {
  options: [],
  disabled: false,
  emptyLabel: <FormattedMessage id="portal.select.emptyLabel"/>,
  autoselectFirst: false
}

export default Select

import React, { PropTypes, Component } from 'react';
import DatePicker from 'react-datepicker'
import { Dropdown, MenuItem } from 'react-bootstrap'
import IconSelectCaret from '../components/icons/icon-select-caret.jsx'


class DateRangeSelect extends Component {

  constructor(props) {
    super(props);

    this.selectOption   = this.selectOption.bind(this)
    this.toggleDropdown = this.toggleDropdown.bind(this)
    this.selectedOption = ''

    this.state = {
      dropdownOpen: false
    }

  }

  toggleDropdown(val) {
    this.setState({ dropdownOpen: !val })
  }

  selectOption(e) {
    this.props.onSelect(e.target.getAttribute('data-value'))
  }

  render() {

    const { dropdownOpen } = this.state

    let label     = "Please Select"
    let className = 'dropdown-select'

    if(this.props.className) {
      className = className + ' ' + this.props.className
    }
    const currentSelection = this.props.options.find(
      option => option[0] === this.props.value
    )
    if(currentSelection) {
      label = currentSelection[1]
    }

    return (
      <Dropdown id=""
                open={dropdownOpen}
                className={className}
                onSelect={this.selectOption}>
        <Dropdown.Toggle onClick={() => this.toggleDropdown(this.state.dropdownOpen)} noCaret={true}>
          <IconSelectCaret/>
          {label}
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
DateRangeSelect.displayName = 'DateRangeSelect'
DateRangeSelect.propTypes   = {
  className: PropTypes.string,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  options: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

DateRangeSelect.defaultProps = {
  options: []
}

module.exports = DateRangeSelect

import React, { PropTypes, Component } from 'react';

import { Dropdown, MenuItem } from 'react-bootstrap'
import IconSelectCaret from '../../components/icons/icon-select-caret.jsx'

import './heading-dropdown.scss'

class HeadingDropdown extends Component {
  constructor(props) {
    super(props);

    this.selectOption   = this.selectOption.bind(this)
    this.selectedOption = ''
  }

  selectOption(e) {
    this.props.onSelect(e.target.getAttribute('data-value'))
  }

  render() {

    const { options, value, type, defaultLabel } = this.props

    let className = 'heading-dropdown'
    let label     = defaultLabel ? defaultLabel : `Please Select ${type ? type : ''}`

    if(this.props.className) {
      className = className + ' ' + this.props.className
    }

    const currentSelection = options.find(
      option => option[0] === value
    )

    if(currentSelection) {
      label = currentSelection[1]
    }

    return (
      <Dropdown id=""
                className={className}
                onSelect={this.selectOption}>

        <h1 bsRole="toggle">
          <span className="caret-container">
            <IconSelectCaret/>
          </span>
          {label}
        </h1>

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
HeadingDropdown.displayName = 'HeadingDropdown'
HeadingDropdown.propTypes   = {
  className: PropTypes.string,
  defaultLabel: PropTypes.string,
  onSelect: PropTypes.func,
  options: PropTypes.array,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

HeadingDropdown.defaultProps = {
  options: []
}

module.exports = HeadingDropdown

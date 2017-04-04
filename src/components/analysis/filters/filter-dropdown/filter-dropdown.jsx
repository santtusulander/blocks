import React from 'react'
import Immutable from 'immutable'
import { Dropdown, MenuItem } from 'react-bootstrap'
import IconSelectCaret from '../../../../components/icons/icon-select-caret.jsx'

export class FilterDropdown extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dropdownOpen: false,
      filteredResults: this.props.options,
      filterValue: '',
      selectedValue: null
    }

    this.handleSelect = this.handleSelect.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
  }

  toggleDropdown(isOpen) {
    this.setState({ dropdownOpen: !isOpen })
  }

  handleSelect(val) {
    this.setState({
      selectedValue: val
    }, () => {
      this.toggleDropdown(this.state.dropdownOpen)
      this.props.handleSelect(val)
    })
  }

  handleFilter() {
    const inputVal = this.refs.filterInput.value
    const filtered = this.props.options.filter(
      option => option.get('label').toLowerCase().indexOf(inputVal) !== -1
    )

    this.setState({
      filterValue: inputVal,
      filteredResults: filtered
    })
  }

  render() {

    const { dropdownOpen, filteredResults, filterValue, selectedValue } = this.state

    const label     = selectedValue ? selectedValue : 'Please Select'
    let className = 'dropdown-select dropdown-filter btn-block'

    if (this.props.className) {
      className += ` ${this.props.className}`
    }

    if (this.props.parent) {
      className += ' has-parent'
    }

    return (
      <div>
        <Dropdown id=""
                  open={dropdownOpen}
                  className={className}
                  onToggle={() => null}>
          <Dropdown.Toggle onClick={() => this.toggleDropdown(this.state.dropdownOpen)} noCaret={true}>
            <IconSelectCaret/>
            {label}
          </Dropdown.Toggle>
          {dropdownOpen &&
          <div className="filter-container">
            <input
              ref="filterInput"
              type="text"
              placeholder="search"
              className="form-control"
              onChange={this.handleFilter}
              value={filterValue}
            />
          </div>
          }
          <Dropdown.Menu>
            {this.props.parent &&
            <MenuItem className="parent">
              {this.props.parent}
            </MenuItem>
            }
            {filteredResults.map((option, i) =>
              <MenuItem key={i}
                        onClick={() => this.handleSelect(option.get('link'))}
                        className="children">
                {option.get('label')}
              </MenuItem>
            )}

          </Dropdown.Menu>
        </Dropdown>
      </div>
    )
  }
}

FilterDropdown.displayName = 'FilterDropdown'
FilterDropdown.propTypes   = {
  className: React.PropTypes.string,
  handleSelect: React.PropTypes.func,
  options: React.PropTypes.instanceOf(Immutable.List),
  parent: React.PropTypes.string
}

module.exports = FilterDropdown

import React from 'react'
import Immutable from 'immutable'
import { Dropdown, MenuItem, Input } from 'react-bootstrap'
import IconSelectCaret from '../../../../components/icons/icon-select-caret.jsx'

import './filter-checklist-dropdown.scss'

export class FilterChecklistDropdown extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dropdownOpen: false,
      checkedResults: [],
      filteredResults: this.props.options,
      filterValue: ''
    }

    this.handleSelect = this.handleSelect.bind(this)
    this.handleCheck  = this.handleCheck.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
  }

  toggleDropdown(val) {
    this.setState({ dropdownOpen: !val })
  }

  handleSelect(link) {
    this.props.handleSelect(link)
  }

  handleCheck(e) {
    console.log(e.target);
  }

  handleFilter() {
    let inputVal = this.refs.filterInput.value
    let filtered = this.props.options.filter(
      option => option.get('label').toLowerCase().indexOf(inputVal) !== -1
    )

    this.setState({
      filterValue: inputVal,
      filteredResults: filtered
    })
  }

  render() {

    const { dropdownOpen, filteredResults, filterValue } = this.state

    let label     = "Please Select"
    let className = 'dropdown-select dropdown-filter btn-block'

    if(this.props.className) {
      className += ` ${this.props.className}`
    }

    return (
      <div className="form-group">
        <Dropdown id=""
                  open={dropdownOpen}
                  className={className}>
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
              onChange={this.handleFilter}
              value={filterValue}
            />
          </div>
          }
          <Dropdown.Menu>
            {filteredResults.map((option, i) =>
              <li key={i}
                  role="presentation"
                  className="children">
                <Input type="checkbox"
                       label={option.get('label')}
                       value={option.get('label')}
                       onChange={this.handleCheck}/>
              </li>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    )
  }
}

FilterChecklistDropdown.displayName = 'FilterChecklistDropdown'
FilterChecklistDropdown.propTypes   = {
  handleSelect: React.PropTypes.func,
  options: React.PropTypes.instanceOf(Immutable)
}

module.exports = FilterChecklistDropdown

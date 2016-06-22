import React from 'react'
import Immutable from 'immutable'
import { Dropdown, Button, Input } from 'react-bootstrap'
import IconSelectCaret from '../icons/icon-select-caret.jsx'

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

    this.handleCheck  = this.handleCheck.bind(this)
    this.handleClear  = this.handleClear.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.getLabel     = this.getLabel.bind(this)
  }

  toggleDropdown(val) {
    this.setState({ dropdownOpen: !val })
  }

  handleCheck(e) {
    let val     = e.target.value
    let checked = this.state.checkedResults

    if(checked.indexOf(val) === -1) {
      checked.push(val)
    } else {
      checked.splice(checked.indexOf(val), 1)
    }
    this.setState({ checkedResults: checked })
    this.props.handleCheck(this.state.checkedResults)
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

  handleClear() {
    this.setState({
      checkedResults: []
    }, () => this.props.handleCheck(this.state.checkedResults))
  }

  getLabel() {
    return this.state.checkedResults.length > 1 ? `${this.state.checkedResults[0]} and ${this.state.checkedResults.length - 1} more` : this.state.checkedResults[0]
  }

  render() {

    const { dropdownOpen, filteredResults, filterValue, checkedResults } = this.state

    let label     = checkedResults.length ? this.getLabel() : 'Please Select'
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
            <li>
              <ul className='scrollable-menu'>
                {filteredResults.map((option, i) =>
                  <li key={i}
                      role="presentation"
                      className="children">
                    <Input type="checkbox"
                           label={option.get('label')}
                           value={option.get('value')}
                           checked={checkedResults.indexOf(option.get('value')) !== -1}
                           onChange={this.handleCheck}/>
                  </li>
                )}
              </ul>
              <li className="clear-container">
                <Button bsClass="btn btn-block btn-primary"
                        onClick={this.handleClear}>Clear</Button>
              </li>
            </li>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    )
  }
}

FilterChecklistDropdown.displayName = 'FilterChecklistDropdown'
FilterChecklistDropdown.propTypes   = {
  handleCheck: React.PropTypes.func,
  options: React.PropTypes.instanceOf(Immutable)
}

module.exports = FilterChecklistDropdown

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
      checkedResults: this.props.options.filter(item => !!item.get('checked')),
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

  handleCheck(option) {
    let checked = this.state.checkedResults

    let newlist = checked.indexOf(option) === -1 ? checked.push(option) : checked.delete(checked.indexOf(option))

    this.setState({ checkedResults: newlist })
    const vals = newlist.map( option => {
      return option.get('value')
    })

    this.props.handleCheck(vals)
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
      checkedResults: Immutable.List()
    }, () => this.props.handleCheck(this.state.checkedResults))
  }

  getLabel() {
    return this.state.checkedResults.size > 1 ? `${this.state.checkedResults.first().get('label')} and ${this.state.checkedResults.size - 1} more` : this.state.checkedResults.first().get('label')
  }

  render() {

    const { dropdownOpen, filteredResults, filterValue, checkedResults } = this.state

    let itemList;
    let label     = checkedResults.size ? this.getLabel() : 'Please Select'
    let className = 'dropdown-select dropdown-filter dropdown-checklist btn-block'

    if(this.props.className) {
      className += ` ${this.props.className}`
    }

    if(filteredResults.size) {
      itemList = filteredResults.map((option, i) => {
        return (
          <li key={i}
              role="presentation"
              className="children">
            <Input type="checkbox"
                   label={option.get('label')}
                   value={option.get('value')}
                   checked={checkedResults.indexOf(option) !== -1}
                   onChange={() => this.handleCheck(option)}/>
          </li>
        )
      })
    } else {
      itemList = (
        <li role="presentation" className="children">
          <div className="form-group">No results...</div>
        </li>
      )
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
              className="form-control"
              onChange={this.handleFilter}
              value={filterValue}
            />
          </div>
          }
          <Dropdown.Menu>
            <li>
              <ul className='scrollable-menu'>
                {itemList}
              </ul>
            </li>
            <li className="clear-container">
              <Button bsClass="btn btn-block btn-primary"
                      onClick={this.handleClear}>Clear</Button>
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

import React from 'react'
import {List} from 'immutable'
import { Dropdown, Button, Input } from 'react-bootstrap'
import IconSelectCaret from '../icons/icon-select-caret.jsx'

import './filter-checklist-dropdown.scss'

export class FilterChecklistDropdown extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dropdownOpen: false,
      filteredResults: this.props.options,
      filterValue: ''
    }

    this.handleCheck  = this.handleCheck.bind(this)
    this.handleClear  = this.handleClear.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.getLabel     = this.getLabel.bind(this)
    this.getFilteredResults = this.getFilteredResults.bind(this)
  }

  toggleDropdown(val) {
    this.setState({ dropdownOpen: !val })
  }

  handleCheck(optionVal) {
    let newVals = List()
    if(optionVal !== 'all') {
      const valIndex = this.props.values.indexOf(optionVal)
      newVals = valIndex === -1 ?
        this.props.values.push(optionVal) :
        this.props.values.delete(valIndex)
    }
    else {
      newVals = this.props.values.size === this.props.options.size ? List() : this.props.options.map(val => val.get('value'))
    }
    this.props.handleCheck(newVals)

  }

  handleFilter() {
    let inputVal = this.refs.filterInput.value

    this.setState({
      filterValue: inputVal
    })
  }

  getFilteredResults() {
    let inputVal = this.state.filterValue
    if(this.state.filterValue.length) {
      return this.props.options.filter(
        option => option.get('label').toLowerCase().indexOf(inputVal) !== -1
      )
    }
    else {
      return this.props.options
    }
  }

  handleClear() {
    this.setState({filterValue: ''})
    this.props.handleCheck(List())
  }

  getLabel() {
    const numVals = this.props.values.size
    const labels = this.props.options
      .filter(opt => this.props.values.indexOf(opt.get('value')) !== -1)
      .map(opt => opt.get('label'))
    if(!numVals || !labels.size) {
      return 'Please Select'
    }
    else if(numVals === 1) {
      return labels.first()
    }
    else if(numVals === this.props.options.size){
      return `ALL (${this.props.options.size})`
    }
    else{
      return `${labels.first()} and ${numVals - 1} more`
    }
  }

  render() {

    const { dropdownOpen, filterValue } = this.state
    const filteredResults = this.getFilteredResults()

    let itemList;
    let className = 'dropdown-select dropdown-filter dropdown-checklist btn-block'

    if(this.props.className) {
      className += ` ${this.props.className}`
    }

    if(filteredResults.size) {
      itemList = filteredResults.size === this.props.options.size ? List([
        <li
            key="all"
            role="presentation"
            className="children">
          <Input type="checkbox"
                 label={`SELECT ALL (${this.props.options.size})`}
                 value="all"
                 checked={this.props.values.size === this.props.options.size}
                 onChange={() => this.handleCheck("all")}/>
        </li>
      ]) : List()

      itemList = itemList.concat(filteredResults.map((option, i) => {
        return (
          <li key={i}
              role="presentation"
              className="children">
            <Input type="checkbox"
                   label={option.get('label')}
                   value={option.get('value')}
                   checked={this.props.values.indexOf(option.get('value')) !== -1}
                   onChange={() => this.handleCheck(option.get('value'))}/>
          </li>
        )
      }))
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
            {this.getLabel()}
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
  className: React.PropTypes.string,
  handleCheck: React.PropTypes.func,
  options: React.PropTypes.instanceOf(List),
  values: React.PropTypes.instanceOf(List)
}

FilterChecklistDropdown.defaultProps = {
  options: List(),
  values: List()
}

export default FilterChecklistDropdown

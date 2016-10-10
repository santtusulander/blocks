import React from 'react'
import { findDOMNode } from 'react-dom'
import { List } from 'immutable'
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
    this.handleClick  = this.handleClick.bind(this)
    this.handleClear  = this.handleClear.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.getLabel     = this.getLabel.bind(this)
    this.getFilteredResults = this.getFilteredResults.bind(this)
  }

  componentWillMount() {
    document.addEventListener('click', this.handleClick, false)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false)
  }

  handleClick(e) {
    !findDOMNode(this).contains(e.target) && this.state.dropdownOpen &&
      this.setState({ dropdownOpen: false })
  }

  toggleDropdown(val) {
    this.setState({ dropdownOpen: !val })
  }

  handleCheck(optionVal) {
    let newVals = List()
    if(optionVal !== 'all') {
      const valIndex = this.props.value.indexOf(optionVal)
      newVals = valIndex === -1 ?
        this.props.value.push(optionVal) :
        this.props.value.delete(valIndex)
    }
    else {
      newVals = this.props.value.size === this.props.options.size ? List() : this.props.options.map(val => val.get('value'))
    }
    if(this.props.handleCheck) {
      this.props.handleCheck(newVals)
    } else {
      this.props.onChange(newVals)
    }

  }

  handleFilter() {
    let inputVal = this.refs.filterInput.getValue()

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

    if (this.props.handleCheck) {
      this.props.handleCheck(List())
    } else {
      this.props.onChange(List())
    }
  }

  getLabel() {
    const numVals = this.props.value.size
    const labels = this.props.options
      .filter(opt => this.props.value.indexOf(opt.get('value')) !== -1)
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
            className="children"
            tabIndex="-1">
          <Input type="checkbox"
                 label={`SELECT ALL (${this.props.options.size})`}
                 value="all"
                 checked={this.props.value.size === this.props.options.size}
                 onChange={() => this.handleCheck("all")}/>
        </li>,
        this.props.children && this.props.children.map(child => child)
      ]) : List()

      itemList = itemList.concat(filteredResults.map((option, i) => {
        return (
          <li key={i}
              role="presentation"
              className="children"
              tabIndex="-1">
            <Input type="checkbox"
                   label={option.get('label')}
                   value={option.get('value')}
                   checked={this.props.value.indexOf(option.get('value')) !== -1}
                   onChange={() => this.handleCheck(option.get('value'))}/>
          </li>
        )
      }))
    } else {
      itemList = (
        <li role="presentation" className="children" tabIndex="-1">
          <div className="form-group">No results...</div>
        </li>
      )
    }

    return (
      <div className="form-group">
        <Dropdown id=""
                  defaultOpen={dropdownOpen}
                  className={className}>
          <Dropdown.Toggle disabled={this.props.disabled} onClick={() => this.toggleDropdown(this.state.dropdownOpen)} noCaret={true}>
            <IconSelectCaret/>
            {this.getLabel()}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {dropdownOpen &&
              <li role="presentation" className="action-container">
                <Input
                  ref="filterInput"
                  className="header-search-input"
                  type="text"
                  onChange={this.handleFilter}
                  value={filterValue}
                  placeholder="Search"
                />
            </li>
            }
            <li>
              <ul className='scrollable-menu'>
                {itemList}
              </ul>
            </li>
            {!this.props.noClear &&
              <li role="presentation" className="action-container">
                <Button bsClass="btn btn-block btn-primary"
                      onClick={this.handleClear}>Clear</Button>
              </li>
            }
          </Dropdown.Menu>
        </Dropdown>
      </div>
    )
  }
}

FilterChecklistDropdown.displayName = 'FilterChecklistDropdown'
FilterChecklistDropdown.propTypes   = {
  children: React.PropTypes.array,
  className: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  handleCheck: React.PropTypes.func,
  noClear: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  options: React.PropTypes.instanceOf(List),
  value: React.PropTypes.instanceOf(List)
}

FilterChecklistDropdown.defaultProps = {
  options: List(),
  value: List()
}

export default FilterChecklistDropdown

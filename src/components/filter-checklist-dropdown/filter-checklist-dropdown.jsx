import React from 'react'
import { List } from 'immutable'
import { Dropdown, Button, FormControl, FormGroup } from 'react-bootstrap'
import IconSelectCaret from '../icons/icon-select-caret.jsx'
import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'

import autoClose from '../../decorators/select-auto-close'
import Checkbox from '../checkbox'

export class FilterChecklistDropdown extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      filteredResults: this.props.options,
      filterValue: ''
    }

    this.handleCheck  = this.handleCheck.bind(this)
    this.handleClear  = this.handleClear.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.getLabel     = this.getLabel.bind(this)
    this.getFilteredResults = this.getFilteredResults.bind(this)
  }

  handleCheck(optionVal) {
    const initialVals = this.props.value
    let newVals = List()

    if (optionVal !== 'all') {
      const valIndex = initialVals.indexOf(optionVal)

      newVals = valIndex === -1 ?
        initialVals.push(optionVal) :
        initialVals.delete(valIndex)
    }    else {
      newVals = this.props.value.size === this.props.options.size ? List() : this.props.options.map(val => val.get('value'))
    }
    if (this.props.handleCheck) {
      this.props.handleCheck(newVals)
    } else {
      this.props.onChange(newVals)
    }

  }

  handleFilter() {
    this.setState({
      filterValue: this.filterInput.value
    })
  }

  getFilteredResults() {
    const inputVal = this.state.filterValue.toLowerCase()
    if (this.state.filterValue.length) {
      return this.props.options.filter(
        option => option.get('label').toString().toLowerCase().indexOf(inputVal) !== -1
      )
    }    else {
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
    if (!numVals || !labels.size) {
      return <FormattedMessage id="portal.analytics.dropdownMenu.all" values={{options: this.props.options.size}}/>
    }    else if (numVals === 1) {
      return labels.first()
    }    else if (numVals === this.props.options.size) {
      return <FormattedMessage id="portal.analytics.dropdownMenu.all" values={{options: this.props.options.size}}/>
    }    else {
      return <FormattedMessage id="portal.analytics.dropdownMenu.labelsSelected" values={{firstLabel: labels.first(), rest: numVals - 1}}/>
    }
  }
  render() {
    const { state: { filterValue }, props: { open, toggle } } = this
    const filteredResults = this.getFilteredResults()

    let itemList = List();
    let className = 'dropdown-select dropdown-filter dropdown-checklist btn-block'

    if (this.props.className) {
      className += ` ${this.props.className}`
    }

    if (filteredResults.size) {
      if (!this.state.filterValue.length) {
        itemList = itemList.concat([
          this.props.children && this.props.children.map(child => child)
        ])
      }

      itemList = itemList.concat(filteredResults.map((option, i) =>
        (
          <li key={i}
            role="presentation"
            className="children"
            tabIndex="-1">
            <FormGroup>
              <Checkbox
                value={option.get('value')}
                checked={this.props.value.indexOf(option.get('value')) !== -1}
                onChange={() => this.handleCheck(option.get('value'))}>
                {option.get('label')}
              </Checkbox>
            </FormGroup>
          </li>
        )
      ))
    } else {
      itemList = (
        <li role="presentation" className="children" tabIndex="-1">
          <div className="form-group checkbox">
            <label>
              <FormattedMessage id="portal.analytics.dropdownMenu.noResults"/>
            </label>
          </div>
        </li>
      )
    }

    return (
      <div className="form-group">
        <Dropdown
          id="filter-checklist-dropdown"
          disabled={this.props.disabled}
          open={open}
          onToggle={() => {/*because we pass an open-prop, this needs a handler or react-bs throws a failed proptype-warning.*/}}
          className={className}>
          <Dropdown.Toggle disabled={this.props.disabled} onClick={toggle} noCaret={true}>
            <IconSelectCaret/>
            {this.getLabel()}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {open &&
              <li role="presentation" className="action-container">
                <FormControl
                  inputRef={ref => {
                    this.filterInput = ref 
                  }}
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
            <li key="all"
                role="presentation"
                className="children"
                tabIndex="-1">
              <Button onClick={() => this.handleClear()}
                className={
                  classNames(
                    'dropdown-toggle',
                    'clear-selection',
                    {'hidden': this.props.value.size === this.props.options.size || this.props.value.size === 0}
                  )
                }>
                <FormattedMessage id="portal.analytics.dropdownMenu.clearSelections"/>
              </Button>
            </li>
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
  onChange: React.PropTypes.func,
  open: React.PropTypes.bool,
  options: React.PropTypes.instanceOf(List),
  toggle: React.PropTypes.func,
  value: React.PropTypes.instanceOf(List)
}

FilterChecklistDropdown.defaultProps = {
  options: List(),
  value: List()
}

export default autoClose(FilterChecklistDropdown)

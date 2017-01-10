import React, { PropTypes } from 'react'
import { List } from 'immutable'
import { FormGroup, Checkbox } from 'react-bootstrap'

import FilterChecklistDropdown from '../filter-checklist-dropdown/filter-checklist-dropdown.jsx'

function StatusCodes({ errorCodesOnly, options, values, onChange }) {
  const
    isChecked = option =>
    option.filter(option => values.findIndex(value => value === option) >= 0).length === option.length,
    fiveHundreds = [500, 501, 502, 503],
    fourHundreds = [400, 401, 402, 403, 404, 405, 411, 412, 413],
    twoHundreds = [200, 201, 202, 204],
    twoHundredsChecked = isChecked(twoHundreds),
    fourHundredsChecked = isChecked(fourHundreds),
    fiveHundredsChecked = isChecked(fiveHundreds),
    handleCheck = (optionValue, checked) => () => {
      if(checked) {
        values = values.size === options.size ?
          values.filterNot(value => optionValue.findIndex(selected => selected === value) < 0) :
          values.filter(value => optionValue.findIndex(selected => selected === value) < 0)
      } else {
        optionValue.forEach(item => {
          if(!values.includes(item)) {
            values = values.push(item)
          }
        })
      }
      onChange(values)
    }
  return (
    <FilterChecklistDropdown
      options={options}
      value={values.size === options.size ? List() : values}
      handleCheck={onChange}>
      {!errorCodesOnly &&
      <li role="presentation" className="children">
        <FormGroup>
          <Checkbox
            value={twoHundreds}
            checked={twoHundredsChecked && values.size !== options.size}
            onChange={handleCheck(twoHundreds, twoHundredsChecked)}>
            <span>2XX</span>
          </Checkbox>
        </FormGroup>
      </li>
    }
    <li role="presentation" className="children">
      <FormGroup>
        <Checkbox
          value={fourHundreds}
          checked={fourHundredsChecked && values.size !== options.size}
          onChange={handleCheck(fourHundreds, fourHundredsChecked)}>
          <span>4XX</span>
        </Checkbox>
      </FormGroup>
    </li>
    <li role="presentation" className="children">
      <FormGroup>
        <Checkbox
          value={fiveHundreds}
          checked={fiveHundredsChecked && values.size !== options.size}
          onChange={handleCheck(fiveHundreds, fiveHundredsChecked)}>
          <span>5XX</span>
        </Checkbox>
      </FormGroup>
      </li>
    </FilterChecklistDropdown>
  )
}

StatusCodes.displayName = "StatusCodes"
StatusCodes.propTypes = {
  errorCodesOnly: PropTypes.bool,
  onChange: PropTypes.func,
  options: PropTypes.instanceOf(List),
  values: PropTypes.instanceOf(List)
}

export default StatusCodes

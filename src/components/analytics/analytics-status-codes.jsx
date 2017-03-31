import React, { PropTypes } from 'react'
import { List } from 'immutable'
import { FormGroup, Checkbox } from 'react-bootstrap'

import FilterChecklistDropdown from '../filter-checklist-dropdown/filter-checklist-dropdown.jsx'

function StatusCodes({ errorCodesOnly, options, values, onChange }) {
  const
    isChecked = option =>
    option.filter((singleOption) => values.findIndex(value => value === singleOption) >= 0).length === option.length,
    fiveHundreds = [500, 501, 502, 503],
    fourHundreds = [400, 401, 402, 403, 404, 405, 411, 412, 413],
    twoHundreds = [200, 201, 202, 204],
    twoHundredsChecked = isChecked(twoHundreds),
    fourHundredsChecked = isChecked(fourHundreds),
    fiveHundredsChecked = isChecked(fiveHundreds),
    handleCheck = (optionValue, checked) => () => {
      if (checked) {
        values = values.filter(value => optionValue.findIndex(selected => selected === value) < 0)
      } else {
        if (values.size !== options.size) {
          optionValue.forEach(item => {
            if(!values.includes(item)) {
              values = values.push(item)
            }
          })
        } else {
          values = values.filterNot(value => optionValue.findIndex(selected => selected === value) < 0)
        }
      }
      onChange(values)
    }
  return (
    <FilterChecklistDropdown
      options={options}
      value={values}
      handleCheck={onChange}>
      {!errorCodesOnly &&
      <li role="presentation" className="children">
        <FormGroup>
          <Checkbox
            value={twoHundreds}
            checked={twoHundredsChecked}
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
          checked={fourHundredsChecked}
          onChange={handleCheck(fourHundreds, fourHundredsChecked)}>
          <span>4XX</span>
        </Checkbox>
      </FormGroup>
    </li>
    <li role="presentation" className="children">
      <FormGroup>
        <Checkbox
          value={fiveHundreds}
          checked={fiveHundredsChecked}
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

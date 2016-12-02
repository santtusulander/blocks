import React, { PropTypes } from 'react'
import { List } from 'immutable'
import { Checkbox } from 'react-bootstrap'

import FilterChecklistDropdown from '../filter-checklist-dropdown/filter-checklist-dropdown.jsx'

const StatusCodes = ({ errorCodesOnly, options, values, onChange }) => {
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
        values = values.filter(value => optionValue.findIndex(selected => selected === value) < 0)
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
      noClear={true}
      options={options}
      value={values}
      handleCheck={onChange}>
      {!errorCodesOnly &&
      <li role="presentation" className="children">
        <Checkbox
          value={twoHundreds}
          checked={twoHundredsChecked}
          onChange={handleCheck(twoHundreds, twoHundredsChecked)}>
          2XX
        </Checkbox>
      </li>
    }
    <li role="presentation" className="children">
      <Checkbox
        value={fourHundreds}
        checked={fourHundredsChecked}
        onChange={handleCheck(fourHundreds, fourHundredsChecked)}>
        4XX
      </Checkbox>
    </li>
    <li role="presentation" className="children">
      <Checkbox
        value={fiveHundreds}
        checked={fiveHundredsChecked}
        onChange={handleCheck(fiveHundreds, fiveHundredsChecked)}>
        5XX
      </Checkbox>
      </li>
    </FilterChecklistDropdown>
  )
}

StatusCodes.propTypes = {
  errorCodesOnly: PropTypes.bool,
  onChange: PropTypes.func,
  options: PropTypes.instanceOf(List),
  values: PropTypes.instanceOf(List)
}

export default StatusCodes

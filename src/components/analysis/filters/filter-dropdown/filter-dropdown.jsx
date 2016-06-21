import React from 'react'
import moment from 'moment'
import { Dropdown, MenuItem } from 'react-bootstrap'
import IconSelectCaret from '../../../../components/icons/icon-select-caret.jsx'

import './filter-dropdown.scss'

export class ChecklistFilter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dropdownOpen: false
    }
  }

  componentWillMount() {
  }

  toggleDropdown(val) {
    this.setState({ dropdownOpen: !val })
  }

  render() {

    const { dropdownOpen } = this.state

    let label     = "Please Select"
    let className = 'dropdown-select btn-block'

    return (
      <div className="form-group relative-positioned">
        <Dropdown id=""
                  open={dropdownOpen}
                  className={className}>
          <Dropdown.Toggle onClick={() => this.toggleDropdown(this.state.dropdownOpen)} noCaret={true}>
            <IconSelectCaret/>
            {label}
          </Dropdown.Toggle>

          <Dropdown.Menu>

            {options.map((options, i) =>
              <MenuItem key={i}
                        data-value={options[0]}
                        onClick={e => this.handleTimespanChange(e.target.getAttribute('data-value'))}
                        className={this.state.activeDateRange === options[0] && 'hidden'}>
                {options[1]}
              </MenuItem>
            )}

          </Dropdown.Menu>
        </Dropdown>
      </div>
    )
  }
}

DateRangeFilter.displayName = 'DateRangeFilter'
DateRangeFilter.propTypes   = {
  changeDateRange: React.PropTypes.func,
  endDate: React.PropTypes.instanceOf(moment),
  startDate: React.PropTypes.instanceOf(moment)
}

module.exports = DateRangeFilter

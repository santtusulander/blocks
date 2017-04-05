import React, { PropTypes } from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'

import Button from './button'
import IconAdd from './shared/icons/icon-add'
import CustomToggle from './customToggle'

const ButtonDropdown = ({ bsStyle, disabled, options, pullRight }) => (
    <Dropdown id="dropdown-custom-menu" pullRight={pullRight} disabled={disabled}>
      <CustomToggle bsRole="toggle">
        <Button bsStyle={bsStyle} icon={true} disabled={disabled}>
          <IconAdd/>
        </Button>
      </CustomToggle>
      <Dropdown.Menu className="button-dropdown-menu">
        {
          // eslint-disable-next-line no-shadow
          options.map(({disabled, value, label, handleClick}, index) => (
            <MenuItem
              disabled={disabled}
              key={index}
              onClick={() => !disabled && handleClick(value)}
            >
              {label}
            </MenuItem>
          ))
        }
      </Dropdown.Menu>
    </Dropdown>)


ButtonDropdown.displayName = 'ButtonDropdown'
ButtonDropdown.propTypes = {
  bsStyle: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.arrayOf(
    React.PropTypes.shape({
      label: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number, React.PropTypes.node ]).isRequired,
      handleClick: React.PropTypes.func.isRequired
    })
  ).isRequired,
  pullRight: PropTypes.bool
}

export default ButtonDropdown

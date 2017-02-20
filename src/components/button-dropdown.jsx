import React, { PropTypes } from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'

import Button from './button'
import IconAdd from './icons/icon-add.jsx'

const ButtonDropdown = ({ bsStyle, disabled, options, pullRight }) => (
    <Dropdown pullRight={pullRight}>
      <div bsRole={!disabled && "toggle"} className='button-toggle'>
        <Button bsStyle={bsStyle} icon={true} disabled={disabled}>
          <IconAdd/>
        </Button>
      </div>
      <Dropdown.Menu className="button-dropdown-menu">
        {
          options.map(({label, callback}, index)=>(
            <MenuItem key={index} onClick={callback}> {label} </MenuItem>
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
      label: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number ]).isRequired,
      callback: React.PropTypes.func.isRequired
    })
  ).isRequired,
  pullRight: PropTypes.bool
}

export default ButtonDropdown

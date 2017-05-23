import React, { PropTypes } from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'

import TruncatedTitle from './truncated-title'
import CustomToggle from '../form-elements/customToggle'

import IconContextMenu from '../icons/icon-context-menu'

const ContextMenu = ({ header, options, disabled }) => {
  return (
    <Dropdown className="menu" id="context-menu" pullRight={true} disabled={disabled}>
      <CustomToggle bsRole="toggle">
        <IconContextMenu className="storage-contents-context-menu-icon"/>
      </CustomToggle>
      <Dropdown.Menu className="context-menu">
        <MenuItem className="menu-header">
          <div className="header-title">
            <TruncatedTitle content={header}/>
          </div>
          <IconContextMenu/>
        </MenuItem>
        {options.map(({label, handleClick}, index) => (
            <MenuItem
              key={index}
              onClick={e => {
                e.stopPropagation()
                handleClick(header)
              }}
            >
              {label}
            </MenuItem>
          )
        )}
      </Dropdown.Menu>
    </Dropdown>
  )
}


ContextMenu.displayName = 'ContextMenu'

ContextMenu.defaultProps = {
  options: []
}

ContextMenu.propTypes = {
  disabled: PropTypes.bool,
  header: PropTypes.string,
  options: PropTypes.arrayOf(
    React.PropTypes.shape({
      label: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number, React.PropTypes.node ]).isRequired,
      handleClick: React.PropTypes.func.isRequired
    })
  ).isRequired
}
export default ContextMenu

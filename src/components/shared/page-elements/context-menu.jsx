import React, { PropTypes } from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'

import IconContextMenu from '../icons/icon-context-menu'

const ContextMenu = (props) => {
  return (
    <Dropdown className="open menu">
      <Dropdown.Menu className="context-menu">
        <MenuItem className="menu-header">
          <span className="header-title">File_name1.mov</span>
          <IconContextMenu/>
        </MenuItem>
        <MenuItem>Download</MenuItem>
        <MenuItem>Delete</MenuItem>
      </Dropdown.Menu>
    </Dropdown>
  )
}


ContextMenu.displayName = 'ButtonDropdown'
export default ContextMenu

import React, { PropTypes } from 'react'
import { Dropdown, MenuItem, Input } from 'react-bootstrap'

import IconSelectCaret from './icons/icon-select-caret.jsx'

const AccountSelector = ({ items, drillable, classname, children, onSelect, open, toggle, previousTier, searchValue, onSearch}) =>
  <Dropdown id="" className={classname} onSelect={onSelect} open={open}>
    <span bsRole="toggle" onClick={toggle}>{children}</span>
    <span className="caret-container">
      <IconSelectCaret/>
    </span>
    <Dropdown.Menu>
      <MenuItem>
        <Input
          className="header-search-input"
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={onSearch}/>
      </MenuItem>
      {drillable && <MenuItem id="back">Back to {previousTier}</MenuItem>}
      {items.map((option, i) =>
        <MenuItem key={i} data-value={option[0]} id="item-bg">
          <span id="name" data-value={option[0]}>{option[1]}</span>
          {drillable &&
            <span className="caret-container">
              <IconSelectCaret/>
            </span>}
        </MenuItem>
      )}
    </Dropdown.Menu>
  </Dropdown>

AccountSelector.propTypes = {
  children: PropTypes.string,
  classname: PropTypes.string,
  drillable: PropTypes.bool,
  items: PropTypes.array,
  onSearch: PropTypes.func,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  previousTier: PropTypes.string,
  searchValue: PropTypes.string,
  toggle: PropTypes.func
}

export default AccountSelector

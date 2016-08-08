import React, { PropTypes } from 'react'
import { Dropdown, MenuItem, Input } from 'react-bootstrap'

const AccountSelector = ({ items, drillable, children, onSelect, open, toggle, topBarText, searchValue, onSearch, onCaretClick}) =>
  <Dropdown id="" onSelect={onSelect} open={open} className="global-account-selector">
    <div className="global-account-selector__toggle" bsRole="toggle" onClick={toggle}>{children}</div>
    <Dropdown.Menu>
      <MenuItem>
        <Input
          className="header-search-input"
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={onSearch}/>
      </MenuItem>
      {topBarText && <MenuItem id="top-bar" className="top-bar-link">{topBarText}</MenuItem>}
      {items.map((option, i) =>
        <MenuItem key={i} data-value={option[0]} id="menu-item">
          <span id="name" className="name" data-value={option[0]}>{option[1]}</span>
          {drillable &&
            <span className="caret-container" data-value={option[0]} onClick={onCaretClick}>
              <span className="caret" data-value={option[0]}></span>
            </span>}
        </MenuItem>
      )}
    </Dropdown.Menu>
  </Dropdown>

AccountSelector.propTypes = {
  children: PropTypes.object,
  classname: PropTypes.string,
  drillable: PropTypes.bool,
  items: PropTypes.array,
  onCaretClick: PropTypes.func,
  onSearch: PropTypes.func,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  searchValue: PropTypes.string,
  toggle: PropTypes.func,
  topBarText: PropTypes.string
}

export default AccountSelector

import React, { PropTypes } from 'react'
import { Dropdown, MenuItem, Input } from 'react-bootstrap'

import autoClose from '../../decorators/select-auto-close'

const SelectorComponent = ({
  items,
  drillable,
  children,
  onSelect,
  open,
  toggle,
  topBarText,
  searchValue,
  onSearch,
  onCaretClick,
  onItemClick,
  onTopbarClick }) =>
  <Dropdown id="" onSelect={onSelect} open={open} onToggle={() => {/*noop*/}} className="global-account-selector">
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
      {topBarText && <MenuItem onClick={onTopbarClick}><span className="top-bar-link">{topBarText}</span></MenuItem>}
      {items.map((option, i) =>
        <MenuItem key={i} id="menu-item">
          <span id="name" className="name" onClick={() => onItemClick(option[0])}>{option[1]}</span>
          {drillable &&
            <span className="caret-container" onClick={() => onCaretClick(option[0])}>
              <span className="caret"></span>
            </span>}
        </MenuItem>
      )}
    </Dropdown.Menu>
  </Dropdown>

SelectorComponent.displayName = 'SelectorComponent'
SelectorComponent.propTypes = {
  children: PropTypes.object,
  classname: PropTypes.string,
  drillable: PropTypes.bool,
  items: PropTypes.array,
  onCaretClick: PropTypes.func,
  onItemClick: PropTypes.func,
  onSearch: PropTypes.func,
  onSelect: PropTypes.func,
  onTopbarClick: PropTypes.func,
  open: PropTypes.bool,
  searchValue: PropTypes.string,
  toggle: PropTypes.func,
  topBarText: PropTypes.string
}

export default autoClose(SelectorComponent)

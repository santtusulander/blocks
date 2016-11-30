import React, { PropTypes } from 'react'
import { Dropdown, MenuItem, Input } from 'react-bootstrap'

import IconArrowRight from '../icons/icon-arrow-right'
import autoClose from '../../decorators/select-auto-close'

export const SelectorComponent = ({
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
  <Dropdown id="" onSelect={onSelect} open={open} onToggle={() => {/*noop*/}} className="selector-component">
    <div className="selector-component__toggle" bsRole="toggle" onClick={toggle}>{children}</div>
    <Dropdown.Menu>
      <li role="presentation" className="action-container">
        <Input
          className="header-search-input"
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={onSearch}/>
      </li>
      <li>
        <ul className='scrollable-menu'>
          {topBarText && <MenuItem onClick={onTopbarClick}><span className="top-bar-link">{topBarText}</span></MenuItem>}
          {items.map((option, i) =>
            <li key={i} role="presentation">
              <a id="menu-item" role="menu-item" onClick={() => onItemClick(option[0])} tabIndex="-1">
                <span id="name" className="name">{option[1]}</span>
              </a>
              {drillable &&
                <a className="caret-container" onClick={() => onCaretClick(option[0])} tabIndex="-1">
                  <IconArrowRight />
                </a>}
            </li>
          )}
        </ul>
      </li>
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

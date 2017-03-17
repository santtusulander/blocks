import React from 'react'
import { FormControl } from 'react-bootstrap'

import IconArrowLeft from '../icons/icon-arrow-left'

export default ({ searchValue, onSearchChange, subtitle, parentId, activeNodeName, goToParent }) => {

  const handleParentCaretClick = event => {
    event.nativeEvent.stopImmediatePropagation()
    goToParent(parentId)
  }

  return (
    <li className="action-container" style={{padding: 0}}>
      <div className="header-text-container">
        {parentId &&
          <a onClick={handleParentCaretClick}>
            <IconArrowLeft/>
          </a>
        }
        <div>
          <h3>{activeNodeName}</h3>
          {subtitle && <span>{subtitle}</span>}
        </div>
    </div>
    <span className="header-search-container">
      <FormControl
        className="header-search-input"
        type="text"
        placeholder="Search"
        onChange={onSearchChange}
        value={searchValue}/>
    </span>
    </li>
  )
}

import React from 'react'
import { FormControl } from 'react-bootstrap'

import IconArrowLeft from '../icons/icon-arrow-left'

export default ({ searchValue, onSearchChange, subtitle, parentId, activeNodeName, goToParent }) => {
  
  const handleParentCaretClick = event => {
    event.nativeEvent.stopImmediatePropagation()
    goToParent(parentId)
  }

  return (
    <li className="action-container">
      <div>
        {parentId &&
          <a onClick={handleParentCaretClick}>
            <IconArrowLeft/>
          </a>
        }
        <div>
          <h2>{activeNodeName}</h2>
          {subtitle && <span>{subtitle}</span>}
        </div>
    </div>
      <FormControl
        className="header-search-input"
        type="text"
        placeholder="Search"
        onChange={onSearchChange}
        value={searchValue}/>
    </li>
  )
}

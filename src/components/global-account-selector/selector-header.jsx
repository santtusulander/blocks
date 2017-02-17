import React from 'react'
import { FormControl } from 'react-bootstrap'

import IconArrowLeft from '../icons/icon-arrow-left'

export default ({ searchValue, onSearchChange, childrenLabel = 'assdadsa', parentId, activeNodeName, goToParent }) =>
  <li className="action-container">
    <div>
      {parentId &&
        <a onClick={() => goToParent(parentId)}>
          <IconArrowLeft/>
        </a>}
      <div>
        <h2>{activeNodeName}</h2>
        {childrenLabel && <span>{childrenLabel}</span>}
      </div>
  </div>
    <FormControl
      className="header-search-input"
      type="text"
      placeholder="Search"
      onChange={onSearchChange}
      value={searchValue}/>
  </li>

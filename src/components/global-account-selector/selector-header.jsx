import React from 'react'
import { FormControl } from 'react-bootstrap'

import IsAllowed from '../is-allowed'
import IconArrowLeft from '../icons/icon-arrow-left'

export default ({ searchValue, onSearchChange, subtitle, parentId, showBackCaretPermission, activeNodeName, goToParent }) =>
  <li className="action-container">
    <div>
      <IsAllowed to={showBackCaretPermission}>
        <a onClick={() => goToParent(parentId)}>
          <IconArrowLeft/>
        </a>
      </IsAllowed>
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

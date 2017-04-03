import React, { PropTypes } from 'react'
import { FormControl } from 'react-bootstrap'

import IconArrowLeft from '../icons/icon-arrow-left'

const DrillableMenuHeader = ({ searchValue, onSearchChange, subtitle, parentId, activeNodeName, goToParent }) => {

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

DrillableMenuHeader.displayName = 'DrillableMenuHeader'
DrillableMenuHeader.propTypes = {
  activeNodeName: PropTypes.string,
  goToParent: PropTypes.func,
  onSearchChange: PropTypes.func,
  parentId: PropTypes.string,
  searchValue: PropTypes.string,
  subtitle: PropTypes.string
}

export default DrillableMenuHeader

import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { FormControl } from 'react-bootstrap'

import IconArrowLeft from '../shared/icons/icon-arrow-left'

const DrillableMenuHeader = ({ searchValue, onSearchChange, subtitle, parentId, activeNodeName, goToParent, fetching }) => {

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

          {!fetching && subtitle
            ? <span>{subtitle}</span>
            : <FormattedMessage id="portal.loading.text" />}

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
  fetching: PropTypes.bool,
  goToParent: PropTypes.func,
  onSearchChange: PropTypes.func,
  parentId: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  searchValue: PropTypes.string,
  subtitle: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ])
}

export default DrillableMenuHeader

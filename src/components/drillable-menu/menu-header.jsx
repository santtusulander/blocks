import React, { PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { FormControl } from 'react-bootstrap'

import IconArrowLeft from '../shared/icons/icon-arrow-left'

const DrillableMenuHeader = ({ searchValue, onSearchChange, subtitle, parentId, activeNodeName, goToParent, fetching, intl, goToActive }) => {

  const handleParentCaretClick = event => {
    event.nativeEvent.stopImmediatePropagation()
    goToParent(parentId)
  }

  return (
    <li className="action-container" style={{padding: 0}}>
      <div className="header-text-container">
        {parentId &&
          <a className="drillable-header-back-caret" onClick={handleParentCaretClick}>
            <IconArrowLeft/>
          </a>
        }
        <div>
          {goToActive
            ? <h3 className="active-node-link" onClick={goToActive}>{activeNodeName}</h3>
            : <h3>{activeNodeName}</h3>}

          {!fetching && subtitle
            ? <span>{subtitle}</span>
            : <FormattedMessage id="portal.loading.text" />}

        </div>
    </div>
    <span className="header-search-container">
      <FormControl
        className="header-search-input"
        type="text"
        placeholder={intl.formatMessage({ id: "portal.common.search.text"})}
        onChange={onSearchChange}
        value={searchValue}/>
    </span>
    </li>
  )
}

DrillableMenuHeader.displayName = 'DrillableMenuHeader'
DrillableMenuHeader.propTypes = {
  activeNodeName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  fetching: PropTypes.bool,
  goToActive: PropTypes.oneOfType([ PropTypes.func, PropTypes.bool ]),
  goToParent: PropTypes.func,
  intl: PropTypes.object,
  onSearchChange: PropTypes.func,
  parentId: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  searchValue: PropTypes.string,
  subtitle: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ])
}

export default injectIntl(DrillableMenuHeader)

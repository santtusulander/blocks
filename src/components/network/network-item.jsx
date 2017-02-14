import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, ButtonToolbar } from 'react-bootstrap'
import classNames from 'classnames'
import TruncatedTitle from '../truncated-title'

import IconConfiguration from '../icons/icon-configuration'

const NetworkItem = ({ active, content, onEdit, onSelect, status, title, extraClassName, isAllowedToConfigure }) => {

  const handleEdit = e => {
    e.preventDefault()
    onEdit()
  }

  const handleSelect = e => {
    // Prevent select function call if a button was clicked
    if (!e.isDefaultPrevented()) {
      onSelect()
    }
  }

  return (
    <div
      className={classNames(
        'network-item',
        {'active': active},
        extraClassName
      )}
      onClick={handleSelect}>

      <h4><TruncatedTitle className='network-item-title' content={title} /></h4>

      <TruncatedTitle className='network-item-content' content={content} />

      {status &&
        <div className={`status-indicator ${status}`}>
          <FormattedMessage id={`portal.network.item.status.${status}`} />
        </div>
      }
      {isAllowedToConfigure &&
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            className="btn-icon btn-round"
            onClick={handleEdit}>
            <IconConfiguration />
          </Button>
        </ButtonToolbar>
      }
    </div>
  )
}

NetworkItem.displayName = 'NetworkItem'
NetworkItem.propTypes = {
  active: PropTypes.bool,
  content: PropTypes.string,
  extraClassName: PropTypes.string,
  isAllowedToConfigure: PropTypes.bool,
  onEdit: PropTypes.func,
  onSelect: PropTypes.func,
  status: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
}

export default NetworkItem

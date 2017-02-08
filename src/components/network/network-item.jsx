import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, ButtonToolbar, Tooltip, OverlayTrigger } from 'react-bootstrap'
import classNames from 'classnames'

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

  const renderTitle = title => {
    let renderedTitle = <h4>{title}</h4>
    if ((typeof title === "string") && (title.length > 20)) {
      renderedTitle = (<OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="network-item-title">{title}</Tooltip>}>
                          <h4>{`${title.substr(0, 20)}...`}</h4>
                      </OverlayTrigger>)
    }
    return renderedTitle
  }

  return (
    <div
      className={classNames(
        'network-item',
        {'active': active},
        extraClassName
      )}
      onClick={handleSelect}>

      {renderTitle(title)}

      <p>{content}</p>

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

import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, ButtonToolbar } from 'react-bootstrap'
import classNames from 'classnames'

import IconConfiguration from '../icons/icon-configuration'

const NetworkItem = ({ active, content, onEdit, onSelect, status, title }) => {

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
        {'active': active}
      )}
      onClick={handleSelect}>

      <h4>{title}</h4>

      <p>{content}</p>

      {status &&
        <div className={`status-indicator ${status}`}>
          <FormattedMessage id={`portal.network.item.status.${status}`} />
        </div>
      }

      <ButtonToolbar>
        <Button
          bsStyle="primary"
          className="btn-icon btn-round"
          onClick={handleEdit}>
          <IconConfiguration />
        </Button>
      </ButtonToolbar>

    </div>
  )
}

NetworkItem.displayName = 'NetworkItem'
NetworkItem.propTypes = {
  active: PropTypes.bool,
  content: PropTypes.string,
  onEdit: PropTypes.func,
  onSelect: PropTypes.func,
  status: PropTypes.string,
  title: PropTypes.string
}

export default NetworkItem

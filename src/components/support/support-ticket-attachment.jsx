import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Map } from 'immutable'
import { formatFileSize } from '../../util/helpers'
import IconClose from '../icons/icon-close'

class SupportTicketAttachment extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { className, attachment, onDelete } = this.props

    return (
      <div className={classNames('support-ticket-attachment', className)}>
        <p className="support-ticket-attachment__file-name">{attachment.get('file_name')}</p>
        <div className="support-ticket-attachment__info">
          <span className="support-ticket-attachment__size">{formatFileSize(attachment.get('size'))}</span>
        </div>
        <a className="support-ticket-attachment__delete-button" onClick={onDelete}>
          <IconClose/>
        </a>
      </div>
    )
  }
}

SupportTicketAttachment.displayName = "SupportTicketAttachment"

SupportTicketAttachment.propTypes = {
  attachment: PropTypes.instanceOf(Map),
  className: PropTypes.string,
  onDelete: PropTypes.func
}

SupportTicketAttachment.defaultProps = {
  attachment: Map(),
  onDelete: () => {
    // no-op
  }
}

export default SupportTicketAttachment

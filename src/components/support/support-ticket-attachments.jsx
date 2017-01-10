import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { List } from 'immutable'

import SupportTicketAttachment from './support-ticket-attachment'

class SupportTicketAttachments extends React.Component {
  constructor(props) {
    super(props)
  }


  render() {
    const { className, attachments } = this.props

    return (
      <div className={classNames('support-ticket-attachments', className)}>
        {attachments.map((attachment, i) => {
          return <SupportTicketAttachment key={`attachment-${i}`} attachment={attachment}/>
        })}
      </div>
    )
  }
}

SupportTicketAttachments.displayName = "SupportTicketAttachments"

SupportTicketAttachments.propTypes = {
  attachments: PropTypes.instanceOf(List),
  className: PropTypes.string
}

SupportTicketAttachments.defaultProps = {
  attachments: List()
}

export default SupportTicketAttachments

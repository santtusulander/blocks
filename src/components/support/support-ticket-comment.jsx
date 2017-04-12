import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Map } from 'immutable'
import { formatDate } from '../../util/helpers'

/* TODO: uncomment when this tab will be implemented */
/* eslint-disable react-intl/string-is-marked-for-translation */

class SupportTicketComment extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { className, comment } = this.props

    return (
      <div className={classNames('support-ticket-comment', className)}>
        <div className="support-ticket-comment__header">
          <span className="support-ticket-comment__author">{comment.get('author_id')}</span>
          <span className="support-ticket-comment__created"> - {formatDate(comment.get('created_at'), 'MM/DD/YYYY hh:mm a')}</span>
        </div>
        <div className="support-ticket-comment__body">
          {comment.get('body')}
        </div>
      </div>
    )
  }
}

SupportTicketComment.displayName = "SupportTicketComment"

SupportTicketComment.propTypes = {
  className: PropTypes.string,
  comment: PropTypes.instanceOf(Map)
}

SupportTicketComment.defaultProps = {
  comment: Map()
}

export default SupportTicketComment

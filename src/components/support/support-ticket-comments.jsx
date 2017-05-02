import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { List } from 'immutable'

import SupportTicketComment from './support-ticket-comment'

const SupportTicketComments = ({ className, comments }) => {
  return (
    <div className={classNames('support-ticket-comments', className)}>
      {comments.map((comment, i) => {
        return <SupportTicketComment key={`comment-${i}`} comment={comment}/>
      })}
    </div>
  )
}

SupportTicketComments.displayName = "SupportTicketComments"
SupportTicketComments.propTypes = {
  className: PropTypes.string,
  comments: PropTypes.instanceOf(List)
}

SupportTicketComments.defaultProps = {
  comments: List()
}

export default SupportTicketComments

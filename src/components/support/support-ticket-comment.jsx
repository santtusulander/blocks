import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Map } from 'immutable'
import { FormattedDate } from 'react-intl'
import { DATE_FORMATS } from '../../constants/date-formats'

/* TODO: uncomment when this tab will be implemented */
/* eslint-disable react-intl/string-is-marked-for-translation */

const SupportTicketComment = (props) => {
  return (
    <div className={classNames('support-ticket-comment', props.className)}>
      <div className="support-ticket-comment__header">
        <span className="support-ticket-comment__author">{props.comment.get('author_id')}</span>
        <span className="support-ticket-comment__created"> - <FormattedDate value={props.comment.get('created_at')} format={DATE_FORMATS.DATE_HOUR_12}/></span>
      </div>
      <div className="support-ticket-comment__body">
        {props.comment.get('body')}
      </div>
    </div>
  )
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

import React, { PropTypes } from 'react'
import classnames from 'classnames'

const ContentItemTag = ({ content, customClass }) =>
  <span className={classnames('content-item-tag', customClass)}>
    {content}
  </span>

ContentItemTag.propTypes = {
  content: PropTypes.string.isRequired,
  customClass: PropTypes.string
}

export default ContentItemTag

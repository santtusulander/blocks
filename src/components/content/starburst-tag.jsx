import React, { PropTypes } from 'react'
import classnames from 'classnames'

const StarBurstTag = ({ content, customClass }) =>
  <span className={classnames('content-item-text-box', customClass)}>
    {content}
  </span>

StarBurstTag.propTypes = {
  content: PropTypes.string.isRequired,
  customClass: PropTypes.string
}

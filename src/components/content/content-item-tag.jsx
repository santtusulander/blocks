import React, { PropTypes } from 'react'
import classnames from 'classnames'

const ContentItemTag = ({ customClass, children }) =>
  <span className={classnames('content-item-tag', customClass)}>
   {children}
  </span>

ContentItemTag.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  customClass: PropTypes.string
}

export default ContentItemTag

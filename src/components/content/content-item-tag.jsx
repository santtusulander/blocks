import React, { PropTypes } from 'react'
import classnames from 'classnames'

const ContentItemTag = ({ customClass, ...rest }) =>
  <span className={classnames('content-item-tag', customClass)} {...rest}/>

ContentItemTag.propTypes = {
  customClass: PropTypes.string
}

export default ContentItemTag

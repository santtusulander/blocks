import React from 'react'

const Content = (props) => {
  let className = 'content-layout';
  if (props.className) {
    className = className + ' ' + props.className;
  }

  return (
    <div className={className}>
      {props.children}
    </div>
  )
}

Content.displayName = 'Content'
Content.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string
}

export default Content

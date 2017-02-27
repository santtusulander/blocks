import React, { PropTypes } from 'react'

const TabContent = ({children}) => {
  return (
    <div>{children}</div>
  )
}

TabContent.displayName = "TabContent"
TabContent.propTypes = {
  children: PropTypes.node
}

export default TabContent;

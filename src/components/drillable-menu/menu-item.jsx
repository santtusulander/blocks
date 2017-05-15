import React, { PropTypes } from 'react'

import IconArrowRight from '../shared/icons/icon-arrow-right'

const MenuItem = ({ node, handleCaretClick, onItemClick }) => {
  const { labelKey = 'name', idKey = 'id', nodeInfo: { fetchChildren, nodes } } = node

  const nodeId = node[idKey]
  const nodeName = node[labelKey]
  
  return (
    <li>

      <a className="name-container" onClick={() => onItemClick(node)}><span>{nodeName}</span></a>
      {nodes &&
        <a
          className="caret-container"
          tabIndex="-1"
          onClick={event => {
            event.nativeEvent.stopImmediatePropagation()
            handleCaretClick(fetchChildren, nodeId)
          }}>
          <span className="caret-container-short-border"/>
          <IconArrowRight />
        </a>
      }

    </li>
  )
}

MenuItem.propTypes = {
  handleCaretClick: PropTypes.func,
  node: PropTypes.object,
  onItemClick: PropTypes.func
}

MenuItem.displayName = 'MenuItem'
export default MenuItem

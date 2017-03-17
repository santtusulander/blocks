import React from 'react'
import IconArrowRight from '../icons/icon-arrow-right'
import MiniLoadingSpinner from '../loading-spinner/loading-spinner-sm'

export default ({ menuNodes = [], searchValue, handleCaretClick, onItemClick }) => {

  return (
    <li className="menu-container">

      {/* Dropdown with nodes */}
      <ul className="scrollable-menu">
        {menuNodes.reduce((menuItems, node, i) => {

          const { labelKey = 'name', idKey = 'id', nodeInfo: { fetchChildren, isFetchingChildren, nodes } } = node

          const nodeId = node[idKey]
          const nodeName = node[labelKey]

          if (nodeName.toLowerCase().includes(searchValue.toLowerCase())) {

            menuItems.push(
              <li key={i}>

                <a onClick={() => onItemClick(node)}>{nodeName}</a>

                {nodes &&
                  <a
                    className="caret-container"
                    tabIndex="-1"
                    onClick={event => {
                      event.nativeEvent.stopImmediatePropagation()
                      !isFetchingChildren && handleCaretClick(fetchChildren, nodeId)
                    }}>
                    <span className="caret-container-short-border"/>
                    {!isFetchingChildren ? <IconArrowRight /> : <MiniLoadingSpinner />}
                  </a>
                }

              </li>
            )
          }

          return menuItems
        }, [])}
      </ul>

    </li>
  )
}

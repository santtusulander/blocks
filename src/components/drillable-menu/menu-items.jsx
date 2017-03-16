import React from 'react'
import IconArrowRight from '../icons/icon-arrow-right'

export default ({ menuNodes = [], searchValue, handleCaretClick, onItemClick }) => {

  return (
    <li className="menu-container">

      {/* Dropdown with nodes */}
      <ul className="scrollable-menu">
        {menuNodes.reduce((listItems, node, i) => {

          const { labelKey = 'name', idKey = 'id', nodeInfo: { fetchChildren, nodes } } = node

          const nodeId = node[idKey]
          const nodeName = node[labelKey]

          if (nodeName.includes(searchValue)) {

            listItems.push(
              <li key={i}>

                <a onClick={() => onItemClick(node)}>{nodeName}</a>

                {nodes &&
                  <a
                    className="caret-container"
                    tabIndex="-1"
                    onClick={event => {
                      event.nativeEvent.stopImmediatePropagation()
                      handleCaretClick(fetchChildren, nodeId)
                    }}>
                    <IconArrowRight />
                  </a>
                }

              </li>
            )
          }

          return listItems
        }, [])}
      </ul>

    </li>
  )
}

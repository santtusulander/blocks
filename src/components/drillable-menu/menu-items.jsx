import React, { PropTypes } from 'react'
import IconArrowRight from '../icons/icon-arrow-right'
import MiniLoadingSpinner from '../loading-spinner/loading-spinner-sm'

const DrillableMenuItems = ({ menuNodes = [], searchValue, handleCaretClick, onItemClick }) => {

  const sortedNodes = menuNodes.sort((a, b) => {
    const aLower = a[ a.labelKey || 'name' ].toLowerCase()
    const bLower = b[ b.labelKey || 'name' ].toLowerCase()

    if (aLower < bLower) {
      return -1
    }
    if (aLower > bLower) {
      return 1
    }
    return 0
  })

  return (
    <li className="menu-container">

      {/* Dropdown with nodes */}
      <ul className="scrollable-menu">
        {sortedNodes.reduce((menuItems, node, i) => {

          const { labelKey = 'name', idKey = 'id', nodeInfo: { fetchChildren, isFetchingChildren, nodes } } = node

          const nodeId = node[idKey]
          const nodeName = node[labelKey]

          if (nodeName.toLowerCase().includes(searchValue.toLowerCase())) {

            menuItems.push(
              <li key={i}>

                <a className="name-container" onClick={() => onItemClick(node)}>{nodeName}</a>

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

DrillableMenuItems.displayName = 'DrillableMenuItems'
DrillableMenuItems.propTypes = {
  handleCaretClick: PropTypes.func,
  menuNodes: PropTypes.array,
  onItemClick: PropTypes.func,
  searchValue: PropTypes.string
}

export default DrillableMenuItems

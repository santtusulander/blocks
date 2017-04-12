import React, { PropTypes } from 'react'
import IconArrowRight from '../shared/icons/icon-arrow-right'
import LoadingSpinner from '../loading-spinner/loading-spinner'

const DrillableMenuItems = ({ menuNodes = [], searchValue, handleCaretClick, onItemClick, fetching }) => {

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

  if (fetching) {
    return <li className="menu-container"><LoadingSpinner /></li>
  }

  return (
    <li className="menu-container">
      {/* Dropdown with nodes */}
      <ul className="scrollable-menu">
        {sortedNodes.reduce((menuItems, node, i) => {

          const { labelKey = 'name', idKey = 'id', nodeInfo: { fetchChildren, nodes } } = node

          const nodeId = node[idKey]
          const nodeName = node[labelKey]

          if (nodeName.toLowerCase().includes(searchValue.toLowerCase())) {

            menuItems.push(
              <li key={i}>

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

          return menuItems
        }, [])}
      </ul>

    </li>
  )
}

DrillableMenuItems.displayName = 'DrillableMenuItems'
DrillableMenuItems.propTypes = {
  fetching: PropTypes.bool,
  handleCaretClick: PropTypes.func,
  menuNodes: PropTypes.array,
  onItemClick: PropTypes.func,
  searchValue: PropTypes.string
}

export default DrillableMenuItems

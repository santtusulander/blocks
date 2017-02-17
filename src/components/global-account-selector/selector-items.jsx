import React from 'react'
import IconArrowRight from '../icons/icon-arrow-right'

export default ({ selectorNodes, goToChild, searchValue }) => {

  const caret = (nodeId, fetchChildren) => {

    const handleCaretClick = () => {
      fetchChildren(nodeId).then(() => goToChild(nodeId))
    }

    return (
      <a className="caret-container" onClick={handleCaretClick} tabIndex="-1">
        <IconArrowRight />
      </a>
    )
  }

  return (
    <li className="menu-container">

      {/* Dropdown with nodes */}
      <ul className="scrollable-menu">
        {selectorNodes.reduce((listItems, node) => {

          const { idKey = 'id', labelKey = 'name', fetchChildren, nodes } = node

          const nodeId = node[idKey]
          const nodeName = node[labelKey]
          
          if (nodeName.includes(searchValue)) {

            listItems.push(
              <li>

                <a>{nodeName}</a>

                {nodes && caret(nodeId, fetchChildren)}

              </li>
            )
          }

          return listItems
        }, [])}
      </ul>

    </li>
  )
}

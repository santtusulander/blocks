import React, { PropTypes } from 'react'
import IconArrowRight from '../shared/icons/icon-arrow-right'
import LoadingSpinner from '../loading-spinner/loading-spinner'
import Accordion from './menu-item-accordion'

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

const DrillableMenuItems = ({ menuNodes = [], fetching, searchValue, handleCaretClick, onItemClick }) => {

  const menu = menuNodes.reduce((categories, node, index) => {

    const { nodeInfo: { category = 'uncategorized' }, labelKey = 'name' } = node

    const passesSearch = node[labelKey].toLowerCase().includes(searchValue.toLowerCase())

    if (categories[category] && passesSearch) {

      // If the node's label contains search value and an array for the node's
      // category already exists, push a MenuItem.
      categories[category].push(<MenuItem key={index} node={node} handleCaretClick={handleCaretClick} onItemClick={onItemClick}/>)

    } else if (!categories[category]) {

      //If an array for the current node's category does not exist, create it.
      categories[category] = []
    }

    return categories
  }, {})

  const readyMenu = Object.keys(menu).reduce((done, category) => {
    if (category === 'uncategorized') {

      done.push(...menu.uncategorized)

    } else {

      done.push(<Accordion searchActive={!!searchValue.length} headerTitle={category} items={menu[category]} />)
    }
    return done
  }, [])

  if (fetching) {
    return <li className="menu-container"><LoadingSpinner /></li>
  }

  return (
    <li className="menu-container">
      {/* Dropdown with nodes */}
      <ul className="scrollable-menu">

        {readyMenu}
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

import React, { PropTypes } from 'react'

import MenuItem from './menu-item'
import LoadingSpinner from '../loading-spinner/loading-spinner'
import Accordion from './menu-item-accordion'

const UNCATEGORIZED = 'uncategorized'

const DrillableMenuItems = ({ menuNodes = [], fetching, searchValue, handleCaretClick, onItemClick }) => {

  const categories = menuNodes.reduce((aggregate, node, index) => {

    // Default all nodes as uncategorized. Uncategorized nodes
    // will be rendered without a wrapping Accordion.
    const { nodeInfo: { category = UNCATEGORIZED }, labelKey = 'name' } = node

    const passesSearch = node[labelKey].toLowerCase().includes(searchValue.toLowerCase())

    if (aggregate[category] && passesSearch) {

      // If the node's label contains search value and an array for the node's
      // category already exists, push a MenuItem.
      aggregate[category].push(<MenuItem key={index} node={node} handleCaretClick={handleCaretClick} onItemClick={onItemClick}/>)

    } else if (!aggregate[category]) {

      //If an array for the current node's category does not exist, create it.
      aggregate[category] = passesSearch
        ? [ <MenuItem key={index} node={node} handleCaretClick={handleCaretClick} onItemClick={onItemClick}/> ]
        : []
    }

    return aggregate
  }, {})

  const menuItems = Object.keys(categories).reduce((aggregate, category) => {
    if (category === UNCATEGORIZED) {

      aggregate.push(...categories.uncategorized)

    } else {

      aggregate.push(<Accordion searchActive={!!searchValue.length} headerTitle={category} items={categories[category]} />)
    }
    return aggregate
  }, [])

  if (fetching) {
    return <li className="menu-container"><LoadingSpinner /></li>
  }

  return (
    <li className="menu-container">
      {/* Dropdown with nodes */}
      <ul className="scrollable-menu">
        {menuItems}
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

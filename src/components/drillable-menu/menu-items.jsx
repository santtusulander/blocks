import React, { PropTypes, Component } from 'react'
import IconArrowRight from '../shared/icons/icon-arrow-right'
import LoadingSpinner from '../loading-spinner/loading-spinner'

class DrillableMenuItems extends Component {

  toggleCategory(category) {
    this.setState({ category: !this.state[category] })
  }

  renderEntityItem(key, node) {
    const { handleCaretClick, onItemClick } = this.props
    const { labelKey = 'name', idKey = 'id', nodeInfo: { fetchChildren, nodes } } = node

    const nodeId = node[idKey]
    const nodeName = node[labelKey]
    return (
      <li key={key}>

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

  render() {
    const { menuNodes = [], fetching } = this.props

    const menu = menuNodes.reduce((categories, node, index) => {
      const { nodeInfo: { category } } = node

      if (category) {

        categories[category] = [
          ...categories[category] || [],
          this.renderEntityItem(index, node)
        ]

      } else {

        categories.uncategorized = [
          ...categories.uncategorized || [],
          this.renderEntityItem(index, node)
        ]
      }

      return categories
    }, {})

    // LAITA ACCORDIONIIN: header: <a className="name-container" onClick={() => this.toggleOpen(category)}><h4>{category}</h4></a>
    Object.keys(menu).reduce((done, category) => {
      if (category === 'uncategorized') {

        done.push(...menu.uncategorized)

      } else {

        done.push(<Accordion searchValue={this.props.searchValue} headerTitle={category} items={menu[category]} />)
      }
      return done
    })

    if (fetching) {
      return <li className="menu-container"><LoadingSpinner /></li>
    }

    return (
      <li className="menu-container">
        {/* Dropdown with nodes */}
        <ul className="scrollable-menu">

          {}
        </ul>

      </li>
    )
  }
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

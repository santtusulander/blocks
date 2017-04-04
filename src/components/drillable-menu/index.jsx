import React, { PropTypes, Component } from 'react'
import { Dropdown } from 'react-bootstrap'
import { Map } from 'immutable'

import ToggleElement from '../global-account-selector/toggle-element'

import autoClose from '../../decorators/select-auto-close'

import DrillableMenuItems from './menu-items'
import DrillableMenuHeader from './menu-header'

class DrillableMenu extends Component {

  constructor(props) {
    super(props)

    this.onSearchChange = this.onSearchChange.bind(this)
    this.handleCaretClick = this.handleCaretClick.bind(this)
    this.changeActiveNode = this.changeActiveNode.bind(this)
    this.toggleMenu = this.toggleMenu.bind(this)
    this.findActiveNode = this.findActiveNode.bind(this)
    this.renderDropdown = this.renderDropdown.bind(this)
    this.state = {
      activeNode: props.activeNode,
      search: ''
    }
  }

  componentWillMount() {
    this.props.fetchData(this.context.currentUser, this.context.roles)
  }

  componentWillReceiveProps({ activeNode, fetchData }) {
    if (activeNode !== this.props.activeNode) {

      fetchData(this.context.currentUser, this.context.roles)
        .then(() => {
          this.changeActiveNode(activeNode)
        })
    }
  }

  onSearchChange(e) {
    this.setState({ search: e.target.value })
  }

  handleCaretClick(fetchChildren, nodeId) {
    fetchChildren(this.props.dispatch)
      .then(() => this.changeActiveNode(nodeId))
  }

  changeActiveNode(nodeId) {
    this.setState({ activeNode: nodeId, search: '' })
  }

  toggleMenu() {
    this.props.toggle()
    this.setState({ search: '' })
  }

  findActiveNode(tree = [], parentNodeId) {

    let found, foundFromChild = undefined

    for (const node of tree) {
      const { idKey = 'id', nodeInfo } = node
      const nodeId = node[idKey]

      if (String(nodeId) === String(this.state.activeNode)) {

        found = node
        break

      } else {
        foundFromChild = this.findActiveNode(nodeInfo.nodes, nodeId)

        if (foundFromChild) {
          return foundFromChild
        }
      }
    }

    if (found) {
      return { ...found, parentNodeId };
    }
  }

  renderDropdown() {

    const nodeToView = this.findActiveNode(this.props.tree)

    if (nodeToView) {

      const { parentNodeId, labelKey = 'name', nodeInfo } = nodeToView
      return (
          <Dropdown.Menu>
            <DrillableMenuHeader
              parentId={parentNodeId}
              subtitle={nodeInfo.headerSubtitle}
              goToParent={this.changeActiveNode}
              searchValue={this.state.search}
              onSearchChange={this.onSearchChange}
              activeNodeName={nodeToView[labelKey]} />

            <DrillableMenuItems
              onItemClick={this.props.onItemClick}
              handleCaretClick={this.handleCaretClick}
              goToChild={this.changeActiveNode}
              menuNodes={nodeInfo.nodes}
              searchValue={this.state.search} />
          </Dropdown.Menu>
      )
    } else {
      return <Dropdown.Menu />
    }
  }

  render() {
    const { props: { children, open } } = this
    return (
      <Dropdown id="" open={open} onToggle={() => {/*noop*/}} className="selector-component">
        <ToggleElement bsRole="toggle" toggle={this.toggleMenu}>
          <span>{children}</span>
        </ToggleElement>
        {this.renderDropdown()}
      </Dropdown>
    )
  }
}

DrillableMenu.displayName = 'DrillableMenu'
DrillableMenu.contextTypes = {
  currentUser: PropTypes.instanceOf(Map),
  roles: PropTypes.instanceOf(Map)
}
DrillableMenu.propTypes = {
  activeNode: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  children: PropTypes.node,
  dispatch: PropTypes.func,
  fetchData: PropTypes.func,
  onItemClick: PropTypes.func,
  open: PropTypes.bool,
  toggle: PropTypes.func,
  tree: PropTypes.array
}

export default autoClose(DrillableMenu)

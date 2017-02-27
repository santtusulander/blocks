import React, { PropTypes, Component } from 'react'
import { Dropdown } from 'react-bootstrap'
import { Map, List } from 'immutable'

import ToggleElement from '../global-account-selector/toggle-element'

import SelectorItems from './menu-items'
import SelectorHeader from './menu-header'

export default class Selector extends Component {

  state = {
    open: false,
    activeNode: this.props.activeNode,
    search: ''
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

  onSearchChange = e => {
    this.setState({ search: e.target.value })
  }

  handleCaretClick = (fetchChildren, nodeId) => {
    this.props.dispatch(fetchChildren())
      .then(() => this.changeActiveNode(nodeId))
  }

  changeActiveNode = activeNode => {
    this.setState({ activeNode, search: '' })
  }

  toggleMenu = () => this.setState({ open: !this.state.open, search: '' })

  findActiveNode = (tree = [], parentNodeId) => {

    let found, foundFromChild = undefined

    for (const node of tree) {
      const { idKey = 'id', nodeInfo } = node
      const nodeId = node[idKey]

      if (nodeId == this.state.activeNode) {

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

  renderDropdown = () => {

    const nodeToView = this.findActiveNode(this.props.tree)

    if (nodeToView) {

      const { parentNodeId, labelKey = 'name', nodeInfo } = nodeToView
      return (
          <Dropdown.Menu>
            <SelectorHeader
              parentId={parentNodeId}
              subtitle={nodeInfo.headerSubtitle}
              goToParent={this.changeActiveNode}
              searchValue={this.state.search}
              onSearchChange={this.onSearchChange}
              activeNodeName={nodeToView[labelKey]} />

            <SelectorItems
              handleEntityClick={this.props.handleEntityClick}
              handleCaretClick={this.handleCaretClick}
              goToChild={this.changeActiveNode}
              menuNodes={nodeInfo.nodes}
              searchValue={this.state.search} />
          </Dropdown.Menu>
      )
    } else return <Dropdown.Menu />
  }

  render() {
    const { props: { children }, state: { open } } = this
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

Selector.contextTypes = {
  currentUser: PropTypes.instanceOf(Map),
  roles: PropTypes.instanceOf(List)
}

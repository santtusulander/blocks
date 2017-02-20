import React, { PropTypes, Component } from 'react'
import { Dropdown } from 'react-bootstrap'

import ToggleElement from './toggle-element'

import SelectorItems from './selector-items'
import SelectorHeader from './selector-header'

export default class Selector extends Component {

  static emptyArray = []

  state = {
    open: false,
    activeNode: this.props.activeNode,
    search: ''
  }

  componentWillMount() {
    this.props.fetchData()
  }

  componentWillReceiveProps({ activeNode }) {
    activeNode !== this.props.activeNode && this.setState({ activeNode, search: '' })
  }

  onSearchChange = e => {
    this.setState({ search: e.target.value })
  }

  handleCaretClick = (fetchChildren, nodeId) => {
    this.props.dispatch(fetchChildren())
      .then(() => this.changeTier(nodeId))
  }

  changeTier = activeNode => {
    this.setState({ activeNode, search: '' })
  }

  toggleMenu = () => this.setState({ open: !this.state.open, search: '' })

  renderDropdown = (tree = Selector.emptyArray, parentId) => {

    let found, selectorNodes, menu, activeNodeName, viewParentPermission = undefined
    for (const node of tree) {
      const { labelKey = 'name', idKey = 'id', nodes, nodeInfo } = node
      const nodeId = node[idKey]

      if (nodeId == this.state.activeNode) {

        found = true
        viewParentPermission = nodeInfo.viewParentPermission
        activeNodeName = node[labelKey]
        selectorNodes = nodes
        break

      } else {

        menu = this.renderDropdown(nodes, nodeId)

        if (menu) {
          return menu
        }
      }
    }
    if (found) {
      return (
        <Dropdown.Menu>
          <SelectorHeader
            parentId={parentId}
            viewParentPermission={viewParentPermission}
            goToParent={this.changeTier}
            searchValue={this.state.search}
            onSearchChange={this.onSearchChange}
            activeNodeName={activeNodeName} />

          <SelectorItems
            handleEntityClick={this.props.handleEntityClick}
            handleCaretClick={this.handleCaretClick}
            goToChild={this.changeTier}
            selectorNodes={selectorNodes}
            searchValue={this.state.search} />
        </Dropdown.Menu>
      )
    }
  }

  render() {
    const { props: { tree, children }, state: { open } } = this

    return (
      <Dropdown id="" open={open} onToggle={() => {/*noop*/}} className="selector-component">
        <ToggleElement bsRole="toggle" toggle={this.toggleMenu}>
          <span>{children}</span>
        </ToggleElement>
        {this.renderDropdown(tree) || <Dropdown.Menu/>}
      </Dropdown>
    )
  }
}

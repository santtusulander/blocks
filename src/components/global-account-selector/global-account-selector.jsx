import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Dropdown } from 'react-bootstrap'

import ToggleElement from './toggle-element'

import propertyActions from '../../redux/modules/entities/properties/actions'
import { getByGroup } from '../../redux/modules/entities/properties/selectors'

import groupActions from '../../redux/modules/entities/groups/actions'
import { getByAccount } from '../../redux/modules/entities/groups/selectors'

import accountActions from '../../redux/modules/entities/accounts/actions'
import { getByBrand } from '../../redux/modules/entities/accounts/selectors'

import SelectorItems from './selector-items'
import SelectorHeader from './selector-header'

class Selector extends Component {

  static emptyArray = []

  state = {
    open: false,
    activeNode: this.props.activeNode,
    search: ''
  }

  componentWillReceiveProps({ activeNode }) {
    activeNode !== this.props.activeNode && this.setState({ activeNode, search: '' })
  }

  onSearchChange = e => {
    this.setState({ search: e.target.value })
  }

  changeTier = activeNode => {
    this.setState({ activeNode, search: '' })
  }

  toggleMenu = () => this.setState({ open: !this.state.open })

  renderDropdown = (tree = Selector.emptyArray, parentId) => {
    console.log('menee tänne');
    let found = false
    let selectorNodes = []
    let recurse = undefined
    let activeNodeName = undefined

    for (const node of tree) {

      const { idKey = 'id', labelKey = 'name', nodes } = node
      const nodeId = node[idKey]

      if (nodeId == this.state.activeNode) {

        found = true
        activeNodeName = node[labelKey]
        selectorNodes = nodes
        break

      } else {
        recurse = this.renderDropdown(nodes, nodeId)
      }
    }

    if (!found) {
      return recurse
    }

    return (
      <Dropdown.Menu>
        <SelectorHeader
          parentId={parentId}
          goToParent={this.changeTier}
          searchValue={this.state.search}
          onSearchChange={this.onSearchChange}
          activeNodeName={activeNodeName} />

        <SelectorItems
          goToChild={this.changeTier}
          selectorNodes={selectorNodes}
          searchValue={this.state.search} />
      </Dropdown.Menu>
    )
  }

  render() {
    const { props: { tree, children }, state: { open } } = this
    const menu = this.renderDropdown(tree)

    return (
      <Dropdown id="" open={open} onToggle={() => {/*noop*/}} className="selector-component">
        <ToggleElement bsRole="toggle" toggle={this.toggleMenu}>
          <span>{children}</span>
        </ToggleElement>
        {menu}
      </Dropdown>
    )
  }
}

const mapStateToProps = () => ({

  activeNode: 6,
  tree: [{
    id: 'udn',
    name: 'UDN Admin',
    fetchChildren: () => Promise.resolve(console.log('fetch accs fron brand udn')),
    nodes: [
      {
        id: 1,
        name: 'acc1',
        fetchChildren: () => Promise.resolve(console.log('fetch grps for acc 1')),
        nodes: []
      },
      {
        id: 3,
        name: 'acc3',
        fetchChildren: () => Promise.resolve(console.log('fetch grps for acc 3')),
        nodes: []
      },
      {
        id: 2,
        name: 'acc2',
        fetchChildren: () => Promise.resolve(console.log('fetch grps for acc id 2')),
        nodes: [
          {
            id: 6,
            name: 'grp1',
            fetchChildren: () => Promise.resolve(console.log('fetch grps for grp 1')),
            nodes: [
              {
                id: 7,
                name: 'prop1',
                fetchChildren: () => Promise.resolve(console.log('fetch grps for grp 1'))
              },
              {
                id: 8,
                name: 'prop2',
                fetchChildren: () => Promise.resolve(console.log('fetch grps for grp 2'))
              },
              {
                id: 9,
                name: 'prop3',
                fetchChildren: () => Promise.resolve(console.log('fetch grps for grp 3'))
              }
            ]
          },
          {
            id: 5,
            name: 'grp2',
            fetchChildren: () => Promise.resolve(console.log('fetch grps for grp 2')),
            nodes: [
              {
                id: 3454,
                name: 'prop1',
                fetchChildren: () => Promise.resolve(console.log('fetch grps for grp 1'))
              },
              {
                id: 843545,
                name: 'prop2',
                fetchChildren: () => Promise.resolve(console.log('fetch grps for grp 2'))
              },
              {
                id: 9345543,
                name: 'prop3',
                fetchChildren: () => Promise.resolve(console.log('fetch grps for grp 3'))
              }
            ]
          },
          {
            id: 4,
            name: 'grp3',
            fetchChildren: () => Promise.resolve(console.log('fetch grps for grp 3')),
            nodes: [
              {
                id: 10,
                name: 'prop1',
                fetchChildren: () => Promise.resolve(console.log('fetch grps for grp 1'))
              },
              {
                id: 16,
                name: 'prop2',
                fetchChildren: () => Promise.resolve(console.log('fetch grps for grp 2'))
              },
              {
                id: 123,
                name: 'prop3',
                fetchChildren: () => Promise.resolve(console.log('fetch grps for grp 3'))
              }
            ]
          }
        ]
      }
    ]
  }]

  // accounts: brand => getByBrand(state, brand),
  // groups: account => getByAccount(state, account),
  // properties: group => getByGroup(state, group)
})

const mapDispatchToProps = (dispatch, { params: { brand } }) => {
  return {
    fetchAccounts: () => dispatch(accountActions.fetchAll({ brand })),
    fetchGroups: (accountId) => dispatch(groupActions.fetchAll({ brand, account: accountId })),
    fetchProperties: (accountId) => (groupId) => dispatch(propertyActions.fetchAll({ brand, account: accountId, group: groupId }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Selector)

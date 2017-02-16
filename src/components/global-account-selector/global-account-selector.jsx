import React, { PropTypes, Component } from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { Dropdown, FormControl } from 'react-bootstrap'

import ToggleElement from './toggle-element'

import propertyActions from '../../redux/modules/entities/properties/actions'
import { getByGroup } from '../../redux/modules/entities/properties/selectors'

import groupActions from '../../redux/modules/entities/groups/actions'
import { getByAccount } from '../../redux/modules/entities/groups/selectors'

import accountActions from '../../redux/modules/entities/accounts/actions'
import { getByBrand } from '../../redux/modules/entities/accounts/selectors'

import IconArrowRight from '../icons/icon-arrow-right'

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

  onSearchChange(e) {
    this.setState({ search: e.target.value })
  }

  changeTier(activeNode) {
    this.setState({ activeNode, search: '' })
  }

  toggleMenu = () => this.setState({ open: !this.state.open })

  renderCaret = (nodeId, fetchChildren) => {

    const handleCaretClick = () => {
      fetchChildren(nodeId).then(() => this.changeTier(nodeId))
    }

    return (
      <a className="caret-container" onClick={handleCaretClick} tabIndex="-1">
        <IconArrowRight />
      </a>
    )
  }

  recursionInfernoStarter = (nodes) => nodes.reduce((listItems, node) => {

    const { idKey = 'id', labelKey = 'name', fetchChildren, nodes } = node

    const nodeId = node[idKey]
    const nodeName = node[labelKey]

    if (nodeName.contains(this.state.search)) {

      listItems.push(
        <li className={classnames({ 'active': this.state.activeNode == nodeId })}>

          <a>{nodeName}</a>

          {nodes && this.renderCaret(nodeId, fetchChildren)}

          {this.renderTree(nodes)}

        </li>
      )
    }

    return listItems
  }, [])

  renderTree = (nodes = Selector.emptyArray) => {
    return (
      <ul className="scrollable-menu">
        {this.recursionInfernoStarter(nodes)}
      </ul>
    )
  }

  render() {

    const { props: { tree, children }, state: { activeNode, search, open } } = this

    const baseListClasses = classnames(
      "scrollable-menu",
      { 'visible': tree.some(({ id }) => id == activeNode) }
    )

    return (
      <Dropdown id="" open={open} onToggle={() => {/*noop*/}} className="selector-component">
        <ToggleElement bsRole="toggle" toggle={this.toggleMenu}>
          <span>{children}</span>
        </ToggleElement>
        <Dropdown.Menu>
          <li className="action-container">
            <FormControl
              className="header-search-input"
              type="text"
              placeholder="Search"
              onChange={this.onSearchChange}
              value={search}/>
          </li>
          <li className="menu-container">
            <ul className={baseListClasses}>
              {this.recursionInfernoStarter(tree)}
            </ul>
          </li>
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

const mapStateToProps = () => ({

  activeNode: 'udn',
  tree: [{
    id: 'udn',
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
            nodes: []
          },
          {
            id: 4,
            name: 'grp3',
            fetchChildren: () => Promise.resolve(console.log('fetch grps for grp 3')),
            nodes: []
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

// {/* <DD
//   entities={accounts(groupId)}
//   nameKey
//   idKey
//   caret={this.caret}
//
//
//   DD = ({ entities, nameKey = 'name', idKey = 'id', caret }) => {
//     return (
//       <ul>
//         {entities.map(entity =>
//           <li>
//             <a>{entity[nameKey]}</a>
//             {caret}
//             <DD
//               entities={accounts(groupId)}
//               nameKey
//               idKey
//               caret={this.caret}/>
//           </li>
//         )}
//       </ul>
//     )
//   } */}

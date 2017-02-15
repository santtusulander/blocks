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

  state = {
    open: false,
    activeNode: this.props.activeNode
  }

  componentWillReceiveProps({ activeNode }) {
    activeNode !== this.props.activeNode && this.setState({ activeNode })
  }

  toggleMenu = () => this.setState({ open: !this.state.open })

  renderCaret = (nodeId, fetchChildren) => {

    const handleCaretClick = () => {
      fetchChildren(nodeId).then(() =>
        this.setState({ activeNode: nodeId })
      )
    }

    return (
      <a className="caret-container" onClick={handleCaretClick} tabIndex="-1">
        <IconArrowRight />
      </a>
    )
  }

  goBack = entityType => this.setState({ [entityType]: undefined })

  renderTree = (tree) => {

    const { nodes, idKey = 'id', fetchChildren } = tree
    const parentId = tree[idKey]

    return (
      <ul className="scrollable-menu">
        {nodes.map((node) => {

          const { idKey = 'id', labelKey = 'name' } = node

          const nodeId = node[idKey]
          const nodeName = node[labelKey]

          return (
            <li className={classnames({ 'active': this.state.activeNode == nodeId })}>

              <a>{nodeName}</a>

              {this.renderCaret(nodeId, fetchChildren)}

              {this.renderTree(node)}

            </li>
          )
        })}
      </ul>
    )
  }

  render() {
    return (
      <Dropdown id="" open={this.state.open} onToggle={() => {/*noop*/}} className="selector-component">
        <ToggleElement bsRole="toggle" toggle={this.toggleMenu}>
          <span>{this.props.children}</span>
        </ToggleElement>
        <Dropdown.Menu>
          <li className="action-container">
            <FormControl
              className="header-search-input"
              type="text"
              placeholder="Search"
              value={''}/>
          </li>
          <li className="menu-container">
            {this.renderTree(this.props.tree)}
          </li>
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

const mapStateToProps = () => ({
  activeNode: 'udn',
  tree: {
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
                fetchChildren: () => Promise.resolve(console.log('fetch grps for grp 1')),
                nodes: []
              },
              {
                id: 8,
                name: 'prop2',
                fetchChildren: () => Promise.resolve(console.log('fetch grps for grp 2')),
                nodes: []
              },
              {
                id: 9,
                name: 'prop3',
                fetchChildren: () => Promise.resolve(console.log('fetch grps for grp 3')),
                nodes: []
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
  }

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

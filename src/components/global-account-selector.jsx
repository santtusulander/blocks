import React, { PropTypes, Component } from 'react'
import { Dropdown, MenuItem, Input } from 'react-bootstrap'
import classnames from 'classnames'
import { List } from 'immutable'
import { connect } from 'react-redux'

import {
  fetchAccountsForModal as fetchAccounts,
  fetchGroupsForModal as fetchGroups,
  fetchPropertiesForModal as fetchHosts } from '../redux/modules/security'

import IconSelectCaret from './icons/icon-select-caret.jsx'

let tier
class AccountSelector extends Component {
  constructor(props) {
    super(props)
    this.account = null
    this.group = null
    this.state = {
      open: false
    }
    this.selectOption = this.selectOption.bind(this)
  }

  componentWillMount() {
    this.fetchByTier()
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.params !== this.props.params) {
      this.fetchByTier()
    }
  }

  setInitialTier() {
    const { property, group, account } = this.props.params
    tier = property && 'property' || group && 'group' || account && 'account'
  }

  fetchByTier() {
    this.setInitialTier()
    const params = Object.keys(this.props.params).map(param => {
      this[param] = this.props.params[param]
      return this.props.params[param]}
    )
    this.props.fetchItems(tier, ...params)
  }

  selectOption(e) {
    const { onSelect, fetchItems, params: {account } } = this.props
    if(e.target.id === 'name') {
      this.setState({ open: !this.state.open })
      onSelect(e.target.getAttribute('data-value'))
      this.setInitialTier()
    } else if(e.target.id === 'back') {
      switch(tier) {
        case 'property': fetchItems('group', 'udn', this.account || account)
          break
        case 'group': fetchItems('account', 'udn')
          break
      }
    } else {
      /**
       * Caret pressed -> should go one tier deeper
       */
      switch(tier) {
        case 'group':
          this.group = e.target.getAttribute('data-value')
          fetchItems('property', 'udn', this.account, this.group)
          break
        case 'account':
          this.account = e.target.getAttribute('data-value')
          fetchItems('group', 'udn', this.account)
          break
      }

    }
  }

  sortedOptions(items) {
    return items.sort((a,b) => {
      if ( a[1].toLowerCase() < b[1].toLowerCase() ) return -1
      if ( a[1].toLowerCase() > b[1].toLowerCase() ) return 1
      return 0
    })
  }

  render() {
    const { ...menuProps } = this.props
    const classname = classnames({ classname })
    return (
      <Menu
        {...menuProps}
        toggle={() => this.setState({ open: !this.state.open })}
        open={this.state.open}
        onSelect={this.selectOption}/>
    )
  }
}

const Menu = ({ items, drillable, classname, children, onSelect, open, toggle, previousTier }) => {
  return (
     <Dropdown id="" className={classname} onSelect={onSelect} open={open}>
        <span bsRole="toggle" onClick={toggle}>{children}</span>
        <span className="caret-container">
          <IconSelectCaret/>
        </span>
        <Dropdown.Menu>
          <MenuItem>
            <Input className="header-search-input" type="text" placeholder="Search" />
          </MenuItem>
          <MenuItem id="back">
            Back to {previousTier}
          </MenuItem>
          {items.map((option, i) =>
            <MenuItem key={i} data-value={option[0]}>
              <span id="name" data-value={option[0]}>{option[1]}</span>
              {drillable &&
                <span className="caret-container">
                  <IconSelectCaret/>
                </span>}
            </MenuItem>
          )}
        </Dropdown.Menu>
      </Dropdown>
  )
}

AccountSelector.propTypes = {
  className: PropTypes.string,
  items: PropTypes.instanceOf(List),
  params: PropTypes.object
}

AccountSelector.defaultProps = {
  items: List()
}

function mapStateToProps(state) {
  const items = state.security.get('groups').map(item => [item.get('id'), item.get('name')]).toJS()
  return {
    items
  }
}

function mapDispatchToProps(dispatch) {
  function fetchItems(nextTier, ...params) {
    switch(nextTier) {
      case 'property':
//        console.log('peroperty fetch:',tier)
        dispatch(fetchHosts(...params))
        break
      case 'group':
  //    console.log('group fetch:',tier)
        dispatch(fetchGroups(...params))
        break
      case 'account':
  //   console.log('acc fetch:',tier)
        dispatch(fetchAccounts(...params))
        break
    }
    tier = nextTier
  }
  return {
    fetchItems
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSelector);

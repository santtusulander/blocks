import React, { PropTypes, Component } from 'react'
import { Dropdown, MenuItem, Input } from 'react-bootstrap'
import classnames from 'classnames'
import { List } from 'immutable'
import { connect } from 'react-redux'

import { fetchAccounts } from '../redux/modules/account'
import { fetchGroups } from '../redux/modules/group'
import { fetchHosts } from '../redux/modules/host'

import IconSelectCaret from './icons/icon-select-caret.jsx'

class AccountSelector extends Component {
  constructor(props) {
    super(props)
    this.accountId = null
    this.groupId = null
    this.tier = null
    this.state = {
      open: false
    }
    this.selectOption = this.selectOption.bind(this)
  }

  componentWillMount() {
    const { property, group, account } = this.props.params
    const tier = property && 'property' || group && 'group' || account && 'account'
    this.tier = tier
    this.props.fetchItems(tier, this.props.params)
  }

  selectOption(e) {
    const { onSelect, fetchItems } = this.props
    console.log(this.tier)
    if(e.target.id === 'name') {
      this.setState({ open: !this.state.open })
      onSelect(e.target.getAttribute('data-value'))
    } else {
      switch(this.tier) {
        case 'property':
          fetchItems(this.tier, this.accountId, this.groupId)
          break
        case 'group':
          this.tier = 'property'
          this.groupId = e.target.getAttribute('data-value')
          fetchItems(this.tier, this.accountId)
          break
        case 'account':
          this.tier = 'group'
          this.accountId = e.target.getAttribute('data-value')
          fetchItems(this.tier)
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

const Menu = ({ items, drillable, classname, children, onSelect, open, toggle }) => {
  return (
     <Dropdown id="" className={classname} onSelect={onSelect} open={open}>
        <span bsRole="toggle" onClick={toggle}>{children}</span>
        <span className="caret-container">
          <IconSelectCaret/>
        </span>
        <Dropdown.Menu>
          <Input className="header-search-input" type="text" placeholder="Search" />
          {items.map((option, i) =>
            <MenuItem key={i}>
              <span id="name" data-value={option[0]}>{option[1]}</span>
              {drillable &&
                <span className="caret-container" data-value={option[1]}>
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
  items: PropTypes.instanceOf(List)
}

AccountSelector.defaultProps = {
  items: List()
}

function mapStateToProps(state, ownProps) {
  const { property, group, account } = ownProps.params
  const tier = property && 'property' || group && 'group' || account && 'account'
  let items = []
  switch(tier) {
    case 'property':
      console.log(state[tier].toJS())
      items = state[tier].get('allHosts').map(property => [property, property]).toJS()
      break
    case 'group':
      console.log(state[tier].toJS())
      items = state[tier].get('allGroups').map(group => [group.get('id'), group.get('name')]).toJS()
      break
    case 'account':
      console.log(state[tier].toJS())
      items = state[tier].get('allAccounts').map(account => [account.get('id'), account.get('name')]).toJS()
      break
  }
  return {
    items,
    tier
  }
}

function mapDispatchToProps(dispatch) {
  function fetchItems(tier, ...IDs) {
    switch(tier) {
      case 'property': dispatch(fetchHosts('udn', ...IDs))
        break
      case 'group': dispatch(fetchGroups('udn', ...IDs))
        break
      case 'account': dispatch(fetchAccounts('udn', ...IDs))
        break
    }
  }
  return {
    fetchItems
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSelector);

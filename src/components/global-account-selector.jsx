import React, { PropTypes, Component } from 'react'
import { Dropdown, MenuItem, Input } from 'react-bootstrap'
import classnames from 'classnames'
import { List } from 'immutable'
import { connect } from 'react-redux'

import { fetchAccounts } from '../redux/modules/account'
import { fetchGroups } from '../redux/modules/group'
import { fetchHosts } from '../redux/modules/host'

import IconSelectCaret from './icons/icon-select-caret.jsx'

let tier = null
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

  getInitialTier() {
    const { property, group, account } = this.props.params
    return property && 'property' || group && 'group' || account && 'account'
  }

  fetchByTier() {
    tier = this.getInitialTier()
    const params = Object.keys(this.props.params).map(param => {
      this[param] = this.props.params[param]
      return this.props.params[param]}
    )
    this.props.fetchItems(tier, ...params)
  }

  selectOption(e) {
    const { onSelect, fetchItems } = this.props
    if(e.target.id === 'name') {
      this.setState({ open: !this.state.open })
      onSelect(e.target.getAttribute('data-value'))
      tier = this.getInitialTier()
    } else {
      /**
       * Caret pressed -> should go one tier deeper
       */
      switch(tier) {
        case 'group':
          tier = 'property'
          console.log('group caret case: ', e.target)
          this.group = e.target.getAttribute('data-value')
          fetchItems(tier, 'udn', this.account, this.group)
          break
        case 'account':
          tier = 'group'
          this.account = e.target.getAttribute('data-value')
          fetchItems(tier, 'udn', this.account)
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
  items: PropTypes.instanceOf(List)
}

AccountSelector.defaultProps = {
  items: List()
}

function mapStateToProps(state) {
  let items = []
  switch(tier) {
    case 'property':
      console.log(state.host.toJS())
      items = state.host.get('allHosts').map(property => [property, property]).toJS()
      break
    case 'group':
      //console.log(state[tier].toJS())
      items = state[tier].get('allGroups').map(group => [group.get('id'), group.get('name')]).toJS()
      break
    case 'account':
      console.log(state[tier].toJS())
      items = state[tier].get('allAccounts').map(account => [account.get('id'), account.get('name')]).toJS()
      break
  }
  return {
    items
  }
}

function mapDispatchToProps(dispatch) {
  function fetchItems(tier, ...params) {
    console.log(tier)
    switch(tier) {
      case 'property':
        dispatch(fetchHosts(...params))
        break
      case 'group':
        dispatch(fetchGroups(...params))
        break
      case 'account':
        dispatch(fetchAccounts(...params))
        break
    }
  }
  return {
    fetchItems
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSelector);

import React, { PropTypes, Component } from 'react'
import classnames from 'classnames'
import { List } from 'immutable'
import { connect } from 'react-redux'

import {
  fetchAccountsForModal as fetchAccounts,
  fetchGroupsForModal as fetchGroups,
  fetchPropertiesForModal as fetchHosts } from '../redux/modules/security'

import Menu from '../components/global-account-selector'

let tier
class AccountSelector extends Component {
  constructor(props) {
    super(props)
    this.account = null
    this.group = null
    this.state = {
      open: false,
      searchValue: ''
    }
    this.selectOption = this.selectOption.bind(this)
  }

  componentWillMount() {
    this.fetchByTier(this.props.params)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.params !== this.props.params) {
      this.fetchByTier(nextProps.params)
    }
  }

  setInitialTier(params) {
    const { property, group, account } = params
    tier = property && 'property' || group && 'group' || account && 'account'
  }

  fetchByTier(params) {
    this.setInitialTier(params)
    const paramArray = Object.keys(params).map(param => {
      this[param] = params[param]
      return params[param]
    })
    this.props.fetchItems(tier, ...paramArray)
  }

  onChange(e) {
    this.setState({ searchValue: e.target.value });
  }

  selectOption(e) {
    const { onSelect, fetchItems, params: { account, group } } = this.props
    switch(e.target.id) {
      case 'name':
        this.setState({ open: !this.state.open })
        onSelect(
          e.target.getAttribute('data-value'),
          tier,
          { brand: 'udn', account: this.account || account, group: this.group || group }
        )
        break
      case 'back':
        switch(tier) {
          case 'property':
            fetchItems('group', 'udn', this.account || account)
            break
          case 'group': fetchItems('account', 'udn')
            break
        }
        break
      case 'item-bg':
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
    const { searchValue } = this.state
    const itemsToSort = searchValue !== '' ?
      items.filter(item => item[1].toLowerCase().includes(searchValue.toLowerCase())) :
      items
    return itemsToSort.sort((a,b) => {
      if ( a[1].toLowerCase() < b[1].toLowerCase() ) return -1
      if ( a[1].toLowerCase() > b[1].toLowerCase() ) return 1
      return 0
    })
  }

  render() {
    const { searchValue, open } = this.state
    const { items, ...other } = this.props
    const menuProps = Object.assign(other, {
      items: this.sortedOptions(items),
      searchValue,
      open,
      toggle: () => this.setState({ open: !this.state.open }),
      onSelect: this.selectOption,
      onSearch: e => this.setState({ searchValue: e.target.value })
    })
    const classname = classnames({ classname })
    return (
      <Menu { ...menuProps }/>
    )
  }
}

AccountSelector.propTypes = {
  className: PropTypes.string,
  fetchItems: PropTypes.func,
  items: PropTypes.instanceOf(List),
  onSelect: PropTypes.func,
  params: PropTypes.object
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

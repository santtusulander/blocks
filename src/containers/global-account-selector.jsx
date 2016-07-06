import React, { PropTypes, Component } from 'react'
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
    const { onSelect, topBarAction, fetchItems, params: { account, group, property } } = this.props
    switch(e.target.id) {
      /**
       * Item name pressed -> should route to that item
       */
      case 'name':
        this.setState({ open: !this.state.open })
        onSelect(
          e.target.getAttribute('data-value'),
          tier,
          { brand: 'udn', account: this.account || account, group: this.group || group }
        )
        break
      case 'top-bar':
      /**
       * top bar pressed -> some action from parent launched
       */
        topBarAction(
          tier,
          fetchItems,
          {
            account: this.account || account,
            group: this.group || group,
            property: this.property || property
          })
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
    const { items, topBarTexts, ...other } = this.props
    const menuProps = Object.assign(other, {
      toggle: () => this.setState({ open: !this.state.open }),
      onSearch: e => this.setState({ searchValue: e.target.value }),
      items: this.sortedOptions(items),
      topBarText: topBarTexts[tier],
      onSelect: this.selectOption,
      searchValue,
      tier,
      open
    })
    return (
      <Menu { ...menuProps }/>
    )
  }
}

AccountSelector.propTypes = {
  className: PropTypes.string,
  drillable: PropTypes.boolean,
  fetchItems: PropTypes.func,
  items: PropTypes.array,
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
        dispatch(fetchHosts(...params))
        break
      case 'group':
        dispatch(fetchGroups(...params))
        break
      case 'account':
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
